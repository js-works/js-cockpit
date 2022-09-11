import { FormFieldEvent } from '../events/form-field-event';
import { ReactiveControllerHost } from '../utils/lit';

import {
  runCloseVerticalTransition,
  runOpenVerticalTransition
} from '../misc/transitions';

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
  #errorDiv = document.createElement('div');

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

                if (errorMsg) {
                  this.#errorDiv.innerHTML = '';
                  const innerDiv = document.createElement('div');
                  innerDiv.innerText = errorMsg;
                  this.#errorDiv.append(innerDiv);
                  innerDiv.className = 'validation-error';
                  this.#errorDiv.style.maxHeight = '0';
                  this.#errorDiv.style.overflow = 'hidden';

                  runOpenVerticalTransition(this.#errorDiv).then(() => {
                    this.#errorDiv.style.maxHeight = 'none';
                    this.#errorDiv.style.overflow = 'auto';
                  });
                } else {
                  runCloseVerticalTransition(this.#errorDiv).then(() => {
                    this.#errorDiv.style.maxHeight = '0';
                    this.#errorDiv.style.overflow = 'hidden';
                    this.#errorDiv.innerHTML = '';
                  });
                }

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

  getErrorMsgElement(): HTMLElement | null {
    return this.#errorDiv;
  }
}
