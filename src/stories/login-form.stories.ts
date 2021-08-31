import { h } from '../main/utils/dom'
import { component, elem } from 'js-element'
import { html, withLit } from 'js-element/lit'
import { Brand } from '../main/components/brand/brand'
import { LoginForm } from '../main/components/login-form/login-form'

import SlInput from '@shoelace-style/shoelace/dist/components/input/input'

export default {
  title: 'login-form'
}

import theme from '@shoelace-style/shoelace/dist/themes/light.styles'
const themeStyles = theme.toString()

@elem({
  tag: 'login-form-demo',
  uses: [Brand, LoginForm, SlInput],
  styles: themeStyles,
  impl: withLit(loginFormDemoImpl)
})
class LoginScreenDemo extends component() {}

function loginFormDemoImpl() {
  return () =>
    html`
      <sx-login-form full-size>
        <div slot="header">
          <sx-brand
            vendor="my-company"
            title="Back Office"
            size="large"
          ></sx-brand>
        </div>
        <div slot="footer">&copy; 2021, my-company</div>
      </sx-login-form>
    `
}

export const loginForm = () => h('login-form-demo')
