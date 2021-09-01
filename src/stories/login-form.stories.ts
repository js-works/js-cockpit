import { h } from '../main/utils/dom'
import { component, elem } from 'js-element'
import { html, withLit } from 'js-element/lit'
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

const themeStyles = convertToCss(blueTheme)

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
      <jsc-login-form full-size>
        <div slot="header">
          <jsc-brand
            vendor="my-company"
            title="Back Office"
            size="large"
          ></jsc-brand>
        </div>
        <div slot="footer">&copy; 2021, my-company</div>
      </jsc-login-form>
    `
}

export const loginForm = () => h('login-form-demo')
