import { render } from 'preact';
import { useState } from 'preact/hooks';

import {
  Brand,
  DateField,
  EmailField,
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
  [K in keyof T]: Partial<Omit<T[K], 'children'>> & { children?: any };
};

declare global {
  namespace preact.JSX {
    interface IntrinsicElements extends Adjust<HTMLElementTagNameMap> {}
  }
}

function FormDemo() {
  const onSubmit = (ev: Event) => {
    ev.preventDefault();
    alert('Hallo');
  };

  return (
    <form onSubmit={onSubmit}>
      <cp-text-field label="First name" required></cp-text-field>
      <cp-text-field label="Last name" required></cp-text-field>
      <sl-button type="submit">Submit</sl-button>
    </form>
  );
}
