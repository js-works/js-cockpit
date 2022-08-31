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

// styles
import tabStyles from './tab.css';

// === exports =======================================================

export { Tab };

// === Tab ===================================================

@elem({
  tag: 'cp-tab',
  styles: tabStyles
})
class Tab extends Component {
  @prop({ attr: Attrs.string })
  caption = '';

  render() {
    return html`
      <div class="base">
        <slot></slot>
      </div>
    `;
  }
}
