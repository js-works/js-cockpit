import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, classMap, lit, repeat } from 'js-element/lit'

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'

// icons
import menuSvg from './assets/menu.svg'

// styles
import sectionsMenuStyles from './sections-menu.css'

// === exports =======================================================

export { SectionsMenu }

// === types =========================================================

namespace SectionsMenu {
  export type Section = {
    id: number | string
    title: string
    disabled?: boolean
  }
}

// === SectionsMenu ===================================================

@elem({
  tag: 'cp-sections-menu',
  styles: sectionsMenuStyles,
  uses: [SlIcon],
  impl: lit(sectionsMenuImpl)
})
class SectionsMenu extends component() {
  @prop
  sections?: SectionsMenu.Section[]

  @prop
  activeSection?: number | string
}

function sectionsMenuImpl(self: SectionsMenu) {
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
