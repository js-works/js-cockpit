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
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlTab from '@shoelace-style/shoelace/dist/components/tab/tab';
import SlTabGroup from '@shoelace-style/shoelace/dist/components/tab-group/tab-group';
import SlTabPanel from '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel';

// styles
import tabsStyles from './tabs.css';

// === exports =======================================================

export { Tabs };

// === Tabs ===================================================

@elem({
  tag: 'cp-tabs',
  styles: tabsStyles,
  uses: [SlIcon, SlTabGroup, SlTabPanel, SlTab]
})
class Tabs extends Component {
  @state
  private _activeIdx = 0;
  private _tabGroup = document.createElement('sl-tab-group');
  private _tabGroupRef = createRef<SlTabGroup>();
  private _slotRef = createRef<HTMLSlotElement>();
  private _hasUpdated = false;

  @bind
  private _onTabChange(ev: any) {
    const newActiveIdx = parseInt(ev.detail.name.substr(5));

    if (newActiveIdx !== this._activeIdx) {
      this._activeIdx = newActiveIdx;
    }
  }

  constructor() {
    super();

    afterUpdate(this, () => {
      this._hasUpdated = true;
    });
  }

  render() {
    if (!this._hasUpdated) {
      this._tabGroup = document.createElement('sl-tab-group');

      return html`
        <sl-tab-group
          ${ref(this._tabGroupRef)}
          exportparts="base"
        ></sl-tab-group>
        <slot ${ref(this._slotRef)}></slot>
      `;
    } else {
      setTimeout(
        () => this._tabGroupRef.value!.show(`panel${this._activeIdx}`),
        0
      );
    }

    const pages = this._slotRef
      .value!.assignedElements()
      .filter((it: any) => it.localName === 'cp-tab')
      .map((it: any) => ({ caption: (it as any).caption }));

    return html`
      <div class="base">
        <style>
          .pages slot::slotted(c-tab:nth-of-type(${this._activeIdx + 1})) {
            visibility: visible;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
        </style>

        <sl-tab-group
          ${ref(this._tabGroupRef)}
          @sl-tab-show=${this._onTabChange}
          exportparts="base"
        >
          ${repeat(
            pages,
            (_, idx) => idx,
            (page: any, idx) =>
              html`<sl-tab slot="nav" panel="panel${idx}"
                >${page.caption}</sl-tab
              >`
          )}
        </sl-tab-group>
        <div class="pages"><slot ${ref(this._slotRef)}></slot></div>
      </div>
    `;
  }
}
