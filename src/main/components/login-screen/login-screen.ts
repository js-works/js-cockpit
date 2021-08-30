// external imports
import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, createRef, repeat, withLit, Ref } from 'js-element/lit'

// custom elements
import SlButton from '@shoelace-style/shoelace/dist/components/button/button'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlInput from '@shoelace-style/shoelace/dist/components/input/input'
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox'

// styles
import loginScreenStyles from './login-screen.css'

// icons
import unlockSvg from './assets/unlock.svg'

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
      <div class="container">
        <div class="header">
          <slot name="header"> </slot>
        </div>
        <div class="main">
          <div class="column1">
            <div class="column1-top login-intro" slot="login-intro">
              <div class="default-login-intro">
                <h3>Login</h3>
                <p>Please enter your credentials to log in</p>
              </div>
            </div>
            <div class="column1-bottom">
              <sl-icon alt="" src=${unlockSvg} class="unlock-icon" />
            </div>
          </div>
          <div class="column2">
            <div class="column2-top">
              <sl-input label="Username" size="small"></sl-input>
              <sl-input
                type="password"
                label="Password"
                size="small"
              ></sl-input>
            </div>
            <div class="column2-bottom">
              <sl-checkbox>Remember login</sl-checkbox>
              <sl-button type="primary" class="login-button">Log in</sl-button>
            </div>
          </div>
        </div>
        <div class="footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  `
}
