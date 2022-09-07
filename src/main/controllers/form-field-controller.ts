import {
  LitElement,
  ReactiveController,
  ReactiveControllerHost
} from '../utils/lit';

// === exports =======================================================

export { FormFieldController };

// === local data ====================================================

const noop = () => {};

// === controllers ===================================================

class FormFieldController<T> {
  #sendSignal: (type: string) => void = noop;
  #getValue: () => T;
  #validate: () => null | string;
  #setErrorMsg: (msg: string | null) => void;

  constructor(
    component: ReactiveControllerHost &
      HTMLElement & {
        field: string;
        label: string;
      },

    params: {
      getValue: () => T;
      validate: () => string | null;
      setErrorMsg: (msg: string | null) => void;
    }
  ) {
    let hasInitialized = false;
    this.#getValue = params.getValue;
    this.#validate = params.validate;
    this.#setErrorMsg = params.setErrorMsg;

    component.addController({
      hostConnected: () => {
        hasInitialized = false;
      },

      hostDisconnected: () => {},

      hostUpdate: () => {
        if (hasInitialized) {
          return;
        }

        hasInitialized = true;

        component.dispatchEvent(
          new CustomEvent('xxx', {
            bubbles: true,
            composed: true,

            detail: {
              element: component,
              getName: () => component.field || '',
              getValue: this.#getValue,
              validate: this.#validate,
              setErrorMsg: this.#setErrorMsg,

              setSendSignal: (sendSignal: (type: string) => void) => {
                this.#sendSignal = sendSignal;
              }
            }
          })
        );
      }
    });
  }

  readonly signalInput = () => this.#sendSignal!('input');
  readonly signalChange = () => this.#sendSignal!('change');
  readonly signalFocus = () => this.#sendSignal!('focus');
  readonly signalBlur = () => this.#sendSignal!('blur');
  readonly signalSubmit = () => this.#sendSignal!('submit');
}
