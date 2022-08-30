import {
  LitElement,
  ReactiveController,
  ReactiveControllerHost
} from '../utils/lit';

// === exports =======================================================

export { FormFieldController, FieldBinder, handleFormFields };

// === types =========================================================

interface FormControl<T> extends HTMLElement, ReactiveControllerHost {
  name: string;
  required: boolean;
  bind: FieldBinder<T>;
}

type FieldBinding<T> = {
  getElement(): HTMLElement & { name: string };
  getValue(): string | null;
  getRawValue(): T;
  setErrorText(value: string): void;
};

type FieldBinder<T> = null | ((binding: FieldBinding<T>) => void);

// === controllers ===================================================

class FormFieldController<T> {
  #elem: FormControl<T>;
  #prevFieldBinder: FieldBinder<T> | null;

  constructor(params: {
    element: FormControl<T>;
    getValue: () => string | null;
    getRawValue: () => T;
    setErrorText: (text: string) => void;
  }) {
    this.#elem = params.element;
    this.#prevFieldBinder = this.#elem.bind;

    this.#elem.addController({
      hostUpdate: () => {
        const bind = this.#elem.bind;

        if (bind !== this.#prevFieldBinder) {
          this.#prevFieldBinder = bind;

          if (bind) {
            bind({
              getElement: () => this.#elem,
              getValue: params.getValue,
              getRawValue: params.getRawValue,
              setErrorText: params.setErrorText
            });
          }
        }
      }
    });
  }
}

function handleFormFields<T extends Record<string, any>>(): [
  bind: { [K in keyof T]: FieldBinder<T[K]> },
  processSubmit: (handler: (data: T) => void) => () => void
] {
  const fieldBinders = new Map<string, FieldBinding<unknown>>();

  const bind: { [K in keyof T]: FieldBinder<T[K]> } = new Proxy(
    {},
    {
      get(target, key: string): FieldBinder<unknown> {
        return (binding) => {
          fieldBinders.set(key, binding);
        };
      }
    }
  ) as any;

  const processSubmit: any = (processor: Function) => {
    return (ev: Event) => {
      ev.preventDefault();

      const data: Record<string, unknown> = {};

      for (const key of fieldBinders.keys()) {
        data[key] = fieldBinders.get(key)!.getRawValue();
      }

      processor(data);
    };
  };

  return [bind, processSubmit];
}
