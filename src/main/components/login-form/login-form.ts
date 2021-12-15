import { component, elem, prop, Attrs } from 'js-element'
import { classMap, createRef, html, lit, ref } from 'js-element/lit'
import { useOnInit, useState } from 'js-element/hooks'
import { addToDict, TermsOf } from 'js-localize'
import { useI18n } from '../../utils/hooks'
import { hasSlot } from '../../utils/slots'

// custom elements
import SlAlert from '@shoelace-style/shoelace/dist/components/alert/alert'
import SlAnimation from '@shoelace-style/shoelace/dist/components/animation/animation'
import SlButton from '@shoelace-style/shoelace/dist/components/button/button'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox'
import { PasswordField } from '../password-field/password-field'
import { TextField } from '../text-field/text-field'

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

// === types =========================================================

type View = 'login' | 'registration' | 'forgotPassword' | 'resetPassword'

// === translations ==================================================

declare global {
  namespace Localize {
    interface TranslationsMap {
      'jsCockpit.loginForm': TermsOf<typeof translations>
    }
  }
}

const translations = {
  en: {
    'jsCockpit.loginForm': {
      email: 'Email',
      firstName: 'First name',
      lastName: 'Last name',
      forgotPassword: 'Forgot password?',
      forgotPasswordIntroHeadline: 'Forgot password?',
      forgotPasswordIntroText:
        "Please fill out and submit the form and you'll receive an e-mail with further instructions how to reset your password",
      forgotPasswordSubmitText: 'Request password reset',
      goToLogin: 'Go to login form',
      goToRegistration: 'Need account?',
      loginIntroHeadline: 'Login',
      loginIntroText: 'Please enter your credentials in the form to log in',
      loginSubmitText: 'Log in',
      newPassword: 'New passwort',
      newPasswordRepeat: 'Repeat new password',
      password: 'Password',
      registrationIntroHeadline: 'Registration',
      registrationIntroText:
        'Please fill out the form and press the submit button to register',
      registrationSubmitText: 'Register',
      rememberLogin: 'Remember login',
      resetPasswordIntroHeadline: 'Reset password',
      resetPasswordIntroText:
        'Please fill out and submit the form to reset your password',
      resetPasswordSubmitText: 'Reset password',
      securityCode: 'Security code',
      username: 'Username'
    }
  }
}

addToDict(translations)

// === Login form ====================================================

