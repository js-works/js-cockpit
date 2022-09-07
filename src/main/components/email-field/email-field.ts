import {
  afterFirstUpdate,
  elem,
  prop,
  state,
  Attrs,
  Component
} from '../../utils/components';

import { classMap, createRef, html, ref, when } from '../../utils/lit';
import { I18nController } from '../../i18n/i18n';
import { FormFieldController } from '../../controllers/form-field-controller';

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';

// styles
import emailFieldStyles from './email-field.styles';

// icons
import emailIcon from '../../icons/envelope.svg';

// === exports =======================================================

export { EmailField };

// === types =========================================================

// === constants =====================================================

const regexEmail =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

// === EmailField =====================================================

@elem({
  tag: 'cp-email-field',
  styles: emailFieldStyles,
  uses: [SlIcon, SlInput]
})
class EmailField extends Component {
  @prop(Attrs.string)
  name = '';

  @prop(Attrs.string)
  value = '';

  @prop(Attrs.string)
  label = '';

  @prop(Attrs.boolean)
  disabled = false;

  @prop(Attrs.boolean)
  required = false;

  @prop(Attrs.string)
  size: 'small' | 'medium' | 'large' = 'medium';

  @state
  private _errorMsg: string | null = null;

  private _formField = new FormFieldController(this, {
    getValue: () => this.value,
    validate: () => this.validationMessage || null,
    setErrorMsg: (msg) => (this._errorMsg = msg)
  });

  private _slInputRef = createRef<SlInput>();
  private _i18n = new I18nController(this);

  constructor() {
    super();

    afterFirstUpdate(this, () => {
      Object.defineProperty(this, 'value', {
        get: () => {
          console.log(444, this.name);
          return this._slInputRef.value!.value;
        },
        set: (value: string) => void (this._slInputRef.value!.value = value)
      });
    });
  }

  private _onInput = () => this._formField.signalInput();
  private _onChange = () => this._formField.signalChange();
  private _onFocus = () => this._formField.signalFocus();
  private _onBlur = () => this._formField.signalBlur();

  private _onKeyDown = (ev: KeyboardEvent) =>
    void (ev.key === 'Enter' && this._formField.signalSubmit());

  get validationMessage(): string {
    const input = this._slInputRef.value;

    if (!input) {
      return '';
    }

    if (this.required && !input.value) {
      return this._i18n.translate('jsCockpit.validation', 'fieldRequired');
    }

    if (input.value && !input.value.match(regexEmail)) {
      return this._i18n.translate('jsCockpit.validation', 'emailInvalid');
    }

    return '';
  }

  render() {
    return html`
      <div
        class="base ${classMap({
          required: this.required,
          invalid: this._errorMsg !== null
        })}"
      >
        <sl-input
          class="input sl-control"
          ?required=${this.required}
          size=${this.size}
          ${ref(this._slInputRef)}
          value=${this.value}
          @keydown=${this._onKeyDown}
          @sl-input=${this._onInput}
          @sl-change=${this._onChange}
          @focus=${this._onFocus}
          @blur=${this._onBlur}
        >
          <span slot="label" class="sl-control-label">${this.label}</span>
          <div slot="suffix">
            <sl-icon src=${emailIcon} class="icon"></sl-icon>
          </div>
        </sl-input>
        ${when(
          this._errorMsg,
          () => html`<div class="validation-error">${this._errorMsg}</div>`
        )}
      </div>
    `;
  }
}
