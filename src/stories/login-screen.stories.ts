import { h } from '../main/utils/dom'
import { component, elem } from 'js-element'
import { html, withLit } from 'js-element/lit'
import { Brand } from '../main/components/brand/brand'
import { LoginScreen } from '../main/components/login-screen/login-screen'
import SlInput from '@shoelace-style/shoelace/dist/components/input/input'

export default {
  title: 'login-screen'
}

import theme from '@shoelace-style/shoelace/dist/themes/light.styles'
const themeStyles = theme.toString()

@elem({
  tag: 'login-screen-demo',
  uses: [Brand, LoginScreen, SlInput],
  styles: themeStyles,
  impl: withLit(loginScreenDemoImpl)
})
class LoginScreenDemo extends component() {}

function loginScreenDemoImpl() {
  return () =>
    html`
      <sx-login-screen>
        <div slot="header">
          <sx-brand
            vendor="my-company"
            title="Back Office"
            size="large"
          ></sx-brand>
        </div>
        <div slot="footer">&copy; 2021, my-company</div>
      </sx-login-screen>
    `
}

export const loginScreen = () => h('login-screen-demo')
