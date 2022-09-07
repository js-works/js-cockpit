import {
  elem,
  afterInit,
  prop,
  state,
  Attrs,
  Component,
  afterFirstUpdate
} from '../../utils/components';
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
  field = '';

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
  private _errorMsg: string | null = null;

  private _formField = new FormFieldController(this, {
    getValue: () => this.value,
    validate: () => this.validationMessage || null,
    setErrorMsg: (msg) => (this._errorMsg = msg)
  });

  getFieldValue(): string {
    return this.value;
  }

  focus() {
    this._slInputRef.value!.focus();
  }

  blur(): void {
    this._slInputRef.value?.blur();
  }

  private _i18n = new I18nController(this);
  private _slInputRef = createRef<SlInput>();

  constructor() {
    super();

    afterFirstUpdate(this, () => {
      Object.defineProperty(this, 'value', {
        get: () => this._slInputRef.value!.value,
        set: (value: string) => void (this._slInputRef.value!.value = value)
      });
    });
  }

  get validationMessage(): string {
    const input = this._slInputRef.value;

    if (!input) {
      return '';
    }

    if (this.required && !input.value) {
      return 'Field is required';
    }

    return '';
  }

  private _onInput = () => this._formField.signalInput();
  private _onChange = () => this._formField.signalChange();
  private _onFocus = () => this._formField.signalFocus();
  private _onBlur = () => this._formField.signalBlur();

  private _onKeyDown = (ev: KeyboardEvent) =>
    void (ev.key === 'Enter' && this._formField.signalSubmit());

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
          value=${this.value}
          @keydown=${this._onKeyDown}
          @sl-input=${this._onInput}
          @sl-change=${this._onChange}
          @focus=${this._onFocus}
          @blur=${this._onBlur}
        >
          <span slot="label" class="sl-control-label">${this.label}</span>
        </sl-input>
        <div class="error-text">
          ${!this._errorMsg
            ? null
            : html` <div class="validation-error">${this._errorMsg}</div> `}
          <div>${this.errorText}</div>
        </div>
      </div>
    `;
  }
}
