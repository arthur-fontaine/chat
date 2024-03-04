import type { NavigationContainerRef } from '@react-navigation/native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { useEffect, useRef } from 'react'
import { InteractionManager } from 'react-native'
import { LoginScreen } from '../screens/login'
import { supabase } from '~/utils/supabase'
import { MessagesScreen } from '~/screens/messages/messages'
import { useSplashScreen } from '~/hooks/use-splash-screen'
import { createDeferredPromise } from '~/utils/deferred-promise'

// eslint-disable-next-line ts/consistent-type-definitions
export type RootStackParamList = {
  Home: undefined
  Login: undefined
}

const Stack = createStackNavigator<RootStackParamList>()

export function RootStack() {
  const navigationRef = useNavigationRef()
  useAuthScreenController(navigationRef)

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen component={MessagesScreen} name="Home" />
        <Stack.Screen component={LoginScreen} name="Login" />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function useNavigationRef() {
  return useRef<NavigationContainerRef<RootStackParamList>>(null)
}

function useAuthScreenController(
  navigationRef: ReturnType<typeof useNavigationRef>,
) {
  const { current: deferredPromise } = useRef(createDeferredPromise<boolean>())

  const { hideSplashScreenUntil } = useSplashScreen()
  useEffect(
    () => hideSplashScreenUntil(deferredPromise),
    [deferredPromise, hideSplashScreenUntil],
  )

  supabase.auth.onAuthStateChange((_, session) => {
    if (session === null) {
      navigationRef.current?.navigate('Login')
    }
    else {
      navigationRef.current?.navigate('Home')
    }

    InteractionManager.runAfterInteractions(() => {
      // When transition is complete, resolve the promise
      deferredPromise.resolve(true)
    })
  })
}
