import { elem, Component } from '../main/utils/components';
import { html } from '../main/utils/lit';
import { h } from '../main/utils/dom';

import {
  Brand,
  DateField,
  EmailField,
  LoginForm,
  PasswordField,
  TextField
} from 'js-cockpit';

export default {
  title: 'login-form'
};

export const loginForm = () => h('login-form-demo');

@elem({
  tag: 'login-form-demo',
  uses: [Brand, DateField, EmailField, LoginForm, TextField, PasswordField]
})
class LoginFormDemo extends Component {
  private _processSubmit = async (data: any) => {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });

    throw Error(
      'This is just a simple demo, the form data will not really be submitted.' +
        '\n\nForm data:\n' +
        JSON.stringify(data, null, 2)
    );
  };

  render() {
    return html`
      <cp-login-form
        full-size
        enable-remember-login
        enable-registration
        enable-forgot-password
        .processSubmit=${this._processSubmit}
      >
        <cp-brand
          slot="header"
          size="small"
          headline="My Company"
          text="Back Office"
          bicolor
          flat
        ></cp-brand>
        <cp-brand
          slot="form-fields-start"
          size="large"
          headline="My Company"
          text="Back Office"
          logo="default"
          bicolor
        ></cp-brand>
        <div slot="footer">&copy; 2022, My Company - All rights reserved</div>
      </cp-login-form>
    `;
  }
}
