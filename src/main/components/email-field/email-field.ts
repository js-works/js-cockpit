import { component, elem, prop, Attrs } from 'js-element'
import { classMap, createRef, html, lit, ref } from 'js-element/lit'
import { useFormField, useI18n } from '../../utils/hooks'

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlInput from '@shoelace-style/shoelace/dist/components/input/input'

// styles
import controlStyles from '../../shared/css/control.css'
import emailFieldStyles from './email-field.css'

// icons
import emailIcon from '../../icons/envelope.svg'

// === exports =======================================================

export { EmailField }

// === types =========================================================

// === EmailField =====================================================

@elem({
  tag: 'c-email-field',
  formAssoc: true,
  styles: [controlStyles, emailFieldStyles],
  uses: [SlIcon, SlInput],
  impl: lit(emailFieldImpl)
})
class EmailField extends component<{
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

function emailFieldImpl(self: EmailField) {
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
    self.value = slInputRef.value!.value
    formField.signalInput()
  }

  const onChange = () => {
    formField.signalUpdate()
  }

  const onFocus = () => {
    formField.signalFocus()
  }

  const onBlur = () => {
    formField.signalBlur()
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
            type="email"
            name=${self.name}
            toggle-email
            class="input"
            @sl-input=${onInput}
            @sl-change=${onChange}
            @focus=${onFocus}
            @blur=${onBlur}
            ${ref(slInputRef)}
          >
            <div slot="suffix">
              <sl-icon src=${emailIcon} class="icon"></sl-icon>
            </div>
          </sl-input>
          <div class="error">${formField.getErrorMsg()}</div>
        </div>
      </div>
    </div>
  `
}
