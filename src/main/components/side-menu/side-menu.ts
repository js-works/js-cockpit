import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, classMap, lit, repeat, TemplateResult } from 'js-element/lit'

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
    openByDefault?: boolean
  }

  export type Group = {
    kind: 'group'
    title: string
    items: Item[]
  }

  export type Item = {
    kind: 'item'
    title: string
    itemId?: string
  }
}

// === SideMenu ======================================================

@elem({
  tag: 'c-side-menu',
  styles: sideMenuStyles,
  impl: lit(sideMenuImpl),
  uses: [SlDetails, SlMenu, SlMenuItem]
})
class SideMenu extends component() {
  @prop
  menu: SideMenu.Menu = null

  @prop
  activeItemId: string | null = null
}

function sideMenuImpl(self: SideMenu) {
  function render() {
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
        ${renderMenu(self.menu)}
      </div>
    `
  }

  function renderMenu(menu: SideMenu.Menu) {
    return !menu ? null : renderGroups(menu!)
  }

  function renderGroups(groups: SideMenu.Groups) {
    let content: any
    const collapseMode = self.menu!.collapseMode
    const uncollapsible = collapseMode !== 'full' && collapseMode !== 'auto'

    if (uncollapsible) {
      content = repeat(
        groups.groups,
        (_, idx) => idx,
        (group) => {
          return html`
            <div class="group-header">${group.title}</div>
            ${renderItems(group.items)}
          `
        }
      )
    } else {
      content = repeat(
        groups.groups,
        (_, idx) => idx,
        (group) => {
          return html`
            <sl-details summary=${group.title}>
              ${renderItems(group.items)}
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

  function renderItems(items: SideMenu.Item[]) {
    return html`
      <div class="items">
        ${repeat(
          items,
          (_, idx) => idx,
          (item) => {
            return html`<div
              class="item ${classMap({
                active: item.itemId === self.activeItemId
              })}"
            >
              ${item.title}
            </div>`
          }
        )}
      </div>
    `
  }

  return render
}
