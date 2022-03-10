import { ColorSchemes, Theme, ThemeMods } from 'js-cockpit'
import { initI18n } from 'js-localize'

export const sharedTheme = new Theme([
  ThemeMods.colors(ColorSchemes.default),
  ThemeMods.modern(),
  ThemeMods.compact()
  //ThemeMods.dark(true)
  /*
  (tokens) => ({
    'input-border-color': 'var(--sl-color-neutral-200)',
    'input-border-color-hover': 'var(--sl-color-neutral-400)',
    'input-background-color': 'var(--sl-color-neutral-200)',
    'input-background-color-hover': 'var(--sl-color-neutral-200)',
  })
    */
])

const linkElem = document.createElement('link')
linkElem.setAttribute('rel', 'stylesheet')
linkElem.setAttribute('type', 'text/css')

linkElem.setAttribute(
  'href',
  'https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700'
)

document.head.append(linkElem)

document.documentElement.lang = 'de'

setTimeout(() => {
  //  document.documentElement.lang = 'en'
}, 3000)
