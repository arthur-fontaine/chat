import { ScrollView, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface DefaultLayoutProps extends React.PropsWithChildren {
  scrollable?: boolean
}

export function DefaultLayout({
  children,
  scrollable = true,
}: DefaultLayoutProps) {
  const { styles } = useStyles(stylesheet)
  const safeAreaInsets = useSafeAreaInsets()

  return (
    <View style={[styles.appContainer, { paddingTop: safeAreaInsets.top }]}>
      {
        scrollable ? (
          <ScrollView
            contentContainerStyle={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : <View style={{ flex: 1 }}>{children}</View>
      }
    </View>
  )
}

const stylesheet = createStyleSheet(theme => ({
  appContainer: {
    backgroundColor: theme.colors.background,
    flex: 1,
    paddingHorizontal: theme.spacings.normal,
  },
}))
