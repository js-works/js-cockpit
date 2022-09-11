import { elem, Component } from '../main/utils/components';
import { html } from '../main/utils/lit';
import { h } from '../main/utils/dom';
import { sharedTheme } from './shared/shared-theme';

import {
  Brand,
  DateField,
  EmailField,
  LoginForm2,
  PasswordField,
  TextField,
  ThemeProvider
} from 'js-cockpit';

export default {
  title: 'login-form2'
};

export const loginForm2 = () => h('login-form2-demo');

@elem({
  tag: 'login-form2-demo',
  uses: [
    Brand,
    DateField,
    EmailField,
    LoginForm2,
    TextField,
    PasswordField,
    ThemeProvider
  ]
})
class LoginFormDemo extends Component {
  render() {
    return html`
      <cp-theme-provider .theme=${sharedTheme}>
        <cp-login-form2
          full-size
          enable-remember-login
          enable-forgot-password
          enable-registration
          initial-view="login"
          .processSubmit=${(data: LoginForm2.SubmitData) => {
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
              name="username"
              required
            ></cp-text-field>
            <cp-password-field label="Password" required></cp-password-field>
          </div>
-->
          <div slot="registration-fields">
            <cp-text-field
              name="username"
              label="Username"
              required
            ></cp-text-field>
            <cp-text-field
              name="firstName"
              label="First name"
              required
            ></cp-text-field>
            <cp-text-field
              name="lastName"
              label="Last name"
              required
            ></cp-text-field>
            <cp-email-field
              name="email"
              label="Email"
              required
            ></cp-email-field>
            <cp-date-field
              name="dayOfBirth"
              label="Day of birth"
            ></cp-date-field>
          </div>
          <div slot="footer">&copy; 2021, my-company</div>
        </cp-login-form2>
      </cp-theme-provider>
    `;
  }
}
