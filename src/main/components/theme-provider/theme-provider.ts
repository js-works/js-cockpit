import { component, elem, prop } from 'js-element'
import { html, lit } from 'js-element/lit'
import { Theme } from '../../misc/theming'

// styles
import themeProviderStyles from './theme-provider.css'

// === exports =======================================================

export { ThemeProvider }

// === ThemeProvider =================================================

@elem({
  tag: 'c-theme-provider',
  impl: lit(themeProviderImpl),
  styles: [themeProviderStyles]
})
class ThemeProvider extends component() {
  @prop()
  theme?: Theme
}

function themeProviderImpl(self: ThemeProvider) {
  return () => {
    let theme: Theme | null = null

    if (
      self.theme ||
      !window.getComputedStyle(self).getPropertyValue('--sl-color-primary-500')
    ) {
      theme = self.theme instanceof Theme ? self.theme : Theme.default
    }

    return html`
      <style>
        ${theme?.toCss()}
      </style>
      <div class="base">
        <slot></slot>
      </div>
    `
  }
}
