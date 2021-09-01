import { invertTheme } from './theme-utils'
import { lightTheme } from './light-theme'

// === exports =======================================================

export { lightTheme, darkTheme }

// === themes ========================================================

const darkTheme = invertTheme(lightTheme)
