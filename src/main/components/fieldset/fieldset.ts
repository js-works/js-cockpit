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

// styles
import fieldsetStyles from './fieldset.styles';

// === exports =======================================================

export { Fieldset };

// === Fieldset ===================================================

@elem({
  tag: 'c-fieldset',
  styles: fieldsetStyles
})
class Fieldset extends Component {
  @prop({ attr: Attrs.string })
  caption = '';

  @prop({ attr: Attrs.string })
  orient: 'horizontal' | 'vertical' = 'vertical';

  @prop({ attr: Attrs.string })
  labelAlign: 'horizontal' | 'vertical' | 'auto' = 'auto';

  render() {
    return html`
      <div
        class="base ${classMap({
          'horizontal': this.orient === 'horizontal',
          'label-align-vertical': this.labelAlign === 'vertical',
          'label-align-horizontal': this.labelAlign === 'horizontal'
        })}"
      >
        ${this.caption //
          ? html`<div class="caption">${this.caption}</div>`
          : ''}
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
