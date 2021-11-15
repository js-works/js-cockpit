import { h } from '../main/utils/dom'
import { component, elem } from 'js-element'
import { html, lit } from 'js-element/lit'
import { Brand, LoginForm, ThemeProvider, Themes } from 'js-cockpit'

import 'element-internals-polyfill'

export default {
  title: 'login-form'
}

@elem({
  tag: 'login-form-demo',
  uses: [Brand, LoginForm, ThemeProvider],
  impl: lit(loginFormDemoImpl)
})
class LoginFormDemo extends component() {}

function loginFormDemoImpl() {
  return () =>
    html`
      <c-theme-provider theme="default">
        <c-login-form
          full-size
          show-remember-login
          show-forgot-password
          initial-view="register"
        >
          <div slot="header">
            <c-brand
              headline="my-company"
              subheadline="Back Office"
              size="large"
            ></c-brand>
          </div>
          <div slot="footer">&copy; 2021, my-company</div>
        </c-login-form>
      </c-theme-provider>
    `
}

export const loginForm = () => h('login-form-demo', { lang: 'en-US' })
