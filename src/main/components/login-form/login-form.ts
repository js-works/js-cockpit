import { component, elem, prop, Attrs } from 'js-element'
import { classMap, createRef, html, lit, ref } from 'js-element/lit'
import { useI18n } from '../../utils/hooks'
import { I18n } from '../../misc/i18n'

// custom elements
import SlButton from '@shoelace-style/shoelace/dist/components/button/button'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox'
import { TextField } from '../text-field/text-field'
import { PasswordField } from '../password-field/password-field'
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

// prettier-ignore
I18n.addTranslations('en', {
  'js-cockpit.login-form': {
    'login-intro-headline': 'Login',
    'login-intro-text': 'Please enter your credentials to log in',
    'forgot-password-headline': 'Forgot password?',
    'forgot-password-text': "Please fill out and submit the form and you'll receive an e-mail with further instructions",
    'reset-password-headline': 'Reset password',
    'reset-password-text': 'Please fill out and submit the form to reset your password',
    'username': 'Username',
    'password': 'Password',
    'security-token': 'Security token',
    'remember-login': 'Remember login',
    'log-in': 'Log in',
    'send-e-mail': 'Send e-mail',
    'reset-password': 'Reset password',
    'forgot-password': 'Forgot password?',
    'go-to-login-form': 'Go to login from'
  }
})

@elem({
  tag: 'c-login-form',
  styles: [loginFormStyles, topAlignedLabelsStyles],
  impl: lit(loginFormImpl),
  uses: [PasswordField, TextField, SlButton, SlCheckbox, SlIcon]
})
class LoginForm extends component() {
  @prop({ attr: Attrs.string })
  initialView: 'login' | 'forgotPassword' | 'resetPassword' = 'login'

  @prop({ attr: Attrs.boolean })
  fullSize = false
}

function loginFormImpl(self: LoginForm) {
  const formRef = createRef<HTMLFormElement & Element>()
  const { t } = useI18n('js-cockpit.login-form')

  const onSubmit = (ev?: any) => {
    if (ev) {
      ev.preventDefault()
    } else if (!formRef.value!.checkValidity()) {
      return
    }

    const formData = new FormData(formRef.value!)
    let text = ''

    formData.forEach((value, key) => {
      if (text) {
        text += ', '
      }

      text += key + ': ' + value
    })

    alert(text)
  }

  const onSubmitClick = () => {
    onSubmit()
  }

  function render() {
    return html`
      <div class="base ${classMap({ 'full-size': self.fullSize })}">
        <div class="container">
          <div class="header">
            <slot name="header"></slot>
          </div>
          <div class="main">
            <div class="column1">
              <div class="column1-top login-intro" slot="login-intro">
                <div class="default-login-intro">
                  <slot name="login-intro">
                    <h3>${t('login-intro-headline')}</h3>
                    <p>${t('login-intro-text')}</p>
                  </slot>
                </div>
              </div>
              <div class="column1-bottom">
                <sl-icon alt="" src=${unlockSvg} class="unlock-icon" />
              </div>
            </div>
            <form disabled ${ref(formRef)} class="column2" @submit=${onSubmit}>
              <div class="column2-top">
                <slot name="login-fields">
                  <c-text-field
                    name="username"
                    label=${t('username')}
                    required
                  ></c-text-field>

                  <c-password-field
                    label=${t('password')}
                    required
                  ></c-password-field>
                </slot>
                <br />
                <div
                  style="text-align: right; font-size: var(--sl-font-size-medium); color: rgb(var(--sl-color-primary-800)); xxxfont-style: italic"
                >
                  ${t('forgot-password')}
                </div>
              </div>
              <div class="column2-bottom">
                <sl-checkbox>${t('remember-login')}</sl-checkbox>
                <sl-button
                  type="primary"
                  class="login-button"
                  @click=${onSubmitClick}
                >
                  ${t('log-in')}
                </sl-button>
              </div>
            </form>
          </div>
          <div class="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    `
  }

  return render
}
