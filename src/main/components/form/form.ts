import {
  afterDisconnect,
  createEmitter,
  elem,
  prop,
  Component,
  Listener
} from '../../utils/components';

import { FormSubmitEvent } from '../../events/form-submit-event';
import { FormInvalidEvent } from '../../events/form-invalid-event';
import { html } from '../../utils/lit';

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
      edited: boolean;
      getName: () => string;
      getValue: () => unknown;
      validate: () => string | null;
      setErrorMsg: (msg: string | null) => void;
    }
  >();

  @prop
  onFormSubmit?: Listener<FormSubmitEvent>;

  @prop
  onFormInvalid?: Listener<FormInvalidEvent>;

  private _emitFormSubmit = createEmitter(
    this,
    'cp-form-submit',
    () => this.onFormSubmit
  );

  private _emitFormInvalid = createEmitter(
    this,
    'cp-form-invalid',
    () => this.onFormInvalid
  );

  constructor() {
    super();

    this.addEventListener('cp-form-field', (ev) => {
      const detail = ev.detail;
      const elem = detail.element;
      let cancelled = false;

      this.#elementsMap.set(elem, {
        edited: false,
        getName: detail.getName,
        getValue: detail.getValue,
        validate: detail.validate,
        setErrorMsg: detail.setErrorMsg
      });

      detail.setSendSignal((type) => {
        if (cancelled) {
          return;
        }

        switch (type) {
          case 'input':
            detail.setErrorMsg(null);
            break;

          case 'change':
            detail.setErrorMsg(detail.validate());
            break;

          case 'submit':
            this.submit();
            break;

          case 'cancel':
            cancelled = true;
            this.#elementsMap.delete(elem);
        }
      });
    });

    afterDisconnect(this, () => {
      this.#elementsMap.clear();
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

      this._emitFormInvalid();
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
