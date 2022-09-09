import { createFocusTrap, FocusTrap as Trap } from 'focus-trap';
import { elem, afterConnect, Component } from '../../utils/components';
import { createRef, html, ref } from '../../utils/lit';

// === exports =======================================================

export { FocusTrap };

// === public types ==================================================

declare global {
  interface HTMLElementTagNameMap {
    'cp-focus-trap': FocusTrap;
  }
}

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
    return html`<span ${ref(this._containerRef)}><slot></slot></span>`;
  }
}
