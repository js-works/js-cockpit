import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, lit } from 'js-element/lit'
import { Theme } from '../../theming/theme'
import { convertToCss } from '../../theming/theme-utils'
import { lightTheme } from '../../theming/themes'

// === exports =======================================================

export { ThemeProvider }

// === Theme ===================================================

@elem({
  tag: 'c-theme-provider',
  impl: lit(themeProviderImpl)
})
class ThemeProvider extends component() {
  @prop
  theme?: Theme
}

function themeProviderImpl(self: ThemeProvider) {
  return () =>
    html`
      <style>
        ${convertToCss(self.theme || lightTheme)}
      </style>
      <slot></slot>
    `
}
