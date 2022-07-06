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
  styles: [controlStyles, emailFieldStyles],
  uses: [SlIcon, SlInput]
})
class EmailField extends Component {
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

  private _slInputRef = createRef<SlInput>()
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
              type="email"
              name=${this.name}
              toggle-email
              class="input"
              @sl-input=${this._onInput}
              @sl-change=${this._onChange}
              @focus=${this._onFocus}
              @blur=${this._onBlur}
              ${ref(this._slInputRef)}
            >
              <div slot="label" class="label">${this.label}</div>
              <div slot="suffix">
                <sl-icon src=${emailIcon} class="icon"></sl-icon>
              </div>
            </sl-input>
            <div class="error">${this._formField.getErrorMsg()}</div>
          </div>
        </div>
      </div>
    `
  }
}
