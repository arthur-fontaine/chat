import { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { Button } from '~/components/button'
import { Input } from '~/components/input'
import { useError } from '~/hooks/use-error'
import { DefaultLayout } from '~/layout/default-layout'
import { supabase } from '~/utils/supabase'

export function Login() {
  const { styles } = useStyles(stylesheet)

  const { authenticate, disabled, setEmail, setPassword } = useLoginController()

  return (
    <DefaultLayout>
      <View style={styles.loginContainer}>
        <Input autoCapitalize="none" inputMode="email" onChangeValue={setEmail} placeholder="Email" textContentType="emailAddress" />
        <View style={styles.passwordContainer}>
          <Input autoCapitalize="none" onChangeValue={setPassword} placeholder="Mot de passe" secureTextEntry textContentType="password" />
          <Button disabled={disabled} iconName="arrow-right" onPress={authenticate} />
        </View>
      </View>
    </DefaultLayout>
  )
}

function useLoginController() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const disabled = useMemo(() => email === '' || password === '', [email, password])

  const { throwError } = useError()

  const authenticate = useCallback(async () => {
    if (disabled) {
      throwError(new Error('Veuillez remplir tous les champs'))
      return
    }

    const result = await supabase.auth.signInWithPassword({ email, password })

    if (result.error) {
      throwError(result.error)
    }
  }, [email, password, disabled, throwError])

  return {
    authenticate,
    disabled,
    setEmail,
    setPassword,
  }
}

const stylesheet = createStyleSheet(theme => ({
  loginContainer: {
    alignItems: 'stretch',
    flex: 1,
    gap: theme.spacings.xl,
    justifyContent: 'center',
  },
  passwordContainer: {
    flexDirection: 'row',
    gap: theme.spacings.lg,
    width: '100%',
  },
}))
