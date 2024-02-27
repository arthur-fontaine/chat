import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import { Text, TouchableOpacity, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import type { RootStackParamList } from '../navigation/navigation'

type OverviewScreenNavigationProps = StackNavigationProp<RootStackParamList, 'Overview'>

export function Overview() {
  const navigation = useNavigation<OverviewScreenNavigationProps>()

  const { styles, theme } = useStyles(stylesheet)
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View>
          <Text style={theme.components.title}>Hello World</Text>
          <Text style={theme.components.subtitle}>
            This is the first page of your app.
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Details', { name: 'Dan' })}
          style={theme.components.button}
        >
          <Text style={theme.components.buttonText}>Show Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const stylesheet = createStyleSheet({
  container: {
    flex: 1,
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: 'auto',
    maxWidth: 960,
  },
})
