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
          required: this.required
        })}"
      >
        <sl-input
          class="input sl-control"
          ?required=${this.required}
          ${ref(this._slInputRef)}
          @sl-input=${this._onInput}
        >
          <span slot="label" class="sl-control-label">${this.label}</span>
          <div slot="suffix">
            <sl-icon src=${emailIcon} class="icon"></sl-icon>
          </div>
        </sl-input>
        <div class="error-text"></div>
      </div>
    `;
  }
}
