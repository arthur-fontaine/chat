import { useMemo, useState } from 'react'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { Button } from '~/components/button'
import { Input } from '~/components/input'
import { DefaultLayout } from '~/layout/default-layout'

export function Login() {
  const { styles } = useStyles(stylesheet)

  const { disabled, setIdentifiant, setPassword } = useLoginController()

  return (
    <DefaultLayout>
      <View style={styles.loginContainer}>
        <Input autoCapitalize="none" onChangeValue={setIdentifiant} placeholder="Identifiant" />
        <View style={styles.passwordContainer}>
          <Input autoCapitalize="none" onChangeValue={setPassword} placeholder="Mot de passe" secureTextEntry />
          <Button disabled={disabled} iconName="arrow-right" />
        </View>
      </View>
    </DefaultLayout>
  )
}

function useLoginController() {
  const [identifiant, setIdentifiant] = useState('')
  const [password, setPassword] = useState('')
  const disabled = useMemo(() => identifiant === '' || password === '', [identifiant, password])

  return {
    disabled,
    setIdentifiant,
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
