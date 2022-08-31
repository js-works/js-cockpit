import { bind, elem, Component } from '../main/utils/components';
import { html } from '../main/utils/lit';
import { h } from '../main/utils/dom';
import { sharedTheme } from './shared/shared-theme';

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

export const formValidation = () =>
  h('div', null, h('form-validation'), h('form-validation'));

@elem({
  tag: 'form-validation',
  uses: []
})
class FormValidationDemo extends Component {
  private _formFields = handleFormFields<{
    firstName: string;
    lastName: string;
    dayOfBirth: Date;
  }>();

  private _onSubmit = (ev: Event) => {
    //ev.preventDefault();

    if (!this._formFields.valid()) {
      return;
    }

    // alert(JSON.stringify(this._formFields.getData(), null, 2));
  };

  render() {
    const to = this._formFields.bindTo;

    return html`
      <form @submit=${this._onSubmit}>
        <sl-input requiredxxx></sl-input>
        <c-text-field
          label="First name"
          required
          .bind=${to('firstName')}
        ></c-text-field>
        <c-text-field
          label="Last name"
          required
          .bind=${to('lastName')}
        ></c-text-field>
        <button type="submit">Submit</button>
      </form>
    `;
  }
}
