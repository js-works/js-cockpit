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
import { ActionEvent } from '../../events/action-event';

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';

// icons
import menuSvg from './assets/menu.svg';

// styles
import navMenuStyles from './nav-menu.css';

// === exports =======================================================

export { NavMenu };

// === types =========================================================

namespace NavMenu {
  export type Item = {
    itemId: string;
    text: string;
    action?: string;
    disabled?: boolean;
  };
}

// === NavMenu ===================================================

@elem({
  tag: 'cp-nav-menu',
  styles: navMenuStyles,
  uses: [SlIcon]
})
class NavMenu extends Component {
  @prop
  items?: NavMenu.Item[];

  @prop({ attr: Attrs.string })
  activeItem?: string;

  @prop
  onAction?: Listener<ActionEvent>;

  private _emitAction = createEmitter(this, 'cp-action', () => this.onAction);

  @bind
  private _onItemClick(ev: MouseEvent) {
    const item = ev.currentTarget;

    const action = !(item instanceof HTMLElement)
      ? null
      : item.getAttribute('data-action');

    if (action !== null && action !== '') {
      this._emitAction({ action });
    }
  }

  render() {
    return html`
      <div class="base">
        <sl-icon src=${menuSvg} class="icon"></sl-icon>
        ${repeat(
          this.items || [],
          (_, idx) => idx,
          (item) => {
            let action = item.action !== undefined ? item.action : item.itemId;

            return item.disabled
              ? null
              : html`
                  <div
                    class="item ${classMap({
                      active: item.itemId === this.activeItem
                    })}"
                    data-action=${action}
                    @click=${this._onItemClick}
                  >
                    <div class="text">${item.text}</div>
                  </div>
                `;
          }
        )}
      </div>
    `;
  }
}
