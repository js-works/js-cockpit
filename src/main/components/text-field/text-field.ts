import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { classMap, html, createRef, lit, ref } from 'js-element/lit'

import {
  useAfterMount,
  useOnFormAssociated,
  useOnFormDisabled,
  useInternals,
  useRefresher,
  useState,
  useStatus
} from 'js-element/hooks'

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
  formAssoc: true,
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
  const refresh = useRefresher()
  const status = useStatus()
  const slInputRef = createRef<SlInput & Element>() // TODO
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

  const update = () => {
    const value = slInputRef.value!.value
    internals.setFormValue(value)

    /*
    if (self.required && value === '') {
      internals.setValidity({ valueMissing: true }, 'Field is mandatory')

      if (status.isMounted()) {
        refresh()
      }
    }
    */
  }

  const onInput = () => {
    validation.clearMessage()
  }

  const onChange = () => update()

  useAfterMount(() => {
    update()
  })

  useOnFormAssociated((frm) => {
    //console.log('----> form associated', frm)
  })

  useOnFormDisabled((disabled) => {
    //console.log('----> form disabled', disabled)
  })
  ;(self as any).formAssociatedCallback = (frm: HTMLFormElement) => {
    //console.log(33, 'associated', frm)
  }
  ;(self as any).formDisabledCallback = (disabled: boolean) => {
    //console.log(33, 'disabled', disabled)
  }

  function render() {
    return html`
      <div class="base ${classMap({ required: self.required })}">
        <div class="field-wrapper">
          <div class="label">${self.label}</div>
          <div class="control">
            <sl-input
              class="input"
              size="small"
              ${ref(slInputRef)}
              @sl-input=${onInput}
              @sl-change=${onChange}
            ></sl-input>
            <div class="error">${validation.getMessage()}</div>
          </div>
        </div>
      </div>
    `
  }

  return render
}
