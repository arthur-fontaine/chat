import { useCallback, useEffect, useMemo } from 'react'
import { eq, inArray } from 'drizzle-orm'
import { atom, task } from 'nanostores'
import { useStore } from '@nanostores/react'
import { useError } from './use-error'
import { useAuth } from './use-auth'
import type { Message } from '~/types/message'
import { db } from '~/database/database'
import { supabase } from '~/utils/supabase'
import { arrayUniqueDifference } from '~/utils/array-unique-difference'

// Define the hook.

export function useMessages() {
  const { throwError } = useError()

  // Initialize the messages atom when the user is authenticated.
  const { authenticated, userId } = useAuth()
  useEffect(() => {
    if (authenticated) {
      initializeMessages()
    }
  }, [authenticated])

  const unsortedMessages = useStore(messagesAtom)
  const messages = useMemo(
    () => unsortedMessages
      .sort((a, b) => a.date.getTime() - b.date.getTime()),
    [unsortedMessages],
  )

  const sendMessage_ = useCallback(
    async (message: Pick<Message, 'text'>) => {
      if (!userId) {
        throwError(new Error('User is not authenticated'))
        return
      }

      await sendMessage({
        currentMessages: messages,
        message,
        onError: throwError,
        userId,
      })
    },
    [messages, throwError, userId],
  )

  return {
    messages,
    sendMessage: sendMessage_,
  }
}

// Initialize the messages atom.
// The atom acts as a middleware between the local and remote databases, and the UI.
//
//                ┌--(init)--┐
//                ˅          |
// Remote DB -> Atom -> Local DB
//                 └--> UI

const messagesAtom = atom<Message[]>([])

function initializeMessages() {
  task(async () => {
    await Promise.allSettled([
      // Initialize the messages atom with the messages from the remote database.
      supabase.from('messages').select()
        .then(({ data }) => messagesAtom.set(
          data?.map(supabaseMessageToMessage) ?? [],
        )),

      // Initialize the messages atom with the messages from the local database.
      db.query.messages.findMany().then(messagesAtom.set),
    ])
  })
}

async function sendMessage({
  currentMessages,
  message,
  onError,
  userId,
}: {
  currentMessages: Message[]
  message: Pick<Message, 'text'>
  onError: (error: Error) => void
  userId: string
}) {
  const newMessage: Message = {
    ...message,
    color: undefined, // TODO: In the future, we may allow users to set their own color.
    date: new Date(),
    fromId: userId,
    id: Math.max(...currentMessages.map(message => message.id), 0) + 1,
    state: 'sending',
  }
  messagesAtom.set([...messagesAtom.get(), newMessage])

  // Send the message to the remote database.
  const newState = await supabase.from('messages')
    .insert([messageToSupabaseMessage(newMessage)])
    .then((result) => {
      if (result.error) {
        onError(new Error(result.error.message))
        return 'failed'
      }
      return 'sent'
    })

  // Update the message state in the atom.
  messagesAtom.set(
    messagesAtom.get().map(message =>
      message.id === newMessage.id
        ? { ...newMessage, state: newState }
        : message,
    ),
  )
}

// Keep the messages atom in sync with the local database (cache).
// atom -> local database

messagesAtom.listen(async (currentMessages, oldMessages) => {
  const diffMessages = arrayUniqueDifference(oldMessages, currentMessages, {
    getKey: message => message.id,
    isItemUpdated: (oldMessage, currentMessage) =>
      oldMessage.text !== currentMessage.text
      || oldMessage.state !== currentMessage.state,
  })

  await Promise.allSettled([
    // Update the local database with the added messages.
    diffMessages.added.length > 0 && db
      .insert(db.tables.messages)
      .values(diffMessages.added)
      .onConflictDoNothing(),

    // Update the local database with the removed messages.
    diffMessages.removed.length > 0 && db
      .delete(db.tables.messages)
      .where(inArray(
        db.tables.messages.id,
        diffMessages.removed.map(message => message.id),
      )),

    // Update the local database with the updated messages.
    ...diffMessages.updated.map(message =>
      db
        .update(db.tables.messages)
        .set(message)
        .where(eq(db.tables.messages.id, message.id)),
    ),

    // Update the remote database with the added and updated messages.
    supabase.from('messages').upsert(
      [...diffMessages.added, ...diffMessages.updated]
        .map(messageToSupabaseMessage),
    ),

    // Update the remote database with the removed messages.
    supabase.from('messages')
      .delete()
      .in('id', diffMessages.removed.map(message => message.id)),
  ])
})

// Keep the messages atom in sync with the remote database.
// remote database -> atom

type SupabaseMessage = supabase['tables']['messages']['Row']

supabase.channel('messages')
  // Listen to insert on the messages table.
  .on<SupabaseMessage>(
  'postgres_changes',
  { event: 'INSERT', schema: 'public', table: 'messages' },
  (payload) => {
    const messages = messagesAtom.get()
    const newMessage = supabaseMessageToMessage(payload.new)

    const messageIndex
        = messages.findIndex(message => message.text === newMessage.text
        && message.date.getTime() === newMessage.date.getTime())

    if (messageIndex !== -1) {
      // If the message already exists, update it.
      messages[messageIndex] = newMessage
      messagesAtom.set(messages)
    }
    else {
      messagesAtom.set([...messages, newMessage])
    }
  },
)
  // Listen to delete on the messages table.
  .on<SupabaseMessage>(
  'postgres_changes',
  { event: 'DELETE', schema: 'public', table: 'messages' },
  payload => messagesAtom.set(
    messagesAtom.get().filter(message => message.id !== payload.old.id),
  ),
)
  // Listen to update on the messages table.
  .on<SupabaseMessage>(
  'postgres_changes',
  { event: 'UPDATE', schema: 'public', table: 'messages' },
  (payload) => {
    messagesAtom.set(
      messagesAtom.get().map(message =>
        message.id === payload.new.id
          ? supabaseMessageToMessage(payload.new)
          : message,
      ),
    )
  },
)
  .subscribe()

// Utility functions.

function supabaseMessageToMessage(
  supabaseMessage: supabase['tables']['messages']['Row'],
): Message {
  return {
    color: supabaseMessage.color ? `#${supabaseMessage.color.toString(16)}` : null,
    date: new Date(supabaseMessage.created_at),
    fromId: supabaseMessage.sender,
    id: supabaseMessage.id,
    state: 'received', // TODO: Replace with the actual state.
    text: supabaseMessage.message,
  }
}

function messageToSupabaseMessage(
  message: Message,
): supabase['tables']['messages']['Row'] {
  return {
    color: message.color ? Number.parseInt(message.color.slice(1), 16) : null,
    created_at: message.date.toISOString(),
    id: message.id,
    message: message.text,
    sender: message.fromId,
    user_pair: 1, // TODO: Replace with the actual user pair.
  }
}
