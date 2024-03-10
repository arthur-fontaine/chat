import { Feather } from '@expo/vector-icons'
import { Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useMemo } from 'react'
import { format } from '@formkit/tempo'
import colorConvert from 'color-convert'

import type { Message } from '~/types/message'
import { useError } from '~/hooks/use-error'
import { useProfiles } from '~/hooks/use-profiles'
import { useAuth } from '~/hooks/use-auth'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { styles, theme } = useStyles(stylesheet)

  const augmentedMessage = useAugmentedMessage(message)

  const formattedHour = useMemo(() =>
    augmentedMessage && format({
      date: augmentedMessage.date,
      format: { time: 'short' },
    }), [augmentedMessage])

  if (!augmentedMessage) {
    return null
  }

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
          {augmentedMessage.text}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.hour}>
            {formattedHour}
          </Text>
          <View>
            {augmentedMessage.state === 'sending' && (
              <Feather
                color={theme.colors.text}
                name="clock"
                size={styles.icon.width}
                style={styles.icon}
              />
            )}
            {augmentedMessage.state === 'received' && (
              <Feather
                color={theme.colors.text}
                name="check"
                size={styles.icon.width}
                style={styles.icon}
              />
            )}
            {augmentedMessage.state === 'seen' && (
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

function useAugmentedMessage(message: Message) {
  const { throwError } = useError()

  const { profiles } = useProfiles() // TODO: We may want to add a selector, to get only the profile of the message author.
  const { userId } = useAuth()

  return useMemo(() => {
    const profile = profiles.find(
      p => p.userId === message.fromId,
    )

    if (!profile) {
      throwError(new Error('Message author profile not found'))
      return
    }

    return {
      ...message,
      color: message.color ?? profile.color,
      colorGradient: getColorGradient(profile.color),
      position: message.fromId === userId ? 'right' as const : 'left' as const,
    }
  }, [message, profiles, userId])
}

function getColorGradient(baseColor: string): [string, string] {
  const secondColorHsl = colorConvert.hex.hsl(baseColor)
  if (secondColorHsl[2] > 50) {
    secondColorHsl[2] -= 1
  }
  else {
    secondColorHsl[2] += 1
  }
  const secondColor = colorConvert.hsl.hex(secondColorHsl)

  return [baseColor, `#${secondColor}`]
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
