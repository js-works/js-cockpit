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
          class="input sl-control"
          ?required=${this.required}
          size=${this.size}
          @sl-input=${this._onInput}
          ${ref(this._slInputRef)}
        >
          <span slot="label" class="sl-control-label">${this.label}</span>
        </sl-input>
        <div class="error"></div>
      </div>
    `;
  }
}
