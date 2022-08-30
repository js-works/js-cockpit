import { bind, elem, Component } from '../main/utils/components';
import { html } from '../main/utils/lit';
import { h } from '../main/utils/dom';
import { sharedTheme } from './shared/shared-theme';

import {
  handleFormFields,
  Brand,
  DateField,
  EmailField,
  LoginForm,
  PasswordField,
  TextField,
  ThemeProvider
} from 'js-cockpit';

export default {
  title: 'form'
};

export const formValidation = () => h('form-validation');

@elem({
  tag: 'form-validation',
  uses: []
})
class FormValidationDemo extends Component {
  private _f = handleFormFields<{
    firstName: string;
    lastName: string;
    dayOfBirth: Date;
  }>();

  render() {
    const [frm, processSubmit] = this._f;

    const onSubmit = processSubmit((data) => {
      alert(JSON.stringify(data, null, 2));
    });

    return html`
      <form @submit=${onSubmit}>
        <c-text-field
          label="First name"
          required
          .bind=${frm.firstName}
        ></c-text-field>
        <c-text-field
          label="Last name"
          required
          .bind=${frm.lastName}
        ></c-text-field>
        <sl-button type="submit">Submit</sl-button>
      </form>
    `;
  }
}
