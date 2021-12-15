import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { classMap, html, createRef, lit, ref } from 'js-element/lit'

import {
  useAfterMount,
  useAfterUpdate,
  useInternals,
  useRefresher,
  useState,
  useStatus
} from 'js-element/hooks'

import { useFormField, useI18n } from '../../utils/hooks'

// custom elements
import SlInput from '@shoelace-style/shoelace/dist/components/input/input'

// styles
import controlStyles from '../../shared/css/control.css'
import textFieldStyles from './text-field.css'

// === exports =======================================================

export { TextField }

// === types =========================================================

// === TextField =====================================================

@elem({
  tag: 'c-text-field',
  formAssoc: true,
  styles: [controlStyles, textFieldStyles],
  impl: lit(textFieldImpl),
  uses: [SlInput]
})
class TextField extends component<{
  blur(): void
  focus(): void
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

  @prop({ attr: Attrs.string })
  error = ''
}

function textFieldImpl(self: TextField) {
  const refresh = useRefresher()
  const status = useStatus()
  const slInputRef = createRef<SlInput & Element>() // TODO
  const { i18n } = useI18n()

  const [state, setState] = useState({
    error: null as string | null
  })

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
    self.value = slInputRef.value!.value // TODO: prevent refresh
    formField.signalInput()
  }

  const onChange = () => {
    formField.signalUpdate()
  }

  setMethods(self, {
    reset() {},
    focus: () => slInputRef.value!.focus(),
    blur: () => slInputRef.value!.blur()
  })

  useAfterMount(() => {
    //setInterval(refresh, 10000)
  })

  function render() {
    return html`
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
              class="input"
              ${ref(slInputRef)}
              @sl-input=${onInput}
              @sl-change=${onChange}
            ></sl-input>
            <div class="error">${formField.getErrorMsg()}</div>
          </div>
        </div>
      </div>
    `
  }

  return render
}
