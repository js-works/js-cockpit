import {
  afterDisconnect,
  createEmitter,
  elem,
  prop,
  afterConnect,
  Attrs,
  Component,
  Listener
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
      getName: () => string;
      getValue: () => unknown;
      validate: () => string | null;
      setErrorMsg: (msg: string | null) => void;
    }
  >();

  @prop
  onFormSubmit?: Listener<FormSubmitEvent>;

  private _emitFormSubmit = createEmitter(
    this,
    'cp-form-submit',
    () => this.onFormSubmit
  );

  constructor() {
    super();

    this.addEventListener('xxx', (ev: any) => {
      const detail = ev.detail;
      const elem = detail.element;

      this.#elementsMap.set(elem, {
        getName: detail.getName,
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

      for (const [elem, { getName, getValue }] of this.#elementsMap.entries()) {
        const name = getName();

        if (name) {
          data[getName()] = getValue();
        }
      }

      this._emitFormSubmit({
        data
      });
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}
