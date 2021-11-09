import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { classMap, html, createRef, repeat, lit, Ref } from 'js-element/lit'
import { useInternals, useState } from 'js-element/hooks'
import { useValidation } from '../../utils/hooks'

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
  formAssociated: true,
  styles: [controlStyles, textFieldStyles],
  impl: lit(textFieldImpl),
  uses: [SlInput]
})
class TextField extends component<{
  reset(): void
  //focus(): void
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
  const internals: any = useInternals()

  const [state, setState] = useState({
    error: null as string | null
  })

  const validation = useValidation((error) => {
    setState('error', error)
  }) // TODO!!!

  setMethods(self, {
    reset() {}
  })

  setTimeout(() => {
    internals.setFormValue('aaa')
    internals.setValidity({ valueMissing: true }, 'woohoo')
  }, 1000)

  const onInput = () => {
    validation.clearMessage()
  }

  function render() {
    return html`
      <div class="base ${classMap({ required: self.required })}">
        <div class="field-wrapper">
          <div class="label">${self.label}</div>
          <div class="control">
            <sl-input class="input" size="small" @input=${onInput}></sl-input>
            <div class="error">${validation.getMessage()}</div>
          </div>
        </div>
      </div>
    `
  }

  return render
}
