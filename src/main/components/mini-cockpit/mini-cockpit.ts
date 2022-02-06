import { elem, prop, Attrs, Component } from '../../utils/components'
import { html } from '../../utils/lit'

// styles
import miniCockpitStyles from './mini-cockpit.css'

// components
import SlButton from '@shoelace-style/shoelace/dist/components/button/button'
import SlDivider from '@shoelace-style/shoelace/dist/components/divider/divider'
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlMenu from '@shoelace-style/shoelace/dist/components/menu/menu'
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item'

// icons
import avatarIcon from '../../icons/person-fill.svg'
import caretIcon from '../../icons/chevron-down.svg'

// === exports =======================================================

export { MiniCockpit }

// === types =========================================================

namespace MiniCockpit {
  export type Menu = {
    kind: 'items'

    items: {
      icon: string
      text: string
      actionId: string
    }[]
  }
}

// === MiniCockpit ===================================================

@elem({
  tag: 'c-mini-cockpit',
  styles: miniCockpitStyles,
  uses: [SlButton, SlDropdown, SlIcon, SlMenu, SlMenuItem]
})
class MiniCockpit extends Component {
  @prop({ attr: Attrs.string })
  brandTitle = ''

  @prop({ attr: Attrs.string })
  brandSubtitle = ''

  @prop({ attr: Attrs.string })
  userDisplayName = ''

  render() {
    return html`
      <!-- TODO -->
      <link
        href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700"
        rel="stylesheet"
        type="text/css"
      />
      <div class="base">
        <div class="sidebar">
          ${this._renderBrand()} ${this._renderUserMenu()}
        </div>
        <div class="content">
          <slot name="content"></slot>
        </div>
      </div>
    `
  }

  private _renderBrand() {
    const title = !this.brandSubtitle ? '' : this.brandTitle
    const subtitle = this.brandSubtitle || this.brandTitle

    if (!title && !subtitle) {
      return null
    }

    const titleContent = title
      ? html`<div class="brand-title">${title}</div>`
      : null

    return html`
      <div class="brand">
        ${titleContent}
        <div class="brand-subtitle">${subtitle}</div>
      </div>
    `
  }

  private _renderUserMenu() {
    const displayName = this.userDisplayName || 'Anonymous'

    return html`
      <sl-dropdown class="user-menu" placement="bottom" distance="10">
        <div slot="trigger" class="user-menu-trigger">
          <div class="avatar">
            <sl-icon src=${avatarIcon} class="avatar-icon"></sl-icon>
          </div>
          <div class="user-menu-info">
            <div class="user-display-name">${displayName}</div>
            <sl-icon class="user-menu-caret" src=${caretIcon}></sl-icon>
          </div>
        </div>
        <sl-menu class="user-menu-items">
          <sl-menu-item>
            Preferences
          </sl-menu-item>
          <sl-menu-item>
            Profile
          </sl-menu-item>
          <sl-divider></sl-divider>
          <sl-menu-item>
            Log out
          </sl-menu-item>
        </sl-menu>
      </drop-down>
    `
  }
}
