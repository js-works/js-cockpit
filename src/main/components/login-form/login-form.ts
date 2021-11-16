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
import { ThemeProvider } from '../theme-provider/theme-provider'

// styles
import loginFormStyles from './login-form.css'
import topAlignedLabelsStyles from '../../shared/css/label-alignment-above.css'

// icons
import loginIntroIcon from './assets/login.svg'
import forgotPasswordIntroIcon from './assets/forgot-password.svg'
import registrationIntroIcon from './assets/registration.svg'
import resetPasswordIntroIcon from './assets/reset-password.svg'

// === exports =======================================================

export { LoginForm }

// === constants =====================================================

// === types =========================================================

type View = 'login' | 'registration' | 'forgotPassword' | 'resetPassword'

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
    'go-to-registration': 'Need account?',
    'login-intro-headline': 'Login',
    'login-intro-text': 'Please enter your credentials in the form to log in',
    'login-submit-text': 'Log in',
    'new-password': 'New passwort',
    'new-password-repeat': 'Repeat new password',
    'password': 'Password',
    'register-intro-headline': 'Registration',
    'register-intro-text': 'Please fill out the form and press the submit button to register',
    'register-submit-text': 'Register',
    'remember-login': 'Remember login',
    'reset-password-intro-headline': 'Reset password',
    'reset-password-intro-text': 'Please fill out and submit the form to reset your password',
    'reset-password-submit-text': 'Reset password',
    'security-code': 'Security code',
    'username': 'Username',
  }
})

@elem({
  tag: 'c-login-form',
  styles: [loginFormStyles, topAlignedLabelsStyles],
  impl: lit(loginFormImpl),
  uses: [PasswordField, SlButton, SlCheckbox, SlIcon, TextField, ThemeProvider]
})
class LoginForm extends component() {
  @prop({ attr: Attrs.string })
  initialView?: View

  @prop({ attr: Attrs.boolean })
  enableRememberLogin = false

  @prop({ attr: Attrs.boolean })
  enableForgotPassword = false

  @prop({ attr: Attrs.boolean })
  enableRegistration = false

  @prop({ attr: Attrs.boolean })
  fullSize = false
}

function loginFormImpl(self: LoginForm) {
  const [state, setState] = useState({
    view: 'login' as View,
    formHidden: false
  })

  const formRef = createRef<HTMLFormElement & Element>()
  const { t } = useI18n('js-cockpit.login-form')

  const onForgotPasswordClick = () => {
    changeView('forgotPassword')
  }

  const onGoToLoginClick = () => {
    changeView('login')
  }

  const onGoToRegistrationClick = () => {
    changeView('registration')
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

    //alert(text)
  }

  const onSubmitClick = () => {
    onSubmit()
  }

  useOnInit(() => {
    let view: View = 'login'

    if (self.enableForgotPassword && self.initialView === 'forgotPassword') {
      view = 'forgotPassword'
    } else if (self.enableRegistration && self.initialView === 'registration') {
      view = 'registration'
    } else if (
      self.enableForgotPassword &&
      self.initialView === 'resetPassword'
    ) {
      view = 'resetPassword'
    }

    setState('view', view)
  })

  function changeView(view: View) {
    setState('formHidden', (it) => !it)

    setTimeout(() => {
      setState({ view, formHidden: false })
    }, 500)
  }

  function render() {
    return html`
      <c-theme-provider>
        <div class="base ${classMap({ 'full-size': self.fullSize })}">
          <div class="container">
            <div class="header">
              <slot name="header"></slot>
            </div>
            <div
              class="main ${classMap({
                hidden: state.formHidden
              })}"
            >
              <div class="column1">
                <div class="column1-top">${renderIntro()}</div>
                <div class="column1-bottom">${renderIntroIcon()}</div>
              </div>
              <form
                disabled
                ${ref(formRef)}
                class="column2"
                @submit=${onSubmit}
              >
                <div class="column2-top">${renderFields()}</div>
                <div class="column2-bottom">
                  ${state.view === 'login' && self.enableRememberLogin
                    ? html`<sl-checkbox>${t('remember-login')}</sl-checkbox>`
                    : ''}
                  <sl-button
                    type="primary"
                    class="login-button"
                    @click=${onSubmitClick}
                  >
                    ${renderSubmitButtonText()}
                  </sl-button>
                  ${renderLinks()}
                </div>
              </form>
            </div>
            <div class="footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
        <c-theme-provider> </c-theme-provider
      ></c-theme-provider>
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
      case 'registration':
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
    const icon =
      state.view === 'registration'
        ? registrationIntroIcon
        : state.view === 'forgotPassword'
        ? forgotPasswordIntroIcon
        : state.view === 'resetPassword'
        ? resetPasswordIntroIcon
        : loginIntroIcon

    return html`<sl-icon alt="" src=${icon} class="intro-icon" />`
  }

  function renderFields() {
    switch (state.view) {
      case 'login':
        return html`
          <slot name="login-fields">
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
        `

      case 'registration':
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
        `

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
        `

      case 'resetPassword':
        return html`
          <slot name="reset-password-fields">
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
        `
    }
  }

  function renderLinks() {
    switch (state.view) {
      case 'login':
        return html`
          <div class="links">
            ${renderForgotPasswordLink()} ${renderGoToRegistrationLink()}
          </div>
        `

      case 'registration':
        return html` <div class="links">${renderGoToLoginLink()}</div> `

      case 'forgotPassword':
        return html` <div class="links">${renderGoToLoginLink()}</div> `

      case 'resetPassword':
        return html` <div class="links">${renderGoToLoginLink()}</div> `
    }
  }

  function renderForgotPasswordLink() {
    return self.enableForgotPassword
      ? html`
          <sl-button
            type="text"
            class="forgot-password-link"
            @click=${onForgotPasswordClick}
          >
            ${t('forgot-password')}
          </sl-button>
        `
      : ''
  }

  function renderGoToLoginLink() {
    return html`
      <sl-button
        type="text"
        class="go-to-login-link"
        @click=${onGoToLoginClick}
      >
        ${t('go-to-login')}
      </sl-button>
    `
  }

  function renderGoToRegistrationLink() {
    return self.enableRegistration
      ? html`
          <sl-button
            type="text"
            class="go-to-registration-link"
            @click=${onGoToRegistrationClick}
          >
            ${t('go-to-registration')}
          </sl-button>
        `
      : ''
  }

  function renderSubmitButtonText() {
    switch (state.view) {
      case 'login':
        return t('login-submit-text')

      case 'registration':
        return t('register-submit-text')

      case 'forgotPassword':
        return t('forgot-password-submit-text')

      case 'resetPassword':
        return t('reset-password-submit-text')
    }
  }

  return render
}
