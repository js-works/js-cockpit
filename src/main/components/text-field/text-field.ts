import {
  bind,
  elem,
  prop,
  afterInit,
  afterUpdate,
  Attrs,
  Component
} from '../../utils/components';

import { classMap, createRef, html, ref } from '../../utils/lit';
import type { FieldBinder } from '../../forms/form-fields';
import { I18nController } from '../../i18n/i18n';
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
class TextField extends Component {
  @prop({ attr: Attrs.string })
  name = '';

  @prop({ attr: Attrs.string })
  value = '';

  @prop({ attr: Attrs.string })
  label = '';

  @prop({ attr: Attrs.boolean })
  disabled = false;

  @prop({ attr: Attrs.boolean })
  required = false;

  @prop({ attr: Attrs.string })
  errorText = '';

  @prop
  bind: FieldBinder<string> = null;

  getFieldValue(): string {
    return this.value;
  }

  reset() {}

  focus() {
    this._slInputRef.value!.focus();
  }

  get invalid() {
    return this._slInputRef.value!.invalid;
  }

  setCustomValidity(message: string) {
    return this._slInputRef.value!.setCustomValidity(message);
  }

  reportValidity() {
    alert(1);
    return this._slInputRef.value!.reportValidity();
  }

  blur() {
    this._slInputRef.value!.blur();
  }

  private _i18n = new I18nController(this);
  private _error: string | null = null;
  private _slInputRef = createRef<SlInput>();

  private _formField: FormFieldController<string> = new FormFieldController({
    element: this,
    getValue: () => this.value,
    getRawValue: () => this.value,
    setErrorText: (value) => (this.errorText = value)
  });

  constructor() {
    super();
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

  private _onInput = () => {
    this.value = this._slInputRef.value!.value; // TODO: prevent refresh
  };

  private _onChange = () => {};

  _onFocus = () => {};

  _onBlur = () => {};

  render() {
    return html`
      <div
        class="base ${classMap({
          'required': this.required,
          'has-error': !!this.errorText
        })}"
      >
        <sl-input
          class="input control"
          ?required=${this.required}
          ${ref(this._slInputRef)}
          @sl-input=${this._onInput}
          @sl-change=${this._onChange}
          @focus=${this._onFocus}
          @blur=${this._onBlur}
        >
          <span slot="label" class="control-label">${this.label}</span>
        </sl-input>
        <div class="error-text">${this.errorText}</div>
      </div>
    `;
  }
}
