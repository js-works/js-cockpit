import { elem, prop, state, Attrs, Component } from '../../utils/components';
import { classMap, createRef, html, ref } from '../../utils/lit';
import { I18nController } from '../../i18n/i18n';
import { FormControl } from '../../misc/forms';
import { FormFieldController } from '../../controllers/form-field-controller';

// custom elements
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';

// styles
import textFieldStyles from './text-field.styles';

// === exports =======================================================

export { TextField };

// === types =========================================================

declare global {
  interface HTMLElementTagNameMap {
    'cp-text-field': TextField;
  }
}

// === TextField =====================================================

@elem({
  tag: 'cp-text-field',
  styles: textFieldStyles,
  uses: [SlInput]
})
class TextField extends Component implements FormControl<string> {
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

  @prop(Attrs.string)
  errorText = '';

  @state
  private _showError = false;

  private _formField = new FormFieldController(this, {
    getValue: () => {
      return this.value;
    },

    hasError: () => this.validationMessage !== '',
    showError: (value: boolean) => (this._showError = value)
  });

  getFieldValue(): string {
    return this.value;
  }

  reset() {}

  focus() {
    this._slInputRef.value!.focus();
  }

  setCustomValidity(message: string): void {
    this._slInputRef.value?.setCustomValidity(message);
  }

  reportValidity(): boolean {
    return !!this._slInputRef.value?.reportValidity();
  }

  blur(): void {
    this._slInputRef.value?.blur();
  }

  private _i18n = new I18nController(this);
  private _slInputRef = createRef<SlInput>();

  constructor() {
    super();
  }

  get validationMessage(): string {
    const input = this._slInputRef.value;

    if (!input) {
      return '';
    }

    if (this.required && !input.value) {
      return 'Field is required (in)';
    }

    return '';
  }

  private _onInput = () => {
    this.value = this._slInputRef.value!.value; // TODO: prevent refresh
    this._formField.signalInput();
  };

  private _onChange = () => this._formField.signalChange();
  private _onFocus = () => this._formField.signalFocus();
  private _onBlur = () => this._formField.signalBlur();

  private _onKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === 'Enter') {
      this._formField.signalSubmit();
    }
  };

  render() {
    return html`
      <div
        class="base ${classMap({
          'required': this.required,
          'has-error': !!this.errorText
        })}"
      >
        <sl-input
          class="input sl-control"
          ?required=${this.required}
          size=${this.size}
          ${ref(this._slInputRef)}
          @keydown=${this._onKeyDown}
          @sl-input=${this._onInput}
          @sl-change=${this._onChange}
          @focus=${this._onFocus}
          @blur=${this._onBlur}
        >
          <span slot="label" class="sl-control-label">${this.label}</span>
        </sl-input>
        <div class="error-text">
          ${!this._showError
            ? null
            : html`
                <div class="validation-error">${this.validationMessage}</div>
              `}
          <div>${this.errorText}</div>
        </div>
      </div>
    `;
  }
}
