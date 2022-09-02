import {
  afterUpdate,
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

// custom elements
import SlTextarea from '@shoelace-style/shoelace/dist/components/textarea/textarea';

// styles
import textAreaStyles from './text-area.styles';

// === exports =======================================================

export { TextArea };

// === types =========================================================

// === TextArea =====================================================

@elem({
  tag: 'cp-text-area',
  styles: textAreaStyles,
  uses: [SlTextarea]
})
class TextArea extends Component {
  @prop({ attr: Attrs.string })
  value = '';

  @prop({ attr: Attrs.string })
  label = '';

  @prop({ attr: Attrs.number })
  rows = 4;

  @prop({ attr: Attrs.boolean })
  disabled = false;

  @prop({ attr: Attrs.boolean })
  required = false;

  @prop({ attr: Attrs.string })
  error = '';

  reset() {}

  render() {
    return html`
      <div class="base ${classMap({ required: this.required })}">
        <sl-textarea class="input sl-control" size="small" rows=${this.rows}>
          <span slot="label">${this.label}</span>
        </sl-textarea>
        <div class="error">${this.error}</div>
      </div>
    `;
  }
}
