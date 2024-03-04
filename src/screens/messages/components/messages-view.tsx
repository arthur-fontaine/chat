import React, { useCallback, useMemo, useRef } from 'react'
import { FlatList } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { MessageBubble } from './message-bubble'
import { MessagesDate } from './messages-date'
import { useConversation } from '~/hooks/use-conversation'
import { useMessages } from '~/hooks/use-messages'
import type { Conversation } from '~/types/conversation'
import type { Message } from '~/types/message'

export const MessagesView = React.memo(({
  onFirstViewableDateChange,
}: {
  onFirstViewableDateChange: (date: Date) => void
}) => {
  const { styles } = useStyles(stylesheet)

  const { messages } = useMessages()
  const { conversation } = useConversation()

  const messagesWithDateHeaders = useMessagesWithDateHeaders(messages)
  const renderMessageBubble = useRenderMessageBubble(conversation)
  const { handleViewableItemsChanged } = useDateHeaderController({
    onFirstViewableDateChange,
  })

  return (
    <FlatList
      contentContainerStyle={styles.messagesContainer}
      data={messagesWithDateHeaders}
      inverted
      keyExtractor={item => item.id}
      onViewableItemsChanged={handleViewableItemsChanged}
      renderItem={renderMessageBubble}
      scrollEnabled
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 0,
      }}
    />
  )
})

function useMessagesWithDateHeaders(messages: Message[]) {
  const messagesWithDateHeaders = useMemo(() => {
    const messagesWithDateHeaders = messages
      .reduce<(
        { date: Date, id: string, type: 'header' } |
        Message & { type: 'message' }
    )[]>((acc, message, index) => {
        const previousMessage = messages[index - 1]

        const previousMessageDate = new Date(previousMessage?.date)
        previousMessageDate?.setHours(0, 0, 0, 0)
        const messageDate = new Date(message.date)
        messageDate.setHours(0, 0, 0, 0)

        const showDate = (
          !previousMessageDate
          || previousMessageDate.getTime() !== messageDate.getTime()
        )

        return [
          {
            ...message,
            type: 'message' as const,
          },
          ...(showDate ? [{
            date: messageDate,
            id: `header-${messageDate.getTime()}`,
            type: 'header' as const,
          }] : []),
          ...acc,
        ]
      }, [])

    return messagesWithDateHeaders
  }, [messages])

  return messagesWithDateHeaders
}

function useRenderMessageBubble(conversation: Conversation) {
  const renderItem = useCallback(
    ({ item }: {
      item: ReturnType<typeof useMessagesWithDateHeaders>[number]
    }) => {
      if (item.type === 'header') {
        return (
          <MessagesDate date={item.date} />
        )
      }

      return (
        <MessageBubble
          conversation={conversation}
          message={item}
        />
      )
    },
    [conversation],
  )

  return renderItem
}

function useDateHeaderController({
  onFirstViewableDateChange,
}: {
  onFirstViewableDateChange: (date: Date) => void
}) {
  const firstViewableDate = useRef<Date | null>(null)

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: {
      viewableItems: {
        item: ReturnType<typeof useMessagesWithDateHeaders>[number]
      }[]
    }) => {
      const minDate = viewableItems.at(-1)?.item.date
      if (minDate
        && (
          !firstViewableDate.current
          || minDate.getTime() !== firstViewableDate.current.getTime()
        )
      ) {
        firstViewableDate.current = minDate
        onFirstViewableDateChange(minDate)
      }
    },
    [onFirstViewableDateChange],
  )

  return { firstViewableDate, handleViewableItemsChanged }
}

const stylesheet = createStyleSheet(theme => ({
  messagesContainer: {
    gap: theme.spacings.large,
    paddingVertical: theme.spacings.large,
  },
}))
