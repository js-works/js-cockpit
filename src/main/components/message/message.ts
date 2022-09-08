import { effect, elem, prop, Attrs, Component } from '../../utils/components';
import { createRef, html, ref } from '../../utils/lit';

import {
  runCloseVerticalTransition,
  runOpenVerticalTransition
} from '../../misc/transitions';

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
  @prop(Attrs.string)
  variant: 'info' | 'success' | 'warning' | 'danger' = 'info';

  @prop(Attrs.boolean)
  transparent?: boolean;

  @prop(Attrs.boolean)
  inheritColor?: boolean;

  @prop(Attrs.boolean)
  open = false;

  private _contentRef = createRef<HTMLElement>();

  constructor() {
    super();

    let initialized = false;

    effect(
      this,
      () => {
        if (!this.open) {
          if (!initialized) {
            this._contentRef.value!.style.maxHeight = '0';
            this._contentRef.value!.style.overflow = 'hidden';
          } else {
            runCloseVerticalTransition(this._contentRef.value!).then(() => {
              this._contentRef.value!.style.maxHeight = '0';
              this._contentRef.value!.style.overflow = 'hidden';
            });
          }
        } else {
          if (!initialized) {
            this._contentRef.value!.style.maxHeight = 'none';
            this._contentRef.value!.style.overflow = 'auto';
          } else {
            runOpenVerticalTransition(this._contentRef.value!).then(() => {
              this._contentRef.value!.style.maxHeight = 'none';
              this._contentRef.value!.style.overflow = 'auto';
            });
          }
        }

        initialized = true;
      },
      () => [this.open]
    );
  }

  render() {
    let appearance = appearanceByVariant.get(this.variant);

    if (!appearance) {
      return null;
    }

    const { icon, className } = appearance;

    return html`
      <div class="base ${className} ${this.transparent ? 'transparent' : ''}">
        <div class="content" ${ref(this._contentRef)}>
          <div class="columns">
            <div class="column1">
              <sl-icon class="icon" src=${icon}></sl-icon>
            </div>
            <div class="column2">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
