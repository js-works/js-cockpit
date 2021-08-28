// external imports
import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, createRef, repeat, withLit, Ref } from 'js-element/lit'

// custom elements
import SlButton from '@shoelace-style/shoelace/dist/components/button/button'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'

// styles
import loginScreenStyles from './login-screen.css'

// === exports =======================================================

export { LoginScreen }

// === constants =====================================================

// === types =========================================================

// === LoginScreen ===================================================

@elem({
  tag: 'sx-login-screen',
  styles: loginScreenStyles,
  uses: [SlButton, SlIcon],
  impl: withLit(loginScreenImpl)
})
class LoginScreen extends component() {}

function loginScreenImpl(self: LoginScreen) {
  return () => html`
    <div class="base">
      <div class="header">Header</div>
      <div class="maiin">
        <div>Left</div>
        <div>Right</div>
      </div>
      <div class="footer">Footer</div>
    </div>
  `
}
