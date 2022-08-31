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
import { I18nController } from '../../i18n/i18n';
import { FormFieldController } from '../../controllers/form-field-controller';

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';

// styles
import controlStyles from '../../styles/control.styles';
import emailFieldStyles from './email-field.css';

// icons
import emailIcon from '../../icons/envelope.svg';

// === exports =======================================================

export { EmailField };

// === types =========================================================

// === EmailField =====================================================

@elem({
  tag: 'cp-email-field',
  styles: [controlStyles, emailFieldStyles],
  uses: [SlIcon, SlInput]
})
class EmailField extends Component {
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

  private _slInputRef = createRef<SlInput>();
  private _i18n = new I18nController(this);

  @bind
  private _onInput() {
    this.value = this._slInputRef.value!.value;
  }

  render() {
    return html`
      <div
        class="base ${classMap({
          'required': this.required,
          'has-error': false // TODO!!!
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
              ${ref(this._slInputRef)}
            >
              <div slot="label" class="label">${this.label}</div>
              <div slot="suffix">
                <sl-icon src=${emailIcon} class="icon"></sl-icon>
              </div>
            </sl-input>
            <div class="error"></div>
          </div>
        </div>
      </div>
    `;
  }
}
