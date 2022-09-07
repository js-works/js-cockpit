import {
  bind,
  createEmitter,
  elem,
  prop,
  state,
  Attrs,
  Component,
  Listener
} from '../../utils/components';

import { classMap, createRef, html, ref, repeat } from '../../utils/lit';
import { I18nController } from '../../i18n/i18n';
import { FormFieldController } from '../../controllers/form-field-controller';

// custom elements
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';

// styles
import passwordFieldStyles from './password-field.styles';

// === exports =======================================================

export { PasswordField };

// === types =========================================================

// === PasswordField =====================================================

@elem({
  tag: 'cp-password-field',
  styles: passwordFieldStyles,
  uses: [SlInput]
})
class PasswordField extends Component {
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

  private _i18n = new I18nController(this);

  private _formField = new FormFieldController(this, {
    getValue: () => {
      return this.value;
    },

    hasError: () => this.validationMessage === '',
    showError: (value: boolean) => (this._showError = value)
  });

  @state
  private _showError = false;

  get validationMessage(): string {
    const input = this._slInputRef.value;

    if (!input) {
      return '';
    }

    if (this.required && !input.value) {
      return 'Field is required (pw)';
    }

    return '';
  }

  private _onInput = () => {
    this.value = this._slInputRef.value!.value; // TODO: prevent refresh
    this._formField.signalInput();
  };

  private _onChange = () => {
    this._formField.signalChange();
  };

  private _onFocus = () => {
    this._formField.signalFocus();
  };

  private _onBlur = () => {
    this._formField.signalBlur();
  };

  private _onKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === 'Enter') {
      this._formField.signalSubmit();
    }
  };

  private _slInputRef = createRef<SlInput>();

  reset() {}

  render() {
    return html`
      <div
        class="base ${classMap({
          'required': this.required,
          'has-error': false // TODO!!!
        })}"
      >
        <sl-input
          type="password"
          name=${this.name}
          toggle-password
          class="input sl-control"
          ?required=${this.required}
          size=${this.size}
          @keydown=${this._onKeyDown}
          @sl-input=${this._onInput}
          @sl-change=${this._onChange}
          @focus=${this._onFocus}
          @blur=${this._onBlur}
          ${ref(this._slInputRef)}
        >
          <span slot="label" class="sl-control-label">${this.label}</span>
        </sl-input>
        <div class="error-text">
          ${!this._showError
            ? null
            : html`
                <div class="validation-error">${this.validationMessage}</div>
              `}
        </div>
      </div>
    `;
  }
}
