import {
  bind,
  elem,
  prop,
  afterInit,
  afterUpdate,
  Attrs,
  Component
} from '../../utils/components'

import { classMap, createRef, html, ref, repeat } from '../../utils/lit'

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
  uses: [SlIcon]
})
class NavMenu extends Component {
  @prop
  items?: NavMenu.Item[]

  @prop
  activeItem?: number | string

  render() {
    return html`
      <div class="base">
        <sl-icon src=${menuSvg} class="icon"></sl-icon>
        ${repeat(
          this.items || [],
          (_, idx) => idx,
          (item) => {
            return html`
              <div
                class="item ${classMap({
                  active: item.id === this.activeItem
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
