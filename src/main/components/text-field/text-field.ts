import {
  bind,
  elem,
  prop,
  afterInit,
  afterUpdate,
  Attrs,
  Component
} from '../../utils/components'

import { classMap, createRef, html, ref } from '../../utils/lit'
import { I18nController } from '../../i18n/i18n'
import { FormFieldController } from '../../controllers/form-field-controller'

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
  styles: [controlStyles, textFieldStyles],
  uses: [SlInput]
})
class TextField extends Component {
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

  reset() {}

  focus() {
    this._slInputRef.value!.focus()
  }

  blur() {
    this._slInputRef.value!.blur()
  }

  private _i18n = new I18nController(this)
  private _error: string | null = null
  private _slInputRef = createRef<SlInput>()

  private _formField: FormFieldController<string> =
    new FormFieldController<string>(this, {
      getValue: () => this.value,

      validate: () => {
        if (this.required && !this.value) {
          return {
            message: this._i18n.translate(
              'jsCockpit.validation',
              'fieldRequired'
            ),
            anchor: this._slInputRef.value!
          }
        }

        return null
      }
    })

  constructor() {
    super()
  }

  @bind
  private _onInput() {
    this.value = this._slInputRef.value!.value // TODO: prevent refresh
    this._formField.signalInput()
  }

  @bind
  private _onChange() {
    this._formField.signalUpdate()
  }

  @bind
  _onFocus() {
    this._formField.signalFocus()
  }

  @bind
  _onBlur() {
    this._formField.signalBlur()
  }

  render() {
    return html`
      <div
        class="base ${classMap({
          required: this.required,
          'has-error': this._formField.hasError()
        })}"
      >
        <div class="field-wrapper">
          <div class="control">
            <sl-input
              class="input"
              ${ref(this._slInputRef)}
              @sl-input=${this._onInput}
              @sl-change=${this._onChange}
              @focus=${this._onFocus}
              @blur=${this._onBlur}
            >
              <div slot="label" class="label">${this.label}</div>
            </sl-input>
            <div class="error">${this._formField.getErrorMsg()}</div>
          </div>
        </div>
      </div>
    `
  }
}
