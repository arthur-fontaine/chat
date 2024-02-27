import './style/unistyles'
import 'react-native-gesture-handler'

import { registerRootComponent } from 'expo'

import { RootStack } from './navigation/navigation'

// eslint-disable-next-line import/no-default-export
export default function App() {
  return (
    <RootStack />
  )
}

registerRootComponent(App)
