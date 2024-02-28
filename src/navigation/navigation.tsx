import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { Login } from '../screens/login'

// eslint-disable-next-line ts/consistent-type-definitions
export type RootStackParamList = {
  Login: undefined
}

const Stack = createStackNavigator<RootStackParamList>()

export function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen component={Login} name="Login" />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
