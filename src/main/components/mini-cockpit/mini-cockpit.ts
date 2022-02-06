import { elem, prop, Attrs, Component } from '../../utils/components'
import { classMap, html, repeat } from '../../utils/lit'

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
  export type Brand = {
    title: string
    subtitle?: string
  }

  export type User = {
    displayName: string
  }

  export type UserMenu = {
    kind: 'items'

    items: {
      text: string
      action: string
    }[]
  }

  export type MainMenu = {
    kind: 'items'
    activeItem?: string

    items: {
      icon: string
      text: string
      itemId: string
      action?: string
    }[]
  }

  export type Config = {
    brand: Brand
    user: User
    userMenu: UserMenu
    mainMenu: MainMenu
  }
}

// === MiniCockpit ===================================================

@elem({
  tag: 'c-mini-cockpit',
  styles: miniCockpitStyles,
  uses: [SlButton, SlDropdown, SlIcon, SlMenu, SlMenuItem]
})
class MiniCockpit extends Component {
  @prop
  config?: MiniCockpit.Config

  render() {
    if (!this.config) {
      return null
    }

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
          ${this._renderMainMenu()}
        </div>
        <div class="content">
          <slot name="content"></slot>
        </div>
      </div>
    `
  }

  private _renderBrand() {
    const config = this.config!
    const brand = config.brand

    const title = !brand.subtitle ? '' : brand.title
    const subtitle = brand.subtitle || brand.title

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
    const config = this.config!
    const user = config.user
    const displayName = user.displayName || 'Anonymous' // TODO

    const userMenuItems = html`
      ${repeat(
        config.userMenu.items,
        (it) =>
          html`<sl-menu-item data-action=${it.action}>${it.text}</sl-menu-item>`
      )}
    `

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
          ${userMenuItems}
          <sl-divider></sl-divider>
          <sl-menu-item data-action="logOut">
            Log out
          </sl-menu-item>
        </sl-menu>
      </drop-down>
    `
  }

  private _renderMainMenu() {
    const mainMenu = this.config!.mainMenu
    const activeItem = mainMenu.activeItem
    const items = mainMenu.items

    const menuItems = html`
      ${repeat(items, (it) => {
        const className = classMap({
          'main-menu-item': true,
          'main-menu-item-active': !!activeItem && activeItem === it.itemId
        })

        return html`<a data-action=${it.action || it.itemId} class=${className}
          >${it.text}</a
        >`
      })}
    `

    return html` <div class="main-menu">${menuItems}</div> `
  }
}
