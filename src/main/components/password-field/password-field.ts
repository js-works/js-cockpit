import {
  afterFirstUpdate,
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
import { FieldCheckers, FieldValidator } from '../../misc/form-validation';

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

  private readonly _i18n = new I18nController(this);

  private readonly _fieldValidator = new FieldValidator(
    () => this.value,
    () => this._i18n.getLocale(),
    [FieldCheckers.required((value) => !!value)]
  );

  private readonly _formField = new FormFieldController(this, {
    getValue: () => this.value,
    validate: () => this._fieldValidator.validate()
  });

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
    return this._fieldValidator.validate() || '';
  }

  private _onInput = () => this._formField.signalInput();

  private _onChange = () => this._formField.signalChange();
  private _onFocus = () => this._formField.signalFocus();
  private _onBlur = () => this._formField.signalBlur();

  private _onKeyDown = (ev: KeyboardEvent) =>
    void (ev.key === 'Enter' && this._formField.signalSubmit());

  private _slInputRef = createRef<SlInput>();

  render() {
    return html`
      <div
        class="base ${classMap({
          required: this.required,
          invalid: this._formField.showsError()
        })}"
      >
        <sl-input
          type="password"
          name=${this.name}
          toggle-password
          class="input sl-control"
          size=${this.size}
          @keydown=${this._onKeyDown}
          @sl-input=${this._onInput}
          @sl-change=${this._onChange}
          @focus=${this._onFocus}
          @blur=${this._onBlur}
          ${ref(this._slInputRef)}
        >
          <span
            slot="label"
            class=${classMap({
              'sl-control-label': true,
              'sl-control-label--required': this.required
            })}
          >
            ${this.label}
          </span>
        </sl-input>
        ${this._formField.renderErrorMsg()}
      </div>
    `;
  }
}