@elem({
  tag: 'c-login-form',
  styles: [loginFormStyles, topAlignedLabelsStyles],
  impl: lit(loginFormImpl),
  uses: [
    PasswordField,
    SlAlert,
    SlAnimation,
    SlButton,
    SlCheckbox,
    SlIcon,
    TextField
  ]
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
    view: 'login' as View
  })

  const animationRef = createRef<SlAnimation>()
  const formRef = createRef<HTMLFormElement>()
  const { t } = useI18n('jsCockpit.loginForm')

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
    console.log('onSubmit')
    const form = formRef.value!

    // TODO
    if (ev) {
      ev.preventDefault()
    }

    if (!form.checkValidity()) {
      console.log('check NOT okay')
      return
    }

    console.log('check okay')

    const formData = new FormData(form)
    let text = ''

    formData.forEach((value, key) => {
      if (text) {
        text += ', '
      }

      text += key + ': ' + value
    })

    console.log('form data:', text)
  }

  // TODO
  const onSubmitClick = (ev: any) => {
    const form = ev.target.closest('form') // TODO
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
    const animation = animationRef.value!
    animation.duration = 400
    animation.easing = 'ease'
    animation.iterations = 1
    animation.name = view === 'login' ? 'fadeOutRight' : 'fadeOutLeft'
    animation.play = true

    setTimeout(() => {
      animation.style.visibility = 'hidden'
    }, animation.duration - 50)

    animation.addEventListener('sl-finish', function listener() {
      setState({ view })
      setTimeout(() => (animation.style.visibility = 'visible'), 50)
      animation.removeEventListener('sl-finish', listener)
      animation.name = view === 'login' ? 'fadeInLeft' : 'fadeInRight'
      animation.play = true
    })
  }

  function render() {
    return html`
      <div class="base ${classMap({ 'full-size': self.fullSize })}">
        <sl-animation ${ref(animationRef)}>
          <div class="container">
            <div class="header">
              <slot name="header"></slot>
            </div>
            <div class="center">
              <div class="main">
                <div class="column1">
                  <div class="column1-top">${renderIntro()}</div>
                  <div class="column1-bottom">${renderIntroIcon()}</div>
                </div>
                <form class="column2" @submit=${onSubmit} ${ref(formRef)}>
                  <div class="column2-top">${renderFields()}</div>
                  <div class="column2-bottom">
                    ${state.view === 'login' && self.enableRememberLogin
                      ? html`<sl-checkbox>${t('rememberLogin')}</sl-checkbox>`
                      : ''}
                    <sl-button
                      type="primary"
                      size="large"
                      @click=${onSubmitClick}
                    >
                      ${renderSubmitButtonText()}
                    </sl-button>
                    ${renderLinks()}
                  </div>
                </form>
              </div>
            </div>
            <div class="footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </sl-animation>
      </div>
    `
  }

  function renderIntro() {
    switch (state.view) {
      case 'login':
        return html`
          <slot name="login-intro">
            <div class="default-intro">
              <h3>${t('loginIntroHeadline')}</h3>
              <p>${t('loginIntroText')}</p>
            </div>
          </slot>
        `

      case 'registration':
        return html`
          <slot name="registration-intro">
            <div class="default-intro">
              <h3>${t('registrationIntroHeadline')}</h3>
              <p>${t('registrationIntroText')}</p>
            </div>
          </slot>
        `

      case 'forgotPassword':
        return html`
          <slot name="forgot-password-intro">
            <div class="default-intro">
              <h3>${t('forgotPasswordIntroHeadline')}</h3>
              <p>${t('forgotPasswordIntroText')}</p>
            </div>
          </slot>
        `
      case 'resetPassword':
        return html`
          <slot name="reset-password-intro">
            <div class="default-intro">
              <h3>${t('resetPasswordIntroHeadline')}</h3>
              <p>${t('resetPasswordIntroText')}</p>
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
        return html` <slot name="login-fields" class="fields-slot"> </slot>
          ${hasSlot(self, 'login-fields')
            ? null
            : html`
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
              `}`

      case 'registration':
        return html`<slot name="registration-fields" class="fields-slot"></slot>
          ${hasSlot(self, 'registration-fields')
            ? null
            : html`
                <c-text-field
                  name="username-reg"
                  label=${t('username')}
                  required
                ></c-text-field>
                <c-text-field
                  name="firstName-reg"
                  label=${t('firstName')}
                  required
                ></c-text-field>
                <c-text-field
                  name="lastName-reg"
                  label=${t('lastName')}
                  required
                ></c-text-field>
                <c-email-field
                  name="email-reg"
                  label=${t('email')}
                  required
                ></c-email-field>
              `}`

      case 'forgotPassword':
        return html`<slot
            name="forgot-password-fields"
            class="fields-slot"
          ></slot>
          ${hasSlot(self, 'forgot-password-fields')
            ? null
            : html`
                <c-text-field
                  name="username-fp"
                  label=${t('username')}
                  required
                ></c-text-field>

                <c-email-field
                  name="email-fp"
                  label=${t('email')}
                  required
                ></c-email-field>
              `}`

      case 'resetPassword':
        return html`<slot
            name="reset-password-fields"
            class="fields-slot"
          ></slot>
          ${hasSlot(self, 'forgot-password-fields')
            ? null
            : html`
                <c-text-field
                  name="username-rp"
                  label=${t('username')}
                  required
                ></c-text-field>
                <c-password-field
                  name="newPasswordRepeat-rp"
                  label=${t('newPasswordRepeat')}
                  required
                ></c-password-field>
                <c-text-field
                  name="securityCode-rp"
                  label=${t('securityCode')}
                  required
                ></c-text-field>
              `}`
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
            ${t('forgotPassword')}
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
        ${t('goToLogin')}
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
            ${t('goToRegistration')}
          </sl-button>
        `
      : ''
  }

  function renderSubmitButtonText() {
    switch (state.view) {
      case 'login':
        return t('loginSubmitText')

      case 'registration':
        return t('registrationSubmitText')

      case 'forgotPassword':
        return t('forgotPasswordSubmitText')

      case 'resetPassword':
        return t('resetPasswordSubmitText')
    }
  }

  return render
}
