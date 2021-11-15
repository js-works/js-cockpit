import { component, elem, prop, Attrs } from 'js-element'
import { classMap, createRef, html, lit, ref } from 'js-element/lit'
import { useOnInit, useState } from 'js-element/hooks'
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
import topAlignedLabelsStyles from '../../shared/css/label-alignment-above.css'

// icons
import introIcon from './assets/unlock.svg'

// === exports =======================================================

export { LoginForm }

// === constants =====================================================

// === types =========================================================

type View = 'login' | 'register' | 'forgotPassword' | 'resetPassword'

// === LoginForm ===================================================

// prettier-ignore
I18n.addTranslations('en', {
  'js-cockpit.login-form': {
    'email': 'Email',
    'first-name': 'First name',
    'last-name': 'Last name',
    'forgot-password': 'Forgot password?',
    'forgot-password-intro-headline': 'Forgot password?',
    'forgot-password-intro-text': "Please fill out and submit the form and you'll receive an e-mail with further instructions how to reset your password",
    'forgot-password-submit-text': 'Request password reset',
    'go-to-login': 'Go to login form',
    'login-intro-headline': 'Login',
    'login-intro-text': 'Please enter your credentials in the form to log in',
    'login-submit-text': 'Log in',
    'new-password': 'New passwort',
    'new-password-repeat': 'Repeat new password',
    'password': 'Password',
    'register-intro-headline': 'Reset password',
    'register-intro-text': 'Please fill out the form and press the submit button to register',
    'register-submit-text': 'Register',
    'remember-login': 'Remember login',
    'reset-password': 'Reset password',
    'reset-password-intro-headline': 'Reset password',
    'reset-password-intro-text': 'Please fill out and submit the form to reset your password',
    'reset-password-submit-text': 'Reset password',
    'security-code': 'Security code',
    'send-e-mail': 'Send e-mail',
    'username': 'Username',
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
  initialView?: View

  @prop({ attr: Attrs.boolean })
  showRememberLogin = false

  @prop({ attr: Attrs.boolean })
  showForgotPassword = false

  @prop({ attr: Attrs.boolean })
  fullSize = false
}

function loginFormImpl(self: LoginForm) {
  const [state, setState] = useState({
    view: 'login' as View
  })

  const formRef = createRef<HTMLFormElement & Element>()
  const { t } = useI18n('js-cockpit.login-form')

  const onForgotPasswordClick = () => {
    setState('view', 'forgotPassword')
  }

  const onGoToLoginClick = () => {
    setState('view', 'login')
  }

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

  useOnInit(() => {
    setState('view', self.initialView || 'login')
  })

  function render() {
    return html`
      <div class="base ${classMap({ 'full-size': self.fullSize })}">
        <div class="container">
          <div class="header">
            <slot name="header"></slot>
          </div>
          <div class="main">
            <div class="column1">
              <div class="column1-top">${renderIntro()}</div>
              <div class="column1-bottom">${renderIntroIcon()}</div>
            </div>
            <form disabled ${ref(formRef)} class="column2" @submit=${onSubmit}>
              <div class="column2-top">${renderFields()}</div>
              <div class="column2-bottom">
                ${state.view === 'login' && self.showRememberLogin
                  ? html`<sl-checkbox>${t('remember-login')}</sl-checkbox>`
                  : ''}
                <sl-button
                  type="primary"
                  class="login-button"
                  @click=${onSubmitClick}
                >
                  ${renderSubmitButtonText()}
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

  function renderIntro() {
    switch (state.view) {
      case 'login':
        return html`
          <slot name="login-intro">
            <div class="default-intro">
              <h3>${t('login-intro-headline')}</h3>
              <p>${t('login-intro-text')}</p>
            </div>
          </slot>
        `
      case 'register':
        return html`
          <slot name="register-intro">
            <div class="default-intro">
              <h3>${t('register-intro-headline')}</h3>
              <p>${t('register-intro-text')}</p>
            </div>
          </slot>
        `

      case 'forgotPassword':
        return html`
          <slot name="forgot-password-intro">
            <div class="default-intro">
              <h3>${t('forgot-password-intro-headline')}</h3>
              <p>${t('forgot-password-intro-text')}</p>
            </div>
          </slot>
        `
      case 'resetPassword':
        return html`
          <slot name="reset-password-intro">
            <div class="default-intro">
              <h3>${t('reset-password-intro-headline')}</h3>
              <p>${t('reset-password-intro-text')}</p>
            </div>
          </slot>
        `
    }
  }

  function renderIntroIcon() {
    return html`<sl-icon alt="" src=${introIcon} class="intro-icon" />`
  }

  function renderFields() {
    switch (state.view) {
      case 'login':
        return html`<slot name="login-fields">
            <c-text-field
              name="username"
              label=${t('username')}
              required
            ></c-text-field>

            <c-password-field
              name="password"
              label=${t('password')}
              required
            ></c-password-field>
          </slot>
          <br />
          ${self.showForgotPassword
            ? html`<div class="forgot-password-link-container">
                <sl-button
                  type="text"
                  class="forgot-password-link"
                  @click=${onForgotPasswordClick}
                >
                  ${t('forgot-password')}
                </sl-button>
              </div>`
            : ''}`

      case 'register':
        return html`<slot name="register-fields">
            <c-text-field
              name="username"
              label=${t('username')}
              required
            ></c-text-field>
            <c-text-field
              name="firstName"
              label=${t('first-name')}
              required
            ></c-text-field>
            <c-text-field
              name="lastName"
              label=${t('last-name')}
              required
            ></c-text-field>
            <c-text-field
              name="email"
              label=${t('email')}
              required
            ></c-password-field>
          </slot>
          <br />
          ${
            self.showForgotPassword
              ? html`<div class="go-to-login-link-container">
                  <sl-button
                    type="text"
                    class="forgot-password-link"
                    @click=${onGoToLoginClick}
                  >
                    ${t('go-to-login')}
                  </sl-button>
                </div>`
              : ''
          }`

      case 'forgotPassword':
        return html`<slot name="forgot-password-fields">
            <c-text-field
              name="username"
              label=${t('username')}
              required
            ></c-text-field>

            <c-text-field
              name="email"
              label=${t('email')}
              required
            ></c-password-field>
          </slot>
          <br />
          ${
            self.showForgotPassword
              ? html`<div class="go-to-login-link-container">
                  <sl-button
                    type="text"
                    class="go-to-login-link"
                    @click=${onGoToLoginClick}
                  >
                    ${t('go-to-login')}
                  </sl-button>
                </div>`
              : ''
          }`

      case 'resetPassword':
        return html`<slot name="reset-password-fields">
            <c-text-field
              name="username"
              label=${t('username')}
              required
            ></c-text-field>
            <c-password-field
              name="newPasswordRepeat"
              label=${t('new-password')}
              required
            ></c-password-field>
            <c-password-field
              name="newPassword"
              label=${t('new-password-repeat')}
              required
            ></c-password-field>
            <c-text-field
              name="securityCode"
              label=${t('security-code')}
              required
            ></c-text-field>
          </slot>
          <br />
          ${self.showForgotPassword
            ? html`<div class="forgot-password-link-container">
                <sl-button
                  type="text"
                  class="forgot-password-link"
                  @click=${onGoToLoginClick}
                >
                  ${t('go-to-login')}
                </sl-button>
              </div>`
            : ''}`
    }
  }

  function renderSubmitButtonText() {
    switch (state.view) {
      case 'login':
        return t('login-submit-text')

      case 'register':
        return t('register-submit-text')

      case 'forgotPassword':
        return t('forgot-password-submit-text')

      case 'resetPassword':
        return t('reset-password-submit-text')
    }
  }

  return render
}
