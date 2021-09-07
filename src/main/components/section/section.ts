import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, classMap, lit } from 'js-element/lit'

// styles
import sectionStyles from './section.css'

// === exports =======================================================

export { Section }

// === Section ===================================================

@elem({
  tag: 'c-section',
  styles: sectionStyles,
  impl: lit(sectionImpl)
})
class Section extends component() {
  @prop({ attr: Attrs.string })
  caption = ''
}

function sectionImpl(self: Section) {
  return () => {
    return html`
      <div class="base">
        <div class="caption">${self.caption}</div>
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `
  }
}
