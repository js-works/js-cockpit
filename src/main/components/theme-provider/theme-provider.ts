import {
  afterUpdate,
  bind,
  createEmitter,
  elem,
  prop,
  state,
  Attrs,
  Component,
  Listener
} from '../../utils/components';

import { html } from '../../utils/lit';
import { Theme } from '../../misc/theming';

// styles
import themeProviderStyles from './theme-provider.css';

// === exports =======================================================

export { ThemeProvider };

// === ThemeProvider =================================================

@elem({
  tag: 'cp-theme-provider',
  styles: [themeProviderStyles]
})
class ThemeProvider extends Component {
  @prop()
  theme?: Theme;

  render() {
    let theme: Theme | null = null;

    if (
      this.theme ||
      !window.getComputedStyle(this).getPropertyValue('--sl-color-primary-500')
    ) {
      theme = this.theme instanceof Theme ? this.theme : Theme.default;
    }

    return html`
      <style>
        ${theme?.toCss()}
      </style>
      <div class="base" part="base">
        <slot></slot>
      </div>
    `;
  }
}
