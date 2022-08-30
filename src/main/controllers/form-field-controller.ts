import {
  LitElement,
  ReactiveController,
  ReactiveControllerHost
} from '../utils/lit';

// === exports =======================================================

export { FormFieldController, FormFieldsController, FieldBinder };

// === types =========================================================

interface FormControl<T> extends HTMLElement, ReactiveControllerHost {
  name: string;
  required: boolean;
  disabled: boolean;
  readonly invalid: boolean;
  setCustomValidity(message: string): void;
  reportValidity(): boolean;
  bind: FieldBinder<T>;
}

type FieldBinding<T> = {
  getElement(): FormControl<T>;
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

class FormFieldsController<T extends Record<string, unknown>> {
  //binders: { [K in keyof T]: FieldBinder<T[K]> };
  valid: () => boolean;
  getData: () => T;

  bindTo = (key: keyof T) => {
    return (binding: any) => {
      this.#fieldBindings.set(key, binding) as any;
    };
  };

  #fieldBindings: Map<keyof T, FieldBinding<T>>;

  constructor() {
    this.#fieldBindings = new Map();

    this.valid = () => {
      for (const binding of this.#fieldBindings.values()) {
        if (binding.getElement().invalid) {
          return false;
        }
      }

      return true;
    };

    this.getData = () => {
      const data: Record<string, unknown> = {};

      for (const key of this.#fieldBindings.keys()) {
        data[key as any] = this.#fieldBindings.get(key)!.getRawValue();
      }

      return data as T;
    };
  }
}
