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
import { FieldCheckers, FieldValidator } from '../../misc/form-validation';

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

  private readonly _slInputRef = createRef<SlInput>();
  private readonly _i18n = new I18nController(this);

  private readonly _fieldValidator = new FieldValidator(
    () => this.value,
    () => this._i18n.getLocale(),
    [FieldCheckers.required((value) => !!value), FieldCheckers.email()]
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

  private readonly _onInput = () => this._formField.signalInput();
  private readonly _onChange = () => this._formField.signalChange();
  private readonly _onFocus = () => this._formField.signalFocus();
  private readonly _onBlur = () => this._formField.signalBlur();

  private readonly _onKeyDown = (ev: KeyboardEvent) =>
    void (ev.key === 'Enter' && this._formField.signalSubmit());

  get validationMessage(): string {
    return this._fieldValidator.validate() || '';
  }

  render() {
    return html`
      <div
        class="base ${classMap({
          required: this.required,
          invalid: this._formField.showsError()
        })}"
      >
        <sl-input
          class="input sl-control"
          size=${this.size}
          ${ref(this._slInputRef)}
          value=${this.value}
          @keydown=${this._onKeyDown}
          @sl-input=${this._onInput}
          @sl-change=${this._onChange}
          @focus=${this._onFocus}
          @blur=${this._onBlur}
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
          <div slot="suffix">
            <sl-icon src=${emailIcon} class="icon"></sl-icon>
          </div>
        </sl-input>
        ${this._formField.renderErrorMsg()}
      </div>
    `;
  }
}
