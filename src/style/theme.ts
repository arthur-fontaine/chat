const colors = {
  background: '#0B0D18',
  backgroundSubtle: '#171A2A',
  button: '#0B27C3',
  text: '#FFFFFF',
} as const

export const lightTheme = {
  colors,
  fontSizes: {
    normal: 18,
    small: 12,
  },
  heights: {
    input: 48,
  },
  opacities: {
    subtle: 0.7,
  },
  radii: {
    full: 9999,
    normal: 20,
  },
  spacings: {
    large: 16,
    normal: 12,
    small: 8,
    xlarge: 20,
    xsmall: 2,
  },
} as const
