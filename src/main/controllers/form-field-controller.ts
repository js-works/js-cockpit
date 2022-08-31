import { ReactiveController, ReactiveControllerHost } from '../utils/lit';
import { FieldBinder, FieldBinding, FormControl } from '../forms/form-fields';

// === exports =======================================================

export { FormFieldController };

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

function handleFormFields<T extends Record<string, unknown>>(): {
  bindTo(key: keyof T): (binding: FieldBinding<T>) => void;
  valid(): boolean;
  getData(): T;
} {
  const fieldBindings = new Map<keyof T, FieldBinding<T>>();

  return {
    bindTo(key) {
      return (binding: any) => {
        fieldBindings.set(key, binding) as any;
      };
    },

    valid() {
      for (const binding of fieldBindings.values()) {
        if (binding.getElement().invalid) {
          return false;
        }
      }

      return true;
    },

    getData() {
      const data: Record<string, unknown> = {};

      for (const key of fieldBindings.keys()) {
        data[key as any] = fieldBindings.get(key)!.getRawValue();
      }

      return data as T;
    }
  };
}
