import { h } from '../main/utils/dom'
import { component, elem } from 'js-element'
import { html, lit } from 'js-element/lit'

import {
  Brand,
  DateField,
  EmailField,
  LoginForm,
  PasswordField,
  TextField,
  ThemeProvider
} from 'js-cockpit'

export default {
  title: 'login-form'
}

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
  ],
  impl: lit(loginFormDemoImpl)
})
class LoginFormDemo extends component() {}

function loginFormDemoImpl() {
  return () =>
    html`
      <c-theme-provider theme="default">
        <c-login-form
          full-size
          enable-remember-login
          enable-forgot-password
          enable-registration
          initial-view="login"
        >
          <div slot="header">
            <c-brand
              headline="my-company"
              subheadline="Back Office"
              size="large"
            ></c-brand>
          </div>
          <div slot="login-fields">
            <c-text-field label="Username" required></c-text-field>
            <c-password-field label="Password" required></c-password-field>
          </div>
          <div slot="registration-fields">
            <c-text-field
              name="username"
              label="Username"
              required
            ></c-text-field>
            <c-text-field
              name="firstName"
              label="First name"
              required
            ></c-text-field>
            <c-text-field
              name="lastName"
              label="Last name"
              required
            ></c-text-field>
            <c-email-field name="email" label="Email" required></c-email-field>
            <c-date-field name="dayOfBirth" label="Day of birth"></c-date-field>
          </div>
          <div slot="footer">&copy; 2021, my-company</div>
        </c-login-form>
      </c-theme-provider>
    `
}

export const loginForm = () => h('login-form-demo', { lang: 'en' })
