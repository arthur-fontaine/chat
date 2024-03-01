import './style/unistyles'
import 'react-native-gesture-handler'

import { registerRootComponent } from 'expo'
import * as SplashScreen from 'expo-splash-screen'

import { RootStack } from './navigation/navigation'

SplashScreen.preventAutoHideAsync()

// eslint-disable-next-line import/no-default-export
export default function App() {
  return (
    <RootStack />
  )
}

registerRootComponent(App)
