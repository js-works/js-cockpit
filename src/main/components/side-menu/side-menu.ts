import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, classMap, lit, repeat, TemplateResult } from 'js-element/lit'

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'

// icons
import defaultLogoSvg from './assets/default-logo.svg'

// styles
import sideMenuStyles from './side-menu.css'

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
  uses: [SlIcon],
  impl: lit(loginScreenImpl)
})
class SideMenu extends component() {
  @prop
  menu: SideMenu.Groups | (() => SideMenu.Groups | null) | null = null
}

function loginScreenImpl(self: SideMenu) {
  function render() {
    let content: TemplateResult | null = null

    const menu =
      (typeof self.menu === 'function' ? self.menu() : self.menu) || null

    if (menu) {
      content = html`
        ${repeat(
          menu.groups,
          (g) => g.title,
          (g) => {
            return html`<div>${g.title}</div>`
          }
        )}
      `
    }

    return html`<div class="base">${content}</div>`
  }

  return render
}
