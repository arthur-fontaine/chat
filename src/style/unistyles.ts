import { UnistylesRegistry } from 'react-native-unistyles'

import { lightTheme } from '../style/theme'
import { breakpoints } from './breakpoints'

type AppBreakpoints = typeof breakpoints

// if you defined themes
interface AppThemes {
  light: typeof lightTheme
}

// override library types
declare module 'react-native-unistyles' {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppThemes {}
}

UnistylesRegistry.addBreakpoints(breakpoints)
  .addThemes({
    light: lightTheme,
    // register other themes with unique names
  })
  .addConfig({
    // you can pass here optional config described below
    adaptiveThemes: true,
  })
