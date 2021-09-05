// external imports
import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { classMap, html, createRef, repeat, lit, Ref } from 'js-element/lit'

// custom elements
import SlInput from '@shoelace-style/shoelace/dist/components/input/input'

// styles
import controlStyles from '../../shared/css/control.css'
import passwordFieldStyles from './password-field.css'

// === exports =======================================================

export { PasswordField }

// === types =========================================================

// === PasswordField =====================================================

@elem({
  tag: 'cp-password-field',
  styles: [controlStyles, passwordFieldStyles],
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
      <div class="field-wrapper">
        <div class="label">${self.label}</div>
        <div class="control">
          <sl-input
            type="password"
            name=${self.name}
            class="input"
            size="small"
          ></sl-input>
        </div>
      </div>
    </div>
  `
}
