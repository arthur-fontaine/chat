import { Feather } from '@expo/vector-icons'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Text, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Details } from '../screens/details'
import { Overview } from '../screens/overview'

// eslint-disable-next-line ts/consistent-type-definitions
export type RootStackParamList = {
  Details: { name: string }
  Overview: undefined
}

const Stack = createStackNavigator<RootStackParamList>()

export function RootStack() {
  const { styles, theme } = useStyles(stylesheet)

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Overview">
        <Stack.Screen component={Overview} name="Overview" />
        <Stack.Screen
          component={Details}
          name="Details"
          options={({ navigation }) => ({
            headerLeft: () => (
              <View style={styles.backButton}>
                <Feather color={theme.colors.azureRadiance} name="chevron-left" size={16} />
                <Text onPress={navigation.goBack} style={styles.backButtonText}>
                  Back
                </Text>
              </View>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const stylesheet = createStyleSheet(theme => ({
  backButton: {
    flexDirection: 'row',
    paddingLeft: 20,
  },
  backButtonText: {
    color: theme.colors.azureRadiance,
    marginLeft: 4,
  },
}))
