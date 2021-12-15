import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { classMap, html, createRef, repeat, lit, Ref } from 'js-element/lit'
import { useFormField, useI18n } from '../../utils/hooks'

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
  tag: 'c-password-field',
  formAssoc: true,
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
  const slInputRef = createRef<SlInput>()
  const { i18n } = useI18n()

  const formField = useFormField({
    getValue: () => self.value,

    validate() {
      if (self.required && !self.value) {
        return {
          message: i18n.translate('jsCockpit.validation', 'fieldRequired'),
          anchor: slInputRef.value!
        }
      }

      return null
    }
  }) // TODO!!!

  const onInput = () => {
    formField.signalInput()
  }

  const onChange = () => {
    formField.signalUpdate()
  }

  return () => html`
    <div
      class="base ${classMap({
        required: self.required,
        'has-error': formField.hasError()
      })}"
    >
      <div class="field-wrapper">
        <div class="label">${self.label}</div>
        <div class="control">
          <sl-input
            type="password"
            name=${self.name}
            toggle-password
            class="input"
            @sl-input=${onInput}
            @sl-change=${onChange}
          ></sl-input>
          <div class="error">${formField.getErrorMsg()}</div>
        </div>
      </div>
    </div>
  `
}
