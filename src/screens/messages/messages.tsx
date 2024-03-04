import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useState } from 'react'
import { MessagesDate } from './components/messages-date'
import { MessagesView } from './components/messages-view'
import { DefaultLayout } from '~/layout/default-layout'

export function MessagesScreen() {
  const { styles } = useStyles(stylesheet)

  const [firstViewableDate, setFirstViewableDate] = useState<Date | null>(null)

  return (
    <DefaultLayout scrollable={false}>
      {
        firstViewableDate
        && (
          <View style={styles.dateHeaderContainer}>
            <MessagesDate date={firstViewableDate} />
          </View>
        )
      }
      <MessagesView onFirstViewableDateChange={setFirstViewableDate} />
    </DefaultLayout>
  )
}

const stylesheet = createStyleSheet(_theme => ({
  dateHeaderContainer: {
    justifyContent: 'center',
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 1,
  },
}))
