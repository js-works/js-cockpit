import { h } from '../main/utils/dom'
import { component, elem } from 'js-element'
import { html, lit } from 'js-element/lit'
import { Brand } from '../main/components/brand/brand'
import { LoginForm } from '../main/components/login-form/login-form'

import {
  lightTheme,
  darkTheme,
  blueTheme,
  blueDarkTheme,
  orangeTheme,
  orangeDarkTheme,
  tealTheme,
  tealDarkTheme,
  pinkTheme,
  pinkDarkTheme
} from '../main/theming/themes'

import { convertToCss } from '../main/theming/theme-utils'
import SlInput from '@shoelace-style/shoelace/dist/components/input/input'

export default {
  title: 'login-form'
}

@elem({
  tag: 'login-form-demo',
  uses: [Brand, LoginForm, SlInput],
  impl: lit(loginFormDemoImpl)
})
class LoginScreenDemo extends component() {}

function loginFormDemoImpl() {
  return () =>
    html`
      <c-login-form full-size .theme="orange">
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

export const loginForm = () => h('login-form-demo')
