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
  export type Groups = {
    type: 'item-groups'
    groups: GroupLevel0[]
    activeItemId?: string | null
  }

  export type GroupLevel0 = {
    type: 'item-group'
    title: string
    items: (GroupLevel1 | Item)[]
  }

  export type GroupLevel1 = {
    type: 'item-group'
    title: string
    items: Item[]
  }

  export type Item = {
    type: 'item'
    title: string
    itemId?: string
  }
}

// === SideMenu ======================================================

@elem({
  tag: 'c-side-menu',
  styles: sideMenuStyles,
  impl: lit(loginScreenImpl),
  uses: [SlDetails, SlMenu, SlMenuItem]
})
class SideMenu extends component() {
  @prop
  menu: SideMenu.Groups | (() => SideMenu.Groups | null) | null = null
}

function loginScreenImpl(self: SideMenu) {
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
        <sl-details summary="Products">
          <sl-menu>
            <sl-menu-item>Manage products</sl-menu-item>
            <sl-menu-item>Price calculation</sl-menu-item>
            <sl-menu-item>Import products</sl-menu-item>
          </sl-menu>
        </sl-details>
        <sl-details summary="Services">
          <sl-menu>
            <sl-menu-item>Assign services to products bla bla bla</sl-menu-item>
            <sl-menu-item>Export services</sl-menu-item>
          </sl-menu>
        </sl-details>
        <sl-details summary="Administration">
          <sl-menu>
            <sl-menu-item>User management</sl-menu-item>
            <sl-menu-item>Configuration</sl-menu-item>
            <sl-menu-item>Cronjobs</sl-menu-item>
          </sl-menu>
        </sl-details>
        <sl-details summary="Miscellaneous">
          <sl-menu>
            <sl-menu-item>Manage products</sl-menu-item>
            <sl-menu-item>Price calculation</sl-menu-item>
            <sl-menu-item>Import products</sl-menu-item>
          </sl-menu>
        </sl-details>
      </div>
    `
  }

  return render
}
