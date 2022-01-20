import { addToDict, defineTerms, TermsOf } from 'js-localize'

import {
  bind,
  createEmitter,
  elem,
  prop,
  Attrs,
  Component,
  Listener
} from '../../utils/components'

import { classMap, html, repeat } from '../../utils/lit'
import { createLocalizer } from '../../utils/i18n'
import { ActionEvent } from '../../events/action-event'

// custom elements
import SlDetails from '@shoelace-style/shoelace/dist/components/details/details'
import SlMenu from '@shoelace-style/shoelace/dist/components/menu/menu'
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item'

// styles
import sideMenuStyles from './side-menu.css'

// icons
import headerIcon from './assets/menu-header-icon.svg'

// === exports =======================================================

export { SideMenu }

// === types =========================================================

namespace SideMenu {
  export type Menu = Groups | null

  export type Groups = {
    kind: 'groups'
    groups: Group[]
  }

  export type Group = {
    kind: 'group'
    groupId: string
    text: string
    items: Item[]
  }

  export type Item = {
    kind: 'item'
    itemId: string
    text: string
    action?: string
  }
}

// === translations ==================================================

declare global {
  namespace Localize {
    interface TranslationsMap {
      'jsCockpit.sideMenu': TermsOf<typeof translations>
    }
  }
}

const translations = defineTerms({
  en: {
    'jsCockpit.sideMenu': {
      headerText: 'Menu'
    }
  }
})

addToDict(translations)

// === SideMenu ======================================================

@elem({
  tag: 'c-side-menu',
  styles: sideMenuStyles,
  uses: [SlDetails, SlMenu, SlMenuItem]
})
class SideMenu extends Component {
  @prop({ attr: Attrs.string })
  headerText?: string

  @prop({ attr: Attrs.boolean })
  hideHeader?: boolean

  @prop
  menu: SideMenu.Menu = null

  @prop({ attr: Attrs.string })
  collapseMode?: 'none' | 'manual'

  @prop({ attr: Attrs.string })
  activeItem: string | null = null

  @prop
  onAction?: Listener<ActionEvent>

  private _i18n = createLocalizer(this, 'jsCockpit.sideMenu')
  private _emitAction = createEmitter(this, 'c-action', () => this.onAction)

  @bind
  private _onItemClick(ev: MouseEvent) {
    const item = ev.currentTarget

    const action = !(item instanceof HTMLElement)
      ? null
      : item.getAttribute('data-action')

    if (action !== null && action !== '') {
      this._emitAction({ action })
    }
  }

  render() {
    return html`
      <div class="base">
        ${this._renderHeader()} ${this._renderMenu(this.menu)}
      </div>
    `
  }

  private _renderHeader() {
    if (this.hideHeader) {
      return null
    }

    const headerText = this.headerText ?? this._i18n.tr('headerText')

    return html`
      <div class="menu-header">
        <div class="menu-caption">
          <sl-icon class="menu-header-icon" src=${headerIcon}></sl-icon>
          <div class="menu-header-text">${headerText}</div>
        </div>
      </div>
    `
  }

  private _renderMenu(menu: SideMenu.Menu) {
    return !menu ? null : this._renderGroups(menu!)
  }

  private _renderGroups(groups: SideMenu.Groups) {
    let content: any
    const collapsible = this.collapseMode === 'manual'

    if (collapsible) {
      let activeGroupIdx = -1

      if (this.activeItem) {
        for (
          let i = 0;
          i < groups.groups.length && activeGroupIdx === -1;
          ++i
        ) {
          for (let j = 0; j < groups.groups[i].items.length; ++j) {
            if (groups.groups[i].items[j].itemId === this.activeItem) {
              activeGroupIdx = i
              break
            }
          }
        }
      }

      content = repeat(
        groups.groups,
        (_, idx) => idx,
        (group, idx) => {
          return html`
            <sl-details summary=${group.text} ?open=${idx === activeGroupIdx}>
              ${this._renderItems(group.items)}
            </sl-details>
          `
        }
      )
    } else {
      content = repeat(
        groups.groups,
        (_, idx) => idx,
        (group) => {
          return html`
            <div class="group-header">${group.text}</div>
            ${this._renderItems(group.items)}
          `
        }
      )
    }

    return html`
      <div class=${classMap({ collapsible, uncollapsible: !collapsible })}>
        ${content}
      </div>
    `
  }

  private _renderItems(items: SideMenu.Item[]) {
    return html`
      <div class="items">
        ${repeat(
          items,
          (_, idx) => idx,
          (item) => {
            let action = item.action !== undefined ? item.action : item.itemId

            return html`<div
              class="item ${classMap({
                active: item.itemId === this.activeItem
              })}"
              data-action=${action}
              @click=${this._onItemClick}
            >
              <span>${item.text}</span>
            </div>`
          }
        )}
      </div>
    `
  }
}
