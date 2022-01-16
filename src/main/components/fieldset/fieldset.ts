import { elem, prop, Attrs } from 'js-element'
import { html, classMap, lit } from 'js-element/lit'

// styles
import fieldsetStyles from './fieldset.css'

// === exports =======================================================

export { Fieldset }

// === Fieldset ===================================================

@elem({
  tag: 'c-fieldset',
  styles: fieldsetStyles,
  impl: lit(fieldsetImpl)
})
class Fieldset extends HTMLElement {
  @prop({ attr: Attrs.string })
  caption = ''

  @prop({ attr: Attrs.string })
  orient: 'horizontal' | 'vertical' = 'vertical'
}

function fieldsetImpl(self: Fieldset) {
  return () => {
    return html`
      <div
        class="base ${classMap({ horizontal: self.orient === 'horizontal' })}"
      >
        ${self.caption //
          ? html`<div class="caption">${self.caption}</div>`
          : ''}
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `
  }
}
