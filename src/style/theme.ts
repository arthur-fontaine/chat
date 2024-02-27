const colors = {
  astral: '#2E78B7',
  azureRadiance: '#007AFF',
  cornflowerBlue: '#6366F1',
  limedSpruce: '#38434D',
  white: '#ffffff',
} as const

export const lightTheme = {
  colors,
  components: {
    button: {
      alignItems: 'center',
      backgroundColor: colors.cornflowerBlue,
      borderRadius: 24,
      elevation: 5,
      flexDirection: 'row',
      justifyContent: 'center',
      padding: 16,
      shadowColor: '#000',
      shadowOffset: {
        height: 2,
        width: 0,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    buttonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    subtitle: {
      color: colors.limedSpruce,
      fontSize: 36,
    },
    title: {
      fontSize: 64,
      fontWeight: 'bold',
    },
  },
  margins: {
    lg: 8,
    md: 4,
    sm: 2,
    xl: 12,
  },
} as const
