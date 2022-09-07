import { bind, elem, prop, Attrs, Component } from '../../utils/components';

import { html } from '../../utils/lit';

// components
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';

// icons
import infoIcon from '../../icons/info-circle.svg';
import successIcon from '../../icons/check-circle.svg'; // TODO
import warningIcon from '../../icons/exclamation-circle.svg';
import dangerIcon from '../../icons/exclamation-diamond.svg';

// styles
import messageStyles from './message.styles';

// === exports =======================================================

export { Message };

// === types =========================================================

declare global {
  interface HTMLElementTagNameMap {
    'cp-message': Message;
  }
}

// === constants =====================================================

const appearanceByVariant = new Map([
  ['info', { className: 'variant-info', icon: infoIcon }],
  ['success', { className: 'variant-success', icon: successIcon }],
  ['warning', { className: 'variant-warning', icon: warningIcon }],
  ['danger', { className: 'variant-danger', icon: dangerIcon }]
]);

// === Message ====================================================

/**
 * slots: default
 */
@elem({
  tag: 'cp-message',
  styles: messageStyles,
  uses: [SlIcon]
})
class Message extends Component {
  @prop({ attr: Attrs.string })
  variant: 'info' | 'success' | 'warning' | 'danger' = 'info';

  @prop({ attr: Attrs.boolean })
  transparent?: boolean;

  @prop({ attr: Attrs.boolean })
  inheritColor?: boolean;

  render() {
    let appearance = appearanceByVariant.get(this.variant);

    if (!appearance) {
      return null;
    }

    const { icon, className } = appearance;

    return html`
      <div class="base ${className} ${this.transparent ? 'transparent' : ''}">
        ${html`
          <div class="column1">
            <sl-icon class="icon" src=${icon}></sl-icon>
          </div>
        `}
        <div class="column2">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
