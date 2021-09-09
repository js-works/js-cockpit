import { h } from '../main/utils/dom'
import { component, elem } from 'js-element'
import { html, lit } from 'js-element/lit'
import { Brand, LoginForm, Theme } from 'js-cockpit'

export default {
  title: 'login-form'
}

@elem({
  tag: 'login-form-demo',
  uses: [Brand, LoginForm],
  impl: lit(loginFormDemoImpl)
})
class LoginFormDemo extends component() {}

function loginFormDemoImpl() {
  return () =>
    html`
      <c-login-form full-size .theme=${Theme.default}>
        <div slot="header">
          <c-brand
            headline="my-company"
            subheadline="Back Office"
            size="large"
          ></c-brand>
        </div>
        <div slot="footer">&copy; 2021, my-company</div>
      </c-login-form>
    `
}

export const loginForm = () => h('login-form-demo', { lang: 'de' })
