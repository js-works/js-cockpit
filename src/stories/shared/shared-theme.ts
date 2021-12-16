import { ColorSchemes, Theme, ThemeMods } from 'js-cockpit'

export const sharedTheme = new Theme([
  ThemeMods.colors(ColorSchemes.skyBlue),
  ThemeMods.modern,
  ThemeMods.compact
  //ThemeMods.dark
])
