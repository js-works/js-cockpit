import { component, elem, prop, Attrs } from 'js-element'
import { html, classMap, lit } from 'js-element/lit'

// styles
import fieldsetStyles from './fieldset.css'

// === exports =======================================================

export { Fieldset }

// === Fieldset ===================================================

@elem({
  tag: 'cp-fieldset',
  styles: fieldsetStyles,
  impl: lit(fieldsetImpl)
})
class Fieldset extends component() {
  @prop({ attr: Attrs.string })
  caption = ''
}

function fieldsetImpl(self: Fieldset) {
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
