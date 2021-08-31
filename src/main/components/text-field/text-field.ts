import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { classMap, html, createRef, repeat, withLit, Ref } from 'js-element/lit'
import {} from 'js-element/hooks'
import { useFormCtrl } from '../../ctrls/form-ctrl'

// custom elements
import SlInput from '@shoelace-style/shoelace/dist/components/input/input'

// styles
import sharedStyles from './shared.css'
import textFieldStyles from './text-field.css'

// === exports =======================================================

export { TextField }

// === types =========================================================

// === TextField =====================================================

@elem({
  tag: 'sx-text-field',
  styles: [sharedStyles, textFieldStyles],
  uses: [SlInput],
  impl: withLit(textFieldImpl)
})
class TextField extends component<{
  reset(): void
}>() {
  @prop({ attr: Attrs.string })
  value = ''

  @prop({ attr: Attrs.string })
  label = ''

  @prop({ attr: Attrs.boolean })
  disabled = false

  @prop({ attr: Attrs.boolean })
  required = false

  @prop({ attr: Attrs.string })
  error = ''
}

function textFieldImpl(self: TextField) {
  // const getFormCtrl = useFormCtrl()

  return () => html`
    <div class="base ${classMap({ required: self.required })}">
      <sl-input class="input" label=${self.label}></sl-input>
      <div class="error">${self.error}</div>
    </div>
  `
}
