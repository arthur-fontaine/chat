import { Feather } from '@expo/vector-icons'
import { Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useMemo } from 'react'
import { format } from '@formkit/tempo'

import type { Message } from '~/types/message'
import type { Conversation } from '~/types/conversation'
import { useError } from '~/hooks/use-error'

interface MessageBubbleProps {
  conversation: Conversation
  message: Message
}

export function MessageBubble({ conversation, message }: MessageBubbleProps) {
  const { styles, theme } = useStyles(stylesheet)

  const augmentedMessage = useAugmentedMessage(conversation, message)

  if (!augmentedMessage) {
    return null
  }

  const formattedHour = useMemo(() =>
    format({
      date: message.date,
      format: { time: 'short' },
    }), [message.date])

  return (
    <View style={styles.messageContainer}>
      <View
        style={[styles.message, styles[`${augmentedMessage.position}Message`]]}
      >
        <LinearGradient
          colors={augmentedMessage.colorGradient}
          style={styles.gradient}
        />
        <View
          style={[styles.backgroundOverlay, styles[`${augmentedMessage.position}BackgroundOverlay`]]}
        />
        <Text style={styles.text}>
          {message.text}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.hour}>
            {formattedHour}
          </Text>
          <View>
            {message.state === 'sending' && (
              <Feather
                color={theme.colors.text}
                name="clock"
                size={styles.icon.width}
                style={styles.icon}
              />
            )}
            {message.state === 'received' && (
              <Feather
                color={theme.colors.text}
                name="check"
                size={styles.icon.width}
                style={styles.icon}
              />
            )}
            {message.state === 'seen' && (
              <View style={{ flexDirection: 'row', gap: -12 }}>
                <Feather
                  color={augmentedMessage.color}
                  name="check"
                  size={styles.icon.width}
                  style={[styles.icon, styles.seenIcon]}
                />
                <Feather
                  color={augmentedMessage.color}
                  name="check"
                  size={styles.icon.width}
                  style={[styles.icon, styles.seenIcon]}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

function useAugmentedMessage(conversation: Conversation, message: Message) {
  const { throwError } = useError()

  return useMemo(() => {
    const participant = conversation.participants.find(
      p => p.id === message.fromId,
    )

    if (!participant) {
      throwError(new Error('Participant not found'))
      return
    }

    return {
      ...message,
      ...participant,
      position: participant.isMe ? 'right' as const : 'left' as const,
    }
  }, [conversation, message])
}

const stylesheet = createStyleSheet((theme) => {
  const borderWidth = 2

  return {
    backgroundOverlay: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.radii.normal - borderWidth,
      bottom: borderWidth,
      left: borderWidth,
      opacity: 0.5,
      position: 'absolute',
      right: borderWidth,
      top: borderWidth,
      zIndex: -1,
    },
    footer: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.spacings.xsmall,
      justifyContent: 'flex-end',
      padding: theme.spacings.large,
      paddingVertical: theme.spacings.small,
    },
    gradient: {
      height: '100%',
      left: 0,
      position: 'absolute',
      top: 0,
      width: '100%',
      zIndex: -1,
    },
    hour: {
      color: theme.colors.text,
      fontSize: theme.fontSizes.small,
      opacity: theme.opacities.subtle,
    },
    icon: {
      opacity: theme.opacities.subtle,
      width: 16,
    },
    leftBackgroundOverlay: {
      borderBottomLeftRadius: 0,
    },
    leftMessage: {
      borderBottomLeftRadius: 0,
      marginLeft: 0,
    },
    message: {
      borderRadius: theme.radii.normal,
      maxWidth: '80%',
      overflow: 'hidden',
      width: 'auto',
    },
    messageContainer: {
      flexDirection: 'row',
      width: '100%',
    },
    rightBackgroundOverlay: {
      borderBottomRightRadius: 0,
    },
    rightMessage: {
      borderBottomRightRadius: 0,
      marginLeft: 'auto',
    },
    seenIcon: {
      opacity: 1,
    },
    text: {
      color: theme.colors.text,
      fontSize: theme.fontSizes.normal,
      padding: theme.spacings.xlarge,
      paddingBottom: 0,
    },
  }
})
