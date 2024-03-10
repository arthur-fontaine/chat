import React, { useCallback, useMemo, useRef } from 'react'
import { FlatList, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { MessageBubble } from './message-bubble'
import { MessagesDate } from './messages-date'
import { useMessages } from '~/hooks/use-messages'
import type { Message } from '~/types/message'

export const MessagesView = React.memo(({
  onFirstViewableDateChange,
}: {
  onFirstViewableDateChange: (date: Date) => void
}) => {
  const { messages } = useMessages()

  const messagesWithDateHeaders = useMessagesWithDateHeaders(messages)
  const renderMessageBubble = useRenderMessageBubble({
    messagesWithDateHeaders,
  })
  const { handleViewableItemsChanged } = useDateHeaderController({
    onFirstViewableDateChange,
  })

  return (
    <FlatList
      data={messagesWithDateHeaders}
      inverted
      keyExtractor={item => item.id.toString()}
      onViewableItemsChanged={handleViewableItemsChanged}
      renderItem={renderMessageBubble}
      scrollEnabled
      showsVerticalScrollIndicator={false}
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
        { date: Date, id: number, type: 'header' } |
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
            id: messageDate.getTime(),
            type: 'header' as const,
          }] : []),
          ...acc,
        ]
      }, [])

    return messagesWithDateHeaders
  }, [messages])

  return messagesWithDateHeaders
}

function useRenderMessageBubble({ messagesWithDateHeaders }: {
  messagesWithDateHeaders: ReturnType<typeof useMessagesWithDateHeaders>
}) {
  const { styles } = useStyles(stylesheet)

  const firstIndex = useMemo(() => messagesWithDateHeaders.length - 1, [
    messagesWithDateHeaders,
  ]) // The first index is the last message because the list is inverted

  const renderItem = useCallback(
    ({ index, item }: {
      index: number
      item: typeof messagesWithDateHeaders[number]
    }) => {
      if (item.type === 'header') {
        return (
          <View style={[
            styles.messageContainer,
            index === firstIndex && styles.firstMessageContainer,
          ]}
          >
            <MessagesDate date={item.date} />
          </View>
        )
      }

      return (
        <View style={[
          styles.messageContainer,
          index === firstIndex && styles.firstMessageContainer,
        ]}
        >
          <MessageBubble message={item} />
        </View>
      )
    },
    [styles],
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
  firstMessageContainer: {
    marginTop: theme.spacings.large,
  },
  messageContainer: {
    marginBottom: theme.spacings.large,
  },
}))
