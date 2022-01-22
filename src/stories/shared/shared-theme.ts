import { ColorSchemes, Theme, ThemeMods } from 'js-cockpit'

export const sharedTheme = new Theme([
  //ThemeMods.colors(ColorSchemes.orange),
  ThemeMods.modern,
  ThemeMods.compact
  // ThemeMods.dark
])

document.documentElement.lang = 'de'

setTimeout(() => {
  //  document.documentElement.lang = 'en'
}, 3000)
