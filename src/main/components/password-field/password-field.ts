// external imports
import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { classMap, html, createRef, repeat, lit, Ref } from 'js-element/lit'

// custom elements
import SlInput from '@shoelace-style/shoelace/dist/components/input/input'

// styles
import sharedStyles from '../text-field/shared.css'
import passwordFieldStyles from './password-field.css'

// === exports =======================================================

export { PasswordField }

// === types =========================================================

// === PasswordField =====================================================

@elem({
  tag: 'cp-password-field',
  styles: [sharedStyles, passwordFieldStyles],
  uses: [SlInput],
  impl: lit(passwordFieldImpl)
})
class PasswordField extends component<{
  reset(): void
}>() {
  @prop({ attr: Attrs.string })
  name = ''

  @prop({ attr: Attrs.string })
  value = ''

  @prop({ attr: Attrs.string })
  label = ''

  @prop({ attr: Attrs.boolean })
  disabled = false

  @prop({ attr: Attrs.boolean })
  required = false
}

function passwordFieldImpl(self: PasswordField) {
  return () => html`
    <div class="base ${classMap({ required: self.required })}">
      <sl-input
        type="password"
        name=${self.name}
        class="input"
        label=${self.label}
      ></sl-input>
    </div>
  `
}
