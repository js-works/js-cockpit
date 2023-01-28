import { I18nController } from '../../i18n/i18n';

import {
  bind,
  createEmitter,
  elem,
  prop,
  Attrs,
  Component,
  Listener
} from '../../utils/components';

import { classMap, html, repeat } from '../../utils/lit';
import { ActionEvent } from '../../events/action-event';

// custom elements
import SlDetails from '@shoelace-style/shoelace/dist/components/details/details';
import SlMenu from '@shoelace-style/shoelace/dist/components/menu/menu';
import SlOption from '@shoelace-style/shoelace/dist/components/option/option';
import SlTree from '@shoelace-style/shoelace/dist/components/tree/tree';
import SlTreeItem from '@shoelace-style/shoelace/dist/components/tree-item/tree-item';
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlSpinner from '@shoelace-style/shoelace/dist/components/spinner/spinner';

// === exports =======================================================

export { SideMenu2 };

// === SideMenu ======================================================

@elem({
  tag: 'cp-side-menu2',
  uses: [SlTree, SlTreeItem, SlCheckbox, SlIcon, SlSpinner],
  styles: ':host { --indent-guide-width: 10px }'
})
class SideMenu2 extends Component {
  onKeyDown(ev: any) {
    console.log(ev);
  }

  render() {
    setTimeout(() => {
      const elem = this.shadowRoot!.querySelector('.me') as any;
      //elem.focus();
      //alert(this.shadowRoot!.activeElement!.tagName);
    }, 4000);

    return html`
      <div>
        <style>
          .tree {
            --indent-guide-width: 1px;
            --indent-guide-style: dotted;
            --indent-guide-color: black;
          }

          sl-tree-item::part(base) sl-icon {
            border: 2px solid red;
          }
        </style>
        <div>
          <input />
          <sl-tree
            class="tree"
            class="tree-selectable"
            selection="leaf"
            @keydown=${(ev: any) => this.onKeyDown(ev)}
          >
            <sl-tree-item class="me">Item-1</sl-tree-item>
            <sl-tree-item>Item-2</sl-tree-item>
            <sl-tree-item>
              Submenu-1
              <sl-tree-item>Item-1</sl-tree-item>
              <sl-tree-item>Item-2</sl-tree-item>
            </sl-tree-item>
            <sl-tree-item>
              Submenu-2
              <sl-tree-item>Item-1</sl-tree-item>
              <sl-tree-item>Item-2</sl-tree-item>
            </sl-tree-item>
            <sl-tree-item>
              Submenu-3
              <sl-tree-item>Item-1</sl-tree-item>
              <sl-tree-item>Item-2</sl-tree-item>
            </sl-tree-item>
          </sl-tree>
          <input />
        </div>
      </div>
    `;
  }
}
