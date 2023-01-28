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

// custom elements
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select';
import SlOption from '@shoelace-style/shoelace/dist/components/option/option';
import SlDivider from '@shoelace-style/shoelace/dist/components/divider/divider';

// styles
import selectBoxStyles from './select-box.styles';

// === exports =======================================================

export { SelectBox };

// === types =========================================================

// === SelectBox =====================================================

@elem({
  tag: 'cp-select-box',
  styles: selectBoxStyles,
  uses: [SlDivider, SlOption, SlSelect]
})
class SelectBox extends Component {
  @prop({ attr: Attrs.string })
  value = '';

  @prop({ attr: Attrs.string })
  label = '';

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
        <sl-select class="sl-control">
          <div slot="label" class="label">${this.label}</div>
          <sl-option value="option-1">Option 1</sl-option>
          <sl-option value="option-2">Option 2</sl-option>
          <sl-option value="option-3">Option 3</sl-option>
          <sl-divider></sl-divider>
          <sl-option value="option-4">Option 4</sl-option>
          <sl-option value="option-5">Option 5</sl-option>
          <sl-option value="option-6">Option 6</sl-option>
        </sl-select>
      </div>
    `;
  }
}
