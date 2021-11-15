import { h } from '../main/utils/dom'
import { component, elem } from 'js-element'
import { html, lit } from 'js-element/lit'
import { Brand, LoginForm, ThemeProvider } from 'js-cockpit'
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

function loginFormDemoImpl(self: LoginFormDemo) {
  return () =>
    html`
      <c-theme-provider theme="pink">
        <c-login-form
          full-size
          enable-remember-login
          enable-forgot-password
          enable-register
          initial-view="login"
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

export const loginForm = () => h('login-form-demo', { lang: 'de-DE' })
