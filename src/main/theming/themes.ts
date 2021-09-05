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
  pinkDarkTheme
}

// === themes ========================================================

const darkTheme = invertTheme(lightTheme)

const blueTheme = createTheme({
  primaryColor: '#0078D4',
  noBorderRadius: true
})

const blueDarkTheme = invertTheme(blueTheme)

const orangeTheme = createTheme({
  primaryColor: '#ff8800',
  noBorderRadius: true
})

const orangeDarkTheme = invertTheme(orangeTheme)

const tealTheme = createTheme({
  primaryColor: '#008080',
  noBorderRadius: true
})

const tealDarkTheme = invertTheme(tealTheme)

const pinkTheme = createTheme({
  primaryColor: '#F8ABBA',
  noBorderRadius: true
})

const pinkDarkTheme = invertTheme(pinkTheme)

console.log(JSON.stringify(pinkDarkTheme, null, 2))
