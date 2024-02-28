import { ScrollView, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface DefaultLayoutProps
  extends React.PropsWithChildren { }

export function DefaultLayout({ children }: DefaultLayoutProps) {
  const { styles } = useStyles(stylesheet)
  const safeAreaInsets = useSafeAreaInsets()

  return (
    <View style={[styles.appContainer, { paddingTop: safeAreaInsets.top }]}>
      <ScrollView contentContainerStyle={{ minHeight: '100%' }} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </View>
  )
}

const stylesheet = createStyleSheet(theme => ({
  appContainer: {
    backgroundColor: theme.colors.background,
    flex: 1,
    paddingHorizontal: theme.spacings.lg,
  },
}))
