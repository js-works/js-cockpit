import { elem, prop, Attrs, Component } from '../../utils/components'
import { classMap, html, repeat, TemplateResult } from '../../utils/lit'

// styles
import microCockpitStyles from './micro-cockpit.css'

// components
import SlButton from '@shoelace-style/shoelace/dist/components/button/button'
import SlDetails from '@shoelace-style/shoelace/dist/components/details/details'
import SlDivider from '@shoelace-style/shoelace/dist/components/divider/divider'
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlMenu from '@shoelace-style/shoelace/dist/components/menu/menu'
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item'

// icons
import avatarIcon from '../../icons/person-fill.svg'
import caretIcon from '../../icons/chevron-down.svg'

// === exports =======================================================

export { MicroCockpit }

// === types =========================================================

namespace MicroCockpit {
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
    items: (MainMenuItem | MainMenuGroup)[]
  }

  export type MainMenuItem = {
    kind: 'item'
    icon: string
    text: string
    itemId: string
    action?: string
  }

  export type MainMenuGroup = {
    kind: 'group'
    icon: string
    text: string
    subitems: MainMenuSubitem[]
  }

  export type MainMenuSubitem = {
    kind: 'subitem'
    text: string
    itemId: string
    action?: string
  }

  export type Config = {
    brand: Brand
    user: User
    userMenu: UserMenu
    mainMenu: MainMenu
  }
}

// === MicroCockpit ===================================================

@elem({
  tag: 'c-micro-cockpit',
  styles: microCockpitStyles,
  uses: [SlButton, SlDetails, SlDivider, SlDropdown, SlIcon, SlMenu, SlMenuItem]
})
class MicroCockpit extends Component {
  @prop
  config?: MicroCockpit.Config

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
          <div class="sidebar-scrollpane">
            ${this._renderBrand()} ${this._renderUserMenu()}
            ${this._renderMainMenu()}
          </div>
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
    const items = mainMenu.items

    const menuItems = html`
      ${repeat(items, (it, idx) => {
        return it.kind === 'group'
          ? this._renderMainMenuGroup(it)
          : this._renderMainMenuItem(it)
      })}
    `

    return html`<div class="main-menu">${menuItems}</div>`
  }

  _renderMainMenuItem(item: MicroCockpit.MainMenuItem) {
    const config = this.config!
    const mainMenu = config.mainMenu
    const activeItem = mainMenu.activeItem

    const className = classMap({
      'main-menu-item': true,
      'main-menu-item-active': !!activeItem && activeItem === item.itemId
    })

    return html`
      <a data-action=${item.action || item.itemId} class=${className}>
        <div class="main-menu-item-icon">
          <sl-icon src=${item.icon}></sl-icon>
        </div>
        <div class="main-menu-item-text">${item.text}</div>
      </a>
    `
  }

  _renderMainMenuGroup(group: MicroCockpit.MainMenuGroup) {
    const active = group.subitems.some(
      (it) => it.itemId && it.itemId === this.config!.mainMenu.activeItem
    )

    const className = classMap({
      'main-menu-group': true,
      'main-menu-group-active': active
    })

    return html`
      <sl-details class=${className} ?open=${active}>
        <div slot="summary" class="main-menu-group">
          <div class="main-menu-group-icon">
            <sl-icon src=${group.icon}></sl-icon>
          </div>
          <div class="main-menu-group-text">${group.text}</div>
        </div>
        ${repeat(group.subitems, (it) => {
          return this._renderSubitem(it)
        })}
      </sl-details>
    `
  }

  private _renderSubitem(subitem: MicroCockpit.MainMenuSubitem) {
    const mainMenu = this.config!.mainMenu
    const action = subitem.action || subitem.itemId

    const className = classMap({
      'main-menu-subitem': true,

      'main-menu-subitem-active':
        subitem.itemId && subitem.itemId === mainMenu.activeItem
    })

    return html`
      <a data-action=${action} class=${className}>${subitem.text}</a>
    `
  }
}
