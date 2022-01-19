import { elem, method, prop, override, Attrs } from 'js-element'
import { classMap, html, createRef, repeat, lit, Ref } from 'js-element/lit'
import {} from 'js-element/hooks'

// custom elements
import SlTextarea from '@shoelace-style/shoelace/dist/components/textarea/textarea'

// styles
import controlStyles from '../../shared/css/control.css'
import textAreaStyles from './text-area.css'

// === exports =======================================================

export { TextArea }

// === types =========================================================

// === TextArea =====================================================

@elem({
  tag: 'c-text-area',
  styles: [controlStyles, textAreaStyles],
  uses: [SlTextarea],
  impl: lit(textAreaImpl)
})
class TextArea extends HTMLElement {
  @prop({ attr: Attrs.string })
  value = ''

  @prop({ attr: Attrs.string })
  label = ''

  @prop({ attr: Attrs.number })
  rows = 4

  @prop({ attr: Attrs.boolean })
  disabled = false

  @prop({ attr: Attrs.boolean })
  required = false

  @prop({ attr: Attrs.string })
  error = ''

  @method
  reset!: () => void
}

function textAreaImpl(self: TextArea) {
  // const getFormCtrl = useFormCtrl()

  return () => html`
    <div class="base ${classMap({ required: self.required })}">
      <div class="field-wrapper">
        <div class="label">${self.label}</div>
        <div class="control">
          <sl-textarea
            class="input"
            size="small"
            rows=${self.rows}
          ></sl-textarea>
          <div class="error">${self.error}</div>
        </div>
      </div>
    </div>
  `
}
