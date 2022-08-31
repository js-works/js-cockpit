import {
  bind,
  elem,
  prop,
  afterConnect,
  Attrs,
  Component
} from '../../utils/components';

import { classMap, createRef, html, ref } from '../../utils/lit';

// custom elements
import SlButton from '@shoelace-style/shoelace/dist/components/button/button';
import SlButtonGroup from '@shoelace-style/shoelace/dist/components/button-group/button-group';
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown';
import SlMenu from '@shoelace-style/shoelace/dist/components/menu/menu';
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item';

// styles
import actionBarStyles from './focus-trap.css';
import { createFocusTrap, FocusTrap as Trap } from 'focus-trap';

// === exports =======================================================

export { FocusTrap };

// === types =========================================================

// === FocusTrap =====================================================

@elem({
  tag: 'cp-focus-trap'
})
class FocusTrap extends Component {
  private _focusTrap: Trap | null = null;
  private _containerRef = createRef<HTMLElement>();

  constructor() {
    super();

    afterConnect(this, () => {
      this._focusTrap = createFocusTrap(this._containerRef.value!);
      this._focusTrap.activate();

      return () => this._focusTrap!.deactivate();
    });
  }

  render() {
    return html`<div ${ref(this._containerRef)}><slot></slot></div>`;
  }
}
