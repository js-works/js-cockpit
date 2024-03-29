import { afterConnect, elem, prop, Component } from '../../utils/components';
import { html } from '../../utils/lit';
import { Theme, ThemeMods } from '../../misc/theming';

// styles
import cockpitStyles from './cockpit.styles';

// === exports =======================================================

export { Cockpit };

// === Cockpit ===================================================

@elem({
  tag: 'cp-cockpit',
  styles: cockpitStyles,
  uses: []
})
class Cockpit extends Component {
  @prop
  theme = Theme.default;

  render() {
    //const darkTheme = new Theme(this.theme, ThemeMods.dark())

    return html`
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
        <div class="col1" style="background-color: yellow">
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
              <slot name="main" class="main-slot"></slot>
            </div>
          </div>
          <div class="main-end">
            <slot name="main-end"></slot>
          </div>
        </div>
      </div>
    `;
  }
}
