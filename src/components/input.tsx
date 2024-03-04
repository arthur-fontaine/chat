import { useCallback, useMemo, useState } from 'react'
import type { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native'
import { TextInput, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

interface InputProps
  extends Pick<TextInput['props'], 'autoCapitalize' | 'inputMode' | 'placeholder' | 'secureTextEntry' | 'textContentType'> {
  onChangeValue?: (value: string) => void
  style?: View['props']['style']
}

export function Input({
  onChangeValue,
  style: inputContainerStyle,
  ...textInputProps
}: InputProps) {
  const { styles, theme } = useStyles(stylesheet)

  const { onChange, placeholderShown } = useInputController({ onChangeValue })

  return (
    <View style={[styles.inputContainer, inputContainerStyle]}>
      <TextInput
        {...textInputProps}
        onChange={onChange}
        placeholderTextColor={theme.colors.text}
        style={[styles.input, placeholderShown && styles.placeholder]}
      />
    </View>
  )
}

interface InputControllerProps {
  onChangeValue?: (value: string) => void
}

function useInputController({ onChangeValue }: InputControllerProps) {
  const [value, setValue] = useState('')

  const placeholderShown = useMemo(() => value === '', [value])
  const onChange = useCallback(
    (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      setValue(e.nativeEvent.text)
      onChangeValue?.(e.nativeEvent.text)
    },
    [onChangeValue],
  )

  return {
    onChange,
    placeholderShown,
  }
}

const stylesheet = createStyleSheet(theme => ({
  input: {
    color: theme.colors.text,
    height: '100%',
    paddingHorizontal: theme.spacings.large,
  },
  inputContainer: {
    backgroundColor: theme.colors.backgroundSubtle,
    borderRadius: theme.radii.full,
    flex: 1,
    maxHeight: theme.heights.input,
  },
  placeholder: {
    opacity: theme.opacities.subtle,
  },
}))
