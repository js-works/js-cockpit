import { bind, elem, Component } from '../main/utils/components';
import { html } from '../main/utils/lit';
import { h } from '../main/utils/dom';
import { sharedTheme } from './shared/shared-theme';

import {
  Brand,
  DateField,
  EmailField,
  LoginForm,
  PasswordField,
  TextField,
  ThemeProvider
} from 'js-cockpit';

export default {
  title: 'login-form'
};

@elem({
  tag: 'login-form-demo',
  uses: [
    Brand,
    DateField,
    EmailField,
    LoginForm,
    TextField,
    PasswordField,
    ThemeProvider
  ]
})
class LoginFormDemo extends Component {
  render() {
    return html`
      <cp-theme-provider .theme=${sharedTheme}>
        <cp-login-form
          full-size
          enable-remember-login
          enable-forgot-password
          enable-registration
          initial-view="login"
          .processSubmit=${(data: LoginForm.SubmitData) => {
            console.log(JSON.stringify(data, null, 2));

            return new Promise((resolve, reject) => {
              setTimeout(() => {
                //reject('This is just a demo. Forms cannot really be submitted')
                resolve('xxx');
              }, 2000);
            });
          }}
        >
          <cp-brand
            slot="header"
            logo="default"
            headline="my-company"
            text="Back Office"
            size="large"
          ></cp-brand>
          <!--
          <div slot="login-fields">
            <cp-text-field
              label="Username"
              name="usernamelll"
              required
            ></cp-text-field>
            <cp-password-field label="Password" required></cp-password-field>
          </div>
-->
          <div slot="registration-fields">
            <cp-text-field
              name="usernamerrr"
              label="Username"
              required
            ></cp-text-field>
            <cp-text-field
              name="firstNamerrr"
              label="First name"
              required
            ></cp-text-field>
            <cp-text-field
              name="lastNamerrr"
              label="Last name"
              required
            ></cp-text-field>
            <cp-email-field
              name="emailrrr"
              label="Email"
              required
            ></cp-email-field>
            <cp-date-field
              name="dayOfBirthrrr"
              label="Day of birth"
            ></cp-date-field>
          </div>
          <div slot="footer">&copy; 2021, my-company</div>
        </cp-login-form>
      </cp-theme-provider>
    `;
  }
}

export const loginForm = () => h('login-form-demo');
