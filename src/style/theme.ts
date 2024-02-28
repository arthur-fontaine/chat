const colors = {
  background: '#0B0D18',
  backgroundSubtle: '#171A2A',
  button: '#0B27C3',
  text: '#FFFFFF',
} as const

export const lightTheme = {
  colors,
  heights: {
    lg: 48,
    md: 40,
    sm: 32,
  },
  opacities: {
    subtle: 0.7,
  },
  radii: {
    full: 9999,
  },
  spacings: {
    lg: 12,
    md: 4,
    sm: 2,
    xl: 16,
  },
} as const
