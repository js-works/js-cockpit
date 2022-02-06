import { ColorSchemes, Theme, ThemeMods } from 'js-cockpit'

export const sharedTheme = new Theme([
  ThemeMods.colors(ColorSchemes.pink),
  ThemeMods.modern()
  //ThemeMods.compact()
  //ThemeMods.dark()
  /*
  (tokens) => ({
    'input-border-color': 'var(--sl-color-neutral-200)',
    'input-border-color-hover': 'var(--sl-color-neutral-400)',
    'input-background-color': 'var(--sl-color-neutral-200)',
    'input-background-color-hover': 'var(--sl-color-neutral-200)',
  })
    */
])

document.documentElement.lang = 'de'

setTimeout(() => {
  //  document.documentElement.lang = 'en'
}, 3000)
