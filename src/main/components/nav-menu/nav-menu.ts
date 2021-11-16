import { component, elem, prop, setMethods, Attrs } from 'js-element'
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
  export type Section = {
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
class NavMenu extends component() {
  @prop
  sections?: NavMenu.Section[]

  @prop
  activeSection?: number | string
}

function navMenuImpl(self: NavMenu) {
  return () => {
    return html`
      <div class="base">
        <sl-icon src=${menuSvg} class="icon"></sl-icon>
        ${repeat(
          self.sections || [],
          (_, idx) => idx,
          (section) => {
            return html`
              <div
                class="section ${classMap({
                  active: section.id === self.activeSection
                })}"
              >
                <div class="title">${section.title}</div>
              </div>
            `
          }
        )}
      </div>
    `
  }
}
