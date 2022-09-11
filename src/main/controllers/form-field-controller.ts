import { FormFieldEvent } from '../events/form-field-event';
import { ReactiveControllerHost } from '../utils/lit';

// === exports =======================================================

export { FormFieldController };

// === local data ====================================================

const noop = () => {};

// === controllers ===================================================

class FormFieldController<T> {
  #sendSignal: (type: FormFieldEvent.SignalType) => void = noop;
  #getValue: () => T;
  #validate: () => null | string;
  #errorMsg: string | null = null;

  constructor(
    component: ReactiveControllerHost & HTMLElement & { name: string },

    params: {
      getValue: () => T;
      validate: () => string | null;
    }
  ) {
    let hasInitialized = false;
    this.#getValue = params.getValue;
    this.#validate = params.validate;

    component.addController({
      hostDisconnected: () => {
        hasInitialized = false;
        this.#sendSignal('cancel');
      },

      hostUpdate: () => {
        if (hasInitialized) {
          return;
        }

        hasInitialized = true;

        const formFieldEvent = new CustomEvent<FormFieldEvent.Detail>(
          'cp-form-field',
          {
            bubbles: true,
            composed: true,

            detail: {
              element: component,
              getName: () => component.name || '',
              getValue: this.#getValue,
              validate: this.#validate,

              setErrorMsg: (errorMsg) => {
                if (errorMsg === this.#errorMsg) {
                  return;
                }

                this.#errorMsg = errorMsg;
                component.requestUpdate();
              },

              setSendSignal: (sendSignal) => {
                this.#sendSignal = sendSignal;
              }
            }
          }
        );

        component.dispatchEvent(formFieldEvent);
      }
    });
  }

  readonly signalInput = () => this.#sendSignal!('input');
  readonly signalChange = () => this.#sendSignal!('change');
  readonly signalFocus = () => this.#sendSignal!('focus');
  readonly signalBlur = () => this.#sendSignal!('blur');
  readonly signalSubmit = () => this.#sendSignal!('submit');

  getShownErrorMsg(): string | null {
    return this.#errorMsg;
  }

  showsError() {
    return this.#errorMsg !== null;
  }

  ifErrorShown<T>(fn: (errorMsg: string) => T): T | null {
    if (this.#errorMsg === null) {
      return null;
    }

    return fn(this.#errorMsg);
  }
}
