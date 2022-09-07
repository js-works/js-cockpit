import {
  bind,
  elem,
  prop,
  afterInit,
  afterConnect,
  afterUpdate,
  Attrs,
  Component,
  afterDisconnect
} from '../../utils/components';

import { FormSubmitEvent } from '../../events/form-submit-event';

import { classMap, createRef, html, ref } from '../../utils/lit';

// === exports =======================================================

export { Form };

// === Form ==========================================================

@elem({
  tag: 'cp-form'
})
class Form extends Component {
  #elementsMap = new Map<
    HTMLElement,
    {
      getValue: () => unknown;
      hasError: () => boolean;
      showError: (value: boolean) => void;
    }
  >();

  @prop
  onFormSubmit?: () => void;

  constructor() {
    super();

    this.addEventListener('xxx', (ev: any) => {
      const detail = ev.detail;
      const elem = detail.element;

      this.#elementsMap.set(elem, {
        getValue: detail.getValue,
        hasError: detail.hasError,
        showError: detail.showError
      });

      detail.setEventConsumer((type: string) => {
        switch (type) {
          case 'input':
            detail.showError(false);
            break;

          case 'submit':
            this.submit();
            break;
        }
      });

      console.log('received xxx event:', ev);
    });

    afterConnect(this, () => {
      console.log('cp-form connected');
    });

    afterDisconnect(this, () => {
      console.log('cp-form disconnected');
    });
  }

  submit() {
    let hasErrors = false;

    for (const { hasError } of this.#elementsMap.values()) {
      if (hasError()) {
        hasErrors = true;
        break;
      }
    }

    if (hasErrors) {
      for (const { showError } of this.#elementsMap.values()) {
        showError(true);
      }
    } else {
      const data: Record<string, unknown> = {};

      for (const [elem, { getValue }] of this.#elementsMap.entries()) {
        data[elem.localName] = getValue();
      }

      alert(JSON.stringify(data, null, 2));
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}
