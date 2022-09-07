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
  #eventConsumer: (type: string) => void = noop;
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
    const getLabel = () => (component as any).label;
    let hasInitialized = false;
    this.#getValue = params.getValue;
    this.#hasError = params.hasError;
    this.#showError = params.showError;

    component.addController({
      hostConnected: () => {
        hasInitialized = false;
        console.log(`host ${getLabel()},  ${component.localName} connected`);
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

              setEventConsumer: (eventConsumer: (type: string) => void) => {
                this.#eventConsumer = eventConsumer;
              }
            }
          })
        );
      }
    });
  }

  signalInput(): void {
    this.#eventConsumer!('input');
  }

  signalChange(): void {
    this.#eventConsumer!('change');
  }

  signalFocus(): void {
    this.#eventConsumer!('focus');
  }

  signalBlur(): void {
    this.#eventConsumer!('blur');
  }

  signalSubmitRequest(): void {
    this.#eventConsumer!('submit');
  }
}
