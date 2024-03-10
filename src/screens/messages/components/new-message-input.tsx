import React, { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { Button } from '~/components/button'
import { Input } from '~/components/input'
import { useMessages } from '~/hooks/use-messages'

export const NewMessageInput = React.memo(() => {
  const { styles } = useStyles(stylesheet)

  const { disabled, message, postMessage, setMessage }
    = useNewMessageInputController()

  return (
    <View style={styles.newMessageInputContainer}>
      <Input
        onChangeValue={setMessage}
        placeholder="Écrire un message"
        value={message}
      />
      <Button
        disabled={disabled}
        iconName="send"
        onPress={postMessage}
      />
    </View>
  )
})

function useNewMessageInputController() {
  const [message, setMessage] = useState('')
  const disabled = useMemo(() => message === '', [message])

  const { sendMessage } = useMessages()

  const postMessage = useCallback(() => {
    sendMessage({
      text: message,
    })
    setMessage('')
  }, [message, sendMessage])

  return {
    disabled,
    message,
    postMessage,
    setMessage,
  }
}

const stylesheet = createStyleSheet(theme => ({
  newMessageInputContainer: {
    flexDirection: 'row',
    gap: theme.spacings.normal,
    marginTop: theme.spacings.small,
  },
}))
