import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, classMap, lit, repeat } from 'js-element/lit'

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'

// icons
import defaultLogoSvg from './assets/default-logo.svg'

// styles
import sectionTabsStyles from './section-tabs.css'

// === exports =======================================================

export { SectionTabs }

// === types =========================================================

namespace SectionTabs {
  export type Section = {
    id: number | string
    title: string
    disabled?: boolean
  }
}

// === SectionTabs ===================================================

@elem({
  tag: 'jsc-section-tabs',
  styles: sectionTabsStyles,
  uses: [SlIcon],
  impl: lit(sectionTabsImpl)
})
class SectionTabs extends component() {
  @prop
  sections?: SectionTabs.Section[]

  @prop
  activeSection?: number | string
}

function sectionTabsImpl(self: SectionTabs) {
  return () => {
    return html`
      <div class="base">
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
                ${section.title}
              </div>
            `
          }
        )}
      </div>
    `
  }
}
