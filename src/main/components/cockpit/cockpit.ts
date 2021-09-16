import { component, elem, prop, Attrs } from 'js-element'
import { html, lit as lit } from 'js-element/lit'
import { Theme } from '../../misc/themes'
import { ThemeProvider } from '../theme-provider/theme-provider'

// styles
import cockpitStyles from './cockpit.css'

// === exports =======================================================

export { Cockpit }

// === Cockpit ===================================================

@elem({
  tag: 'c-cockpit',
  styles: cockpitStyles,
  uses: [ThemeProvider],
  impl: lit(cockpitImpl)
})
class Cockpit extends component() {
  @prop
  theme?: Theme
}

function cockpitImpl(self: Cockpit) {
  return () => html`
    <c-theme-provider .theme=${self.theme}>
      <div class="base">
        <div class="row1">
          <div class="header-start">
            <slot name="header-start"></slot>
          </div>
          <div class="header">
            <slot name="header"></slot>
          </div>
          <div class="header-end">
            <slot name="header-end"></slot>
          </div>
        </div>
        <div class="row2">
          <div class="subheader-start">
            <slot name="subheader-start"></slot>
          </div>
          <div class="subheader">
            <slot name="subheader"></slot>
          </div>
          <div class="subheader-end">
            <slot name="subheader-end"></slot>
          </div>
        </div>
        <div class="col1">
          <div class="sidebar-start">
            <slot name="sidebar-start"></slot>
          </div>
          <div class="sidebar">
            <slot name="sidebar"></slot>
          </div>
          <div class="sidebar-end">
            <slot name="sidebar-end"></slot>
          </div>
        </div>
        <div class="col2">
          <div class="main-start">
            <slot name="main-start"></slot>
          </div>
          <div class="main">
            <div class="scroll-pane">
              <slot name="main"></slot>
            </div>
          </div>
          <div class="main-end">
            <slot name="main-end"></slot>
          </div>
        </div>
      </div>
    </c-theme-provider>
  `
}
