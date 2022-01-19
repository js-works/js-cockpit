import {
  bind,
  createEmitter,
  elem,
  prop,
  Attrs,
  Component,
  Listener
} from '../../utils/components'

import { classMap, createRef, html, ref, repeat } from '../../utils/lit'
import { createLocalizer } from '../../utils/i18n'

// custom elements
import SlDetails from '@shoelace-style/shoelace/dist/components/details/details'
import SlMenu from '@shoelace-style/shoelace/dist/components/menu/menu'
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item'

// styles
import sideMenuStyles from './side-menu.css'

// icons
import collapseIcon2 from '../../icons/arrow-left.svg'
import collapseIcon from '../../icons/arrow-left-short.svg'

// === exports =======================================================

export { SideMenu }

// === types =========================================================

namespace SideMenu {
  export type Menu = Groups | null

  export type Groups = {
    kind: 'groups'
    groups: Group[]
    collapseMode?: 'none' | 'full' | 'auto'
  }

  export type Group = {
    kind: 'group'
    groupId: string
    title: string
    items: Item[]
  }

  export type Item = {
    kind: 'item'
    itemId: string
    title: string
  }
}

// === SideMenu ======================================================

@elem({
  tag: 'c-side-menu',
  styles: sideMenuStyles,
  uses: [SlDetails, SlMenu, SlMenuItem]
})
class SideMenu extends Component {
  @prop
  menu: SideMenu.Menu = null

  @prop
  activeItemId: string | null = null

  openGroups = new Set<string>()

  render() {
    return html`
      <div class="base">
        <div class="menu-header">
          <div class="menu-caption">Modules</div>
          <sl-button class="collapse-button" size="small">
            <sl-icon
              src=${collapseIcon}
              slot="prefix"
              class="collapse-icon"
            ></sl-icon>
          </sl-button>
        </div>
        ${this._renderMenu(this.menu)}
      </div>
    `
  }

  private _renderMenu(menu: SideMenu.Menu) {
    return !menu ? null : this._renderGroups(menu!)
  }

  private _renderGroups(groups: SideMenu.Groups) {
    let content: any
    const collapseMode = this.menu!.collapseMode
    const uncollapsible = collapseMode !== 'full' && collapseMode !== 'auto'

    if (uncollapsible) {
      content = repeat(
        groups.groups,
        (_, idx) => idx,
        (group) => {
          return html`
            <div class="group-header">${group.title}</div>
            ${this._renderItems(group.items)}
          `
        }
      )
    } else {
      let activeGroupIdx = -1

      if (this.activeItemId) {
        for (
          let i = 0;
          i < groups.groups.length && activeGroupIdx === -1;
          ++i
        ) {
          for (let j = 0; j < groups.groups[i].items.length; ++j) {
            if (groups.groups[i].items[j].itemId === this.activeItemId) {
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
            <sl-details summary=${group.title} ?open=${idx === activeGroupIdx}>
              ${this._renderItems(group.items)}
            </sl-details>
          `
        }
      )
    }

    return html`
      <div class=${classMap({ collapsible: !uncollapsible, uncollapsible })}>
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
            return html`<div
              class="item ${classMap({
                active: item.itemId === this.activeItemId
              })}"
            >
              <span class="mark"></span>
              <span>${item.title}</span>
            </div>`
          }
        )}
      </div>
    `
  }
}
