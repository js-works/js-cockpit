import {
  bind,
  createEmitter,
  elem,
  prop,
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

  private _i18n = new I18nController(this);

  private _formField: FormFieldController<string> = new FormFieldController({
    element: this as any, // TODO!!!!
    getValue: () => this.value,
    getRawValue: () => this.value,
    setErrorText: () => {} // TODO!!!
  });

  @bind
  private _onInput() {
    this.value = this._slInputRef.value!.value;
  }

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
          class="input control"
          required=${this.required}
          @sl-input=${this._onInput}
          ${ref(this._slInputRef)}
        >
          <span slot="label" class="control-label">${this.label}</span>
        </sl-input>
        <div class="error"></div>
      </div>
    `;
  }
}
