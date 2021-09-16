import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, lit } from 'js-element/lit'
import { Theme, Themes } from '../../misc/themes'

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
        ${self.theme?.asCss() || Themes.default.asCss()}
      </style>
      <slot></slot>
    `
}
