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
  #hasError: () => boolean;
  #showError: (value: boolean) => void;

  constructor(
    component: ReactiveControllerHost &
      HTMLElement & {
        label: string;
      },

    params: {
      getValue: () => T;
      hasError: () => boolean;
      showError: (value: boolean) => void;
    }
  ) {
    let hasInitialized = false;
    this.#getValue = params.getValue;
    this.#hasError = params.hasError;
    this.#showError = params.showError;

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
              getValue: this.#getValue,
              hasError: this.#hasError,
              showError: this.#showError,

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
