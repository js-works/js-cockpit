import { ReactiveControllerHost } from '../utils/lit';

// === exports =======================================================

export { handleFormFields, FieldBinder, FieldBinding, FormControl };

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

// === exported functions ============================================

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

function defineFieldBinder<T extends Record<string, unknown>>(): {
  (): any;
  (key: keyof T): any;
} {
  return null as any;
}
