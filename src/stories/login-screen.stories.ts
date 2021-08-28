import { h } from '../main/utils/dom'
import { component, elem } from 'js-element'
import { html, withLit } from 'js-element/lit'
import { Brand } from '../main/components/brand/brand'
import { LoginScreen } from '../main/components/login-screen/login-screen'

export default {
  title: 'login-screen'
}

import theme from '@shoelace-style/shoelace/dist/themes/light.styles'
const themeStyles = theme.toString()

@elem({
  tag: 'login-screen-demo',
  uses: [Brand, LoginScreen],
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
            vendor="meet+greet"
            title="Back Office"
            size="medium"
          ></sx-brand>
        </div>
      </sx-login-screen>
    `
}

export const loginScreen = () => h('login-screen-demo')
