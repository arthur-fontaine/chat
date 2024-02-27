import type { RouteProp } from '@react-navigation/native'
import { useRoute } from '@react-navigation/native'
import { Text, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import type { RootStackParamList } from '../navigation/navigation'

type DetailsSreenRouteProp = RouteProp<RootStackParamList, 'Details'>

export function Details() {
  const router = useRoute<DetailsSreenRouteProp>()

  const { styles, theme } = useStyles(stylesheet)
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={theme.components.title}>Details</Text>
        <Text style={theme.components.subtitle}>
          Showing details for user
          {' '}
          {router.params.name}
          .
        </Text>
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
    marginHorizontal: 'auto',
    maxWidth: 960,
  },
})
