import {
  bind,
  createEmitter,
  elem,
  prop,
  Attrs,
  Component,
  Listener
} from '../../utils/components'

import { classMap, createRef, html, ref, repeat } from '../../utils/lit'
import { I18nController } from '../../controllers/i18n-controller'
import { FormFieldController } from '../../controllers/form-field-controller'

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
  styles: [controlStyles, passwordFieldStyles],
  uses: [SlInput]
})
class PasswordField extends Component {
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

  private _i18n = new I18nController(this)

  private _formField: FormFieldController<string> = new FormFieldController(
    this,
    {
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
    }
  )

  @bind
  private _onInput() {
    this.value = this._slInputRef.value!.value
    this._formField.signalInput()
  }

  @bind
  private _onChange() {
    this._formField.signalUpdate()
  }

  @bind
  private _onFocus() {
    this._formField.signalFocus()
  }

  @bind
  private _onBlur() {
    this._formField.signalBlur()
  }

  private _slInputRef = createRef<SlInput>()

  reset() {}

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
              type="password"
              name=${this.name}
              toggle-password
              class="input"
              @sl-input=${this._onInput}
              @sl-change=${this._onChange}
              @focus=${this._onFocus}
              @blur=${this._onBlur}
              ${ref(this._slInputRef)}
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
