import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { classMap, html, lit } from 'js-element/lit'
import { Theme } from '../../theming/theme'

// custom elements
import SlButton from '@shoelace-style/shoelace/dist/components/button/button'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox'
import SlForm from '@shoelace-style/shoelace/dist/components/form/form'
import { TextField } from '../text-field/text-field'
import { PasswordField } from '../password-field/password-field'
import { FormCtrlProvider } from '../form-ctrl-provider/form-ctrl-provider'
import { FormCtrl } from '../../ctrls/form-ctrl'
import { ThemeProvider } from '../theme-provider/theme-provider'
//import { formCtrlCtx } from '../../ctxs/form-ctrl-ctx'

// styles
import loginFormStyles from './login-form.css'
import topAlignedLabelsStyles from '../../shared/css/top-aligned-labels.css'

// icons
import unlockSvg from './assets/unlock.svg'

// === exports =======================================================

export { LoginForm }

// === constants =====================================================

// === types =========================================================

// === LoginForm ===================================================

@elem({
  tag: 'c-login-form',
  styles: [loginFormStyles, topAlignedLabelsStyles],
  uses: [
    FormCtrlProvider,
    PasswordField,
    TextField,
    SlButton,
    SlCheckbox,
    SlIcon,
    SlForm
  ],
  impl: lit(loginFormImpl)
})
class LoginForm extends component() {
  @prop
  theme?: Theme

  @prop({ attr: Attrs.boolean })
  fullSize = false
}

function loginFormImpl(self: LoginForm) {
  const formCtrl: FormCtrl = {
    submit() {
      alert('submit')
    },

    subscribeField: () => () => {}
  }

  const onSubmitClick = () => {
    formCtrl.submit(() => alert('handler'))
  }

  return () => html`
  i <c-theme-provider .theme=${self.theme}>
      <div class="base ${classMap({ 'full-size': self.fullSize })}">
        <div class="container">
          <div class="header">
            <slot name="header"> </slot>
          </div>
          <div class="main">
            <div class="column1">
              <div class="column1-top login-intro" slot="login-intro">
                <div class="default-login-intro">
                  <slot name="login-intro">
                    <h3>Login</h3>
                    <p>Please enter your credentials to log in</p>
                  </slot>
                </div>
              </div>
              <div class="column1-bottom">
                <sl-icon alt="" src=${unlockSvg} class="unlock-icon" />
              </div>
            </div>
            <form-ctrl-provider class="column2" .value=${formCtrl}>
              <div class="column2-top">
                <slot name="login-fields">
                  <c-text-field label="Username" required></c-text-field>
                  <c-password-field
                    label="Password"
                    required
                  ></c-password-field>
                </slot>
              </div>
              <div class="column2-bottom">
                <sl-checkbox>Remember login</sl-checkbox>
                <sl-button
                  type="primary"
                  class="login-button"
                  submit
                  @click=${onSubmitClick}
                  >Log in</sl-button
                >
              </div>
            </c-form-ctrl-provider>
          </div>
          <div class="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </c-theme-provider>
  `
}
