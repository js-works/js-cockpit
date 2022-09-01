import { render, Ref, ComponentChild } from 'preact';
import { useState } from 'preact/hooks';

import {
  showErrorDialog,
  Brand,
  DateField,
  EmailField,
  FormSubmitEvent,
  handleFormFields,
  LoginForm,
  PasswordField,
  TextField,
  ThemeProvider
} from 'js-cockpit';

export default {
  title: 'form'
};

export const formValidation = () => {
  const div = document.createElement('div');

  render(<FormDemo />, div);

  return div;
};

type Adjust<T> = {
  [K in keyof T]: Partial<Omit<T[K], 'children'>> & {
    ref?: Ref<T[K]>;
    children?: ComponentChild;
  };
};

declare global {
  namespace preact.JSX {
    interface IntrinsicElements extends Adjust<HTMLElementTagNameMap> {}
  }
}

type Control<T> = HTMLElement & {
  required: boolean;
  disabled: boolean;
  getFieldData: () => T;
  validationMessage: string;
  errorText: string;
  ref?: Ref<Control<T>>;
};

const input = document.createElement('input');

function useFormFields<T extends Record<string, unknown>>(): [
  {
    [K in keyof T]: {
      ref?: any; // Ref<Control<T[K]>>;// TODO!!!!!!!!
      errorText?: string;
    };
  },
  boolean,
  (action: (data: Partial<T>) => void) => (ev: Event) => void
] {
  const [, setDummy] = useState(false);
  const update = () => setDummy((it) => !it);

  const [ctrl] = useState(() => {
    let showErrors = false;
    let showErrorBox = false;
    const cache: any = {};

    const proxy = new Proxy(
      {},
      {
        get(target, key) {
          if (cache.hasOwnProperty(key)) {
            return cache[key];
          }

          let showError = true;
          const ref: Ref<Control<unknown>> = { current: null };

          const onInput = () => {
            if (showError || showErrorBox) {
              showError = false;
              showErrorBox = false;
              update();
            }
          };

          const onChange = () => {
            if (showErrorBox) {
              showErrorBox = false;
              update();
            }

            if (!showError) {
              showError = true;
              update();
            }
          };

          return (cache[key] = {
            ref,
            onInput,
            'onsl-input': onInput,
            'onChange': onChange,
            'onsl-change': onChange,

            get 'errorText'() {
              return !showErrors || !showError || !ref.current
                ? ''
                : ref.current.validationMessage;
            }
          });
        }
      }
    );

    return {
      bind: proxy as any,

      showErrorBox: () => {
        return showErrors && showErrorBox;
      },

      process: (action: (data: Partial<T>) => void) => (ev: Event) => {
        ev.preventDefault();
        const data: Record<string, any> = {};

        for (const key of Object.keys(cache)) {
          const ref = cache[key].ref;

          if (ref && ref.current && ref.current.validationMessage) {
            showErrors = true;
            showErrorBox = true;
            update();

            return;
          }

          data[key] = ref.current.getFieldValue();
        }

        action(data as T);
      }
    };
  });

  return [ctrl.bind, ctrl.showErrorBox(), ctrl.process];
}

function FormDemo() {
  const [to, hasError, processSubmit] = useFormFields<{
    firstName: string;
    lastName: string;
  }>();

  const onSubmit = processSubmit((data) => {
    alert(JSON.stringify(data, null, 2));
  });

  return (
    <form onSubmit={onSubmit}>
      <cp-text-field
        label="First name"
        required
        {...to.firstName}
      ></cp-text-field>
      <cp-text-field
        label="Last name"
        required
        {...to.lastName}
      ></cp-text-field>
      <br />
      {hasError && (
        <cp-message variant="danger">Please check the form errors</cp-message>
      )}
      <br />
      <sl-button type="submit">Submit</sl-button>
    </form>
  );
}
