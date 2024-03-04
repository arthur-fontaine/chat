import { Text, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { format } from '@formkit/tempo'
import React, { useMemo } from 'react'

export const MessagesDate = React.memo(({ date }: { date: Date }) => {
  const { styles } = useStyles(stylesheet)

  const formattedDate = useMemo(() => format({
    date,
    format: { date: 'short' },
  }), [date])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {formattedDate}
      </Text>
    </View>
  )
}, (prevProps, nextProps) => (
  prevProps.date.getTime() === nextProps.date.getTime()
))

const stylesheet = createStyleSheet(theme => ({
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: theme.colors.backgroundSubtle,
    borderRadius: theme.radii.full,
    justifyContent: 'center',
    marginTop: theme.spacings.normal,
    paddingHorizontal: theme.spacings.large,
    paddingVertical: theme.spacings.normal,
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.small,
  },
}))
