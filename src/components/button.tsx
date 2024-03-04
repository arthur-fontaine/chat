import { Feather } from '@expo/vector-icons'
import { useMemo } from 'react'
import { Pressable, Text, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

interface ButtonProps {
  children?: string
  disabled?: boolean
  iconName?: keyof typeof Feather['glyphMap']
  onPress?: () => void
}

export function Button({ children, disabled, iconName, onPress }: ButtonProps) {
  const { styles } = useStyles(stylesheet)

  const button = useMemo(() => (
    <View style={[
      styles.button,
      iconName !== undefined && children === undefined && { aspectRatio: 1 },
    ]}
    >
      <Text>{children}</Text>
      {iconName !== undefined && (
        <Feather
          color={styles.button.color}
          name={iconName}
          size={24}
        />
      )}
    </View>
  ), [children, iconName, onPress])

  return (
    <Pressable disabled={disabled} onPress={onPress}>
      <View style={[disabled && styles.disabled]}>
        {button}
      </View>
    </Pressable>
  )
}

const stylesheet = createStyleSheet(theme => ({
  button: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.button,
    borderRadius: theme.radii.full,
    color: theme.colors.text,
    flexDirection: 'row',
    height: theme.heights.input,
    justifyContent: 'center',
  },
  disabled: {
    opacity: theme.opacities.subtle,
  },
}))
