import './style/unistyles'
import 'react-native-gesture-handler'

import { registerRootComponent } from 'expo'
import * as SplashScreen from 'expo-splash-screen'

import { RootStack } from './navigation/navigation'
import { useSplashScreen } from './hooks/use-splash-screen'

SplashScreen.preventAutoHideAsync()

// eslint-disable-next-line import/no-default-export
export default function App() {
  useSplashScreen()

  return (
    <RootStack />
  )
}

registerRootComponent(App)
