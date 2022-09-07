import {
  elem,
  prop,
  afterConnect,
  Attrs,
  Component,
  afterDisconnect
} from '../../utils/components';

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
      validate: () => string | null;
      setErrorMsg: (msg: string | null) => void;
    }
  >();

  @prop
  onFormSubmit?: () => void;

  constructor() {
    super();

    this.addEventListener('xxx', (ev: any) => {
      const detail = ev.detail;
      const elem = detail.element;
      console.log(elem, detail);
      this.#elementsMap.set(elem, {
        getValue: detail.getValue,
        validate: detail.validate,
        setErrorMsg: detail.setErrorMsg
      });

      detail.setSendSignal((type: string) => {
        switch (type) {
          case 'input':
            detail.setErrorMsg(null);
            break;

          case 'submit':
            this.submit();
            break;
        }
      });
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

    for (const { validate } of this.#elementsMap.values()) {
      if (validate() !== null) {
        hasErrors = true;
        break;
      }
    }

    if (hasErrors) {
      for (const { validate, setErrorMsg } of this.#elementsMap.values()) {
        setErrorMsg(validate());
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
