import { component, elem, prop } from 'js-element'
import { html, lit } from 'js-element/lit'
import { Theme, Themes } from '../../misc/themes'

// styles
import themeProviderStyles from './theme-provider.css'

// === exports =======================================================

export { ThemeProvider }

// === types =========================================================

type ThemeProp =
  | Theme
  | 'default'
  | 'default/dark'
  | 'blue'
  | 'blue/dark'
  | 'pink'
  | 'pink/dark'

// === Theme prop converter ==========================================

const themePropConverter = {
  mapPropToAttr(value: ThemeProp | null): string | null {
    if (typeof value === 'string' && getThemeByName(value)) {
      return value
    }

    return null
  },

  mapAttrToProp(value: string | null): ThemeProp | null {
    if (value && getThemeByName(value)) {
      return value as any
    }

    return null
  }
}

// === ThemeProvider =================================================

@elem({
  tag: 'c-theme-provider',
  impl: lit(themeProviderImpl),
  styles: [themeProviderStyles]
})
class ThemeProvider extends component() {
  @prop({ attr: themePropConverter })
  theme?:
    | Theme
    | 'default'
    | 'default/dark'
    | 'blue'
    | 'blue/dark'
    | 'aquamarine'
    | 'aquamarine/dark'
    | 'turquoise'
    | 'turquoise/dark'
    | 'pink'
    | 'pink/dark'
    | 'coral'
    | 'coral/dark'
}

function themeProviderImpl(self: ThemeProvider) {
  return () => {
    const theme =
      self.theme instanceof Theme
        ? self.theme
        : !self.theme
        ? Themes.default
        : getThemeByName(self.theme) || Themes.default

    return html`
      <style>
        ${theme.asCss()}
      </style>
      <div class="base">
        <slot></slot>
      </div>
    `
  }
}

// === utils =========================================================

function getThemeByName(name: string): Theme | null {
  let themeName = name
  let dark = false

  if (name.endsWith('/dark')) {
    dark = true
    themeName = name.slice(0, -5)
  }

  if (Themes.hasOwnProperty(themeName)) {
    let theme = (Themes as any)[themeName]

    if (dark) {
      theme = theme.invert()
    }

    return theme
  }

  return null
}
