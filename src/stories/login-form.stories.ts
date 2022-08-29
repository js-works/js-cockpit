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
      <c-theme-provider .theme=${sharedTheme}>
        <c-login-form
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
          <c-brand
            slot="header"
            logo="default"
            headline="my-company"
            text="Back Office"
            size="large"
          ></c-brand>
          <!--
          <div slot="login-fields">
            <c-text-field
              label="Username"
              name="usernamelll"
              required
            ></c-text-field>
            <c-password-field label="Password" required></c-password-field>
          </div>
-->
          <div slot="registration-fields">
            <c-text-field
              name="usernamerrr"
              label="Username"
              required
            ></c-text-field>
            <c-text-field
              name="firstNamerrr"
              label="First name"
              required
            ></c-text-field>
            <c-text-field
              name="lastNamerrr"
              label="Last name"
              required
            ></c-text-field>
            <c-email-field
              name="emailrrr"
              label="Email"
              required
            ></c-email-field>
            <c-date-field
              name="dayOfBirthrrr"
              label="Day of birth"
            ></c-date-field>
          </div>
          <div slot="footer">&copy; 2021, my-company</div>
        </c-login-form>
      </c-theme-provider>
    `;
  }
}

export const loginForm = () => h('login-form-demo');
