import { elem, prop, override, Attrs } from 'js-element'
import { html, classMap, lit, repeat } from 'js-element/lit'

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'

// icons
import menuSvg from './assets/menu.svg'

// styles
import navMenuStyles from './nav-menu.css'

// === exports =======================================================

export { NavMenu }

// === types =========================================================

namespace NavMenu {
  export type Item = {
    id: number | string
    title: string
    disabled?: boolean
  }
}

// === NavMenu ===================================================

@elem({
  tag: 'c-nav-menu',
  styles: navMenuStyles,
  uses: [SlIcon],
  impl: lit(navMenuImpl)
})
class NavMenu extends HTMLElement {
  @prop
  items?: NavMenu.Item[]

  @prop
  activeItem?: number | string
}

function navMenuImpl(self: NavMenu) {
  return () => {
    return html`
      <div class="base">
        <sl-icon src=${menuSvg} class="icon"></sl-icon>
        ${repeat(
          self.items || [],
          (_, idx) => idx,
          (item) => {
            return html`
              <div
                class="item ${classMap({
                  active: item.id === self.activeItem
                })}"
              >
                <div class="title">${item.title}</div>
              </div>
            `
          }
        )}
      </div>
    `
  }
}
