import { component, elem, prop, setMethods, Attrs } from 'js-element'
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
  title = ''
}

function fieldsetImpl(self: Fieldset) {
  return () => {
    return html`
      <div class="base">
        <div class="title">${self.title}</div>
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `
  }
}
