import { invertTheme } from './theme-utils'
import { lightTheme } from './light-theme'
import { createTheme } from './theme-utils'

// === exports =======================================================

export {
  lightTheme,
  darkTheme,
  blueTheme,
  blueDarkTheme,
  orangeTheme,
  orangeDarkTheme,
  tealTheme,
  tealDarkTheme,
  pinkTheme,
  pinkDarkTheme,
  modernTheme,
  modernDarkTheme
}

// === themes ========================================================

const darkTheme = invertTheme(lightTheme)

const modernTheme = Object.freeze(
  Object.assign({}, lightTheme, {
    'border-radius-small': '2px',
    'border-radius-medium': '2px',
    'border-radius-large': '2px',
    'border-radius-x-large': '2px'
  })
)

const modernDarkTheme = invertTheme(modernTheme)

const blueTheme = createTheme({
  primaryColor: '#0078D7',
  reduceBorderRadius: true
})

const blueDarkTheme = invertTheme(blueTheme)

const orangeTheme = createTheme({
  primaryColor: '#ff8800',
  reduceBorderRadius: true
})

const orangeDarkTheme = invertTheme(orangeTheme)

const tealTheme = createTheme({
  primaryColor: '#008080',
  reduceBorderRadius: true
})

const tealDarkTheme = invertTheme(tealTheme)

const pinkTheme = createTheme({
  primaryColor: '#F8ABBA',
  reduceBorderRadius: true
})

const pinkDarkTheme = invertTheme(pinkTheme)

console.log(JSON.stringify(pinkDarkTheme, null, 2))
