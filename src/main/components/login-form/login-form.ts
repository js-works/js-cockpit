import {
  afterInit,
  afterUpdate,
  bind,
  createEmitter,
  elem,
  prop,
  state,
  Attrs,
  Component,
  Listener
} from '../../utils/components'

import { classMap, createRef, html, ref, repeat } from '../../utils/lit'
import { I18nController } from '../../i18n/i18n'
import { hasSlot } from '../../utils/slots'

// custom elements
import SlAnimation from '@shoelace-style/shoelace/dist/components/animation/animation'
import SlButton from '@shoelace-style/shoelace/dist/components/button/button'
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlSpinner from '@shoelace-style/shoelace/dist/components/spinner/spinner'
import { FocusTrap } from '@a11y/focus-trap'
import { MessageBar } from '../message-bar/message-bar'
import { Form } from '../form/form'
import { PasswordField } from '../password-field/password-field'
import { TextField } from '../text-field/text-field'

// styles
import loginFormStyles from './login-form.css'
import topAlignedLabelsStyles from '../../shared/css/label-vertical.css'

// icons
import loginIntroIcon from './assets/login.svg'
import forgotPasswordIntroIcon from './assets/forgot-password.svg'
import registrationIntroIcon from './assets/registration.svg'
import resetPasswordIntroIcon from './assets/reset-password.svg'

// === exports =======================================================

export { LoginForm }

// === types =========================================================

type View = 'login' | 'registration' | 'forgotPassword' | 'resetPassword'

namespace LoginForm {
  export type SubmitData =
    | {
        view: 'login'
        locale: string
        rememberLogin: boolean
        params: Record<string, any>
      }
    | {
        view: 'forgotPassword' | 'resetPassword' | 'registration'
        locale: string
        params: Record<string, any>
      }
}

// === Login form ====================================================

@elem({
  tag: 'c-login-form',
  styles: [loginFormStyles, topAlignedLabelsStyles],
  uses: [
    FocusTrap,
    Form,
    MessageBar,
    PasswordField,
    SlAnimation,
    SlButton,
    SlCheckbox,
    SlIcon,
    SlSpinner,
    TextField
  ]
})
class LoginForm extends Component {
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

  @prop
  processSubmit?: (
    data: LoginForm.SubmitData
  ) => Promise<string | undefined | null>

  @state
  private _view: View = 'login'

  @state
  private _showInvalidFormError = false

  @state
  private _successMessage = ''

  @state
  private _errorMessage = ''

  @state
  private _messageFading = 'none' as 'none' | 'fadeOut'

  @state
  private _isLoading = false

  private _submitButtonRef = createRef<SlButton>()
  private _animationRef = createRef<SlAnimation>()
  private _formRef = createRef<Form>()
  private _i18n = new I18nController(this)
  private _t = this._i18n.translate('jsCockpit.loginForm')

  @bind
  private _onForgotPasswordClick() {
    this._changeView('forgotPassword')
  }

  @bind
  private _onGoToLoginClick() {
    this._changeView('login')
  }

  @bind
  private _onGoToRegistrationClick() {
    this._changeView('registration')
  }

  @bind
  private _onSubmit(ev?: any) {
    const form = this._formRef.value!

    // TODO
    if (ev) {
      ev.preventDefault()
    }
    /*
    if (!form.checkValidity()) {
      this._showInvalidFormError = true
      return
    }

    if (typeof this.processSubmit !== 'function') {
      this._errorMessage = ''
      this._successMessage = ''
      return
    }

    const formData = new FormData(form)

    const data: LoginForm.SubmitData = {
      view: this._view as any,
      locale: this._i18n.getLocale(),
      params: {}
    }

    formData.forEach((value, key) => {
      data.params[key] = value
    })

    if (this._view === 'login') {
      ;(data as any).remeberLogin = this.enableRememberLogin // TODO!!!!
    }

    this._isLoading = true
    this._successMessage = ''
    this._errorMessage = ''
    this._submitButtonRef.value!.focus()

    this.processSubmit(data)
      .then((message) => {
        this._isLoading = false
        ;(this._successMessage = 'Success'), (this._errorMessage = '')
      })
      .catch((error) => {
        this._isLoading = false
        this._successMessage = ''
        this._errorMessage = String(error)
      })
  */
  }

  @bind
  private _onSubmitClick(ev: any) {
    this._formRef.value!.submit()
  }

  constructor() {
    super()

    this.addEventListener('mousedown', (ev) => {
      if (this._isLoading) {
        ev.preventDefault()
      }
    })

    afterInit(this, () => {
      let view: View = 'login'

      if (this.enableForgotPassword && this.initialView === 'forgotPassword') {
        view = 'forgotPassword'
      } else if (
        this.enableRegistration &&
        this.initialView === 'registration'
      ) {
        view = 'registration'
      } else if (
        this.enableForgotPassword &&
        this.initialView === 'resetPassword'
      ) {
        view = 'resetPassword'
      }

      this._view = view

      this.addEventListener('input', () => {
        this._clearMessages(true)
      })
    })
  }

  private _clearMessages(delayed = false) {
    if (
      this._showInvalidFormError ||
      this._successMessage ||
      this._errorMessage
    ) {
      if (!delayed) {
        ;(this._showInvalidFormError = false),
          (this._successMessage = ''),
          (this._errorMessage = ''),
          (this._messageFading = 'none')
      } else {
        this._messageFading = 'fadeOut'
        setTimeout(() => this._clearMessages(), 500)
      }
    }
  }

  private _changeView(view: View) {
    const animation = this._animationRef.value!
    animation.duration = 400
    animation.easing = 'ease'
    animation.iterations = 1
    animation.name = view === 'login' ? 'fadeOutRight' : 'fadeOutLeft'
    animation.play = true

    setTimeout(() => {
      animation.style.visibility = 'hidden'
    }, animation.duration - 50)

    const finishListener = () => {
      this._view = view
      this._isLoading = false
      this._clearMessages()
      setTimeout(() => (animation.style.visibility = 'visible'), 50)
      animation.removeEventListener('sl-finish', finishListener)
      animation.name = view === 'login' ? 'fadeInLeft' : 'fadeInRight'
      animation.play = true
    }

    animation.addEventListener('sl-finish', finishListener)
  }

  render() {
    return html`
      <div class="base ${classMap({ 'full-size': this.fullSize })}">
        ${!this._isLoading ? null : html`<div class="overlay"></div>`}
        <sl-animation ${ref(this._animationRef)}>
          <div class="container">
            <div class="header">
              <slot name="header"></slot>
            </div>
            <div class="center">
              <div class="main">
                <div class="column1">
                  <div class="column1-top">
                    <div>${this._renderIntro()}</div>
                    ${this._view !== 'login'
                      ? null
                      : html`<div class="login-intro-appendix">
                          <slot name="login-intro-appendix"></slot>
                        </div>`}
                  </div>
                  <div class="column1-bottom">${this._renderIntroIcon()}</div>
                </div>
                <c-form
                  class="column2"
                  @submit=${this._onSubmit}
                  @xxx=${() => console.log('wooohoo')}
                  ${ref(this._formRef)}
                >
                  <div class="column2-top">${this._renderFields()}</div>
                  <div class="column2-bottom">
                    ${this._view !== 'login' || !this.enableRememberLogin
                      ? null
                      : html`<sl-checkbox
                          >${this._t('rememberLogin')}</sl-checkbox
                        >`}
                    ${!this._showInvalidFormError
                      ? null
                      : html`<c-message-bar
                          variant="danger"
                          class=${classMap({
                            message: true,
                            'fade-out': this._messageFading === 'fadeOut'
                          })}
                        >
                          ${this._i18n.translate(
                            'jsCockpit.validation',
                            'formInvalid'
                          )}
                        </c-message-bar>`}
                    ${!this._successMessage
                      ? null
                      : html`<c-message-bar
                          variant="success"
                          class=${classMap({
                            message: true,
                            'fade-out': this._messageFading === 'fadeOut'
                          })}
                        >
                          ${this._successMessage}
                        </c-message-bar>`}
                    ${!this._errorMessage
                      ? null
                      : html`<c-message-bar
                          variant="danger"
                          class=${classMap({
                            message: true,
                            'fade-out': this._messageFading === 'fadeOut'
                          })}
                        >
                          ${this._errorMessage}
                        </c-message-bar>`}
                    <focus-trap .inactive=${!this._isLoading}>
                      <sl-button
                        variant="primary"
                        size="large"
                        class="submit-button"
                        @click=${this._onSubmitClick}
                        ${ref(this._submitButtonRef)}
                      >
                        <div class="submit-button-content">
                          <span class="submit-button-text">
                            ${this._renderSubmitButtonText()}
                          </span>
                          ${!this._isLoading
                            ? null
                            : html`<sl-spinner
                                class="submit-button-spinner"
                              ></sl-spinner>`}
                        </div>
                      </sl-button>
                    </focus-trap>
                    ${this._renderLinks()}
                  </div>
                </c-form>
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

  private _renderIntro() {
    switch (this._view) {
      case 'login':
        return html`
          <slot name="login-intro">
            <div class="default-intro">
              <h3>${this._t('loginIntroHeadline')}</h3>
              <p>${this._t('loginIntroText')}</p>
            </div>
          </slot>
        `

      case 'registration':
        return html`
          <slot name="registration-intro">
            <div class="default-intro">
              <h3>${this._t('registrationIntroHeadline')}</h3>
              <p>${this._t('registrationIntroText')}</p>
            </div>
          </slot>
        `

      case 'forgotPassword':
        return html`
          <slot name="forgot-password-intro">
            <div class="default-intro">
              <h3>${this._t('forgotPasswordIntroHeadline')}</h3>
              <p>${this._t('forgotPasswordIntroText')}</p>
            </div>
          </slot>
        `
      case 'resetPassword':
        return html`
          <slot name="reset-password-intro">
            <div class="default-intro">
              <h3>${this._t('resetPasswordIntroHeadline')}</h3>
              <p>${this._t('resetPasswordIntroText')}</p>
            </div>
          </slot>
        `
    }
  }

  private _renderIntroIcon() {
    const icon =
      this._view === 'registration'
        ? registrationIntroIcon
        : this._view === 'forgotPassword'
        ? forgotPasswordIntroIcon
        : this._view === 'resetPassword'
        ? resetPasswordIntroIcon
        : loginIntroIcon

    return html`<sl-icon alt="" src=${icon} class="intro-icon" />`
  }

  private _renderFields() {
    switch (this._view) {
      case 'login':
        return html`<slot name="login-fields" class="fields-slot"></slot>
          ${hasSlot(this, 'login-fields')
            ? null
            : html`
                <c-text-field
                  name="username"
                  label=${this._t('username')}
                  required
                ></c-text-field>
                <c-password-field
                  name="password"
                  label=${this._t('password')}
                  required
                ></c-password-field>
              `}`

      case 'registration':
        return html`<slot name="registration-fields" class="fields-slot"></slot>
          ${hasSlot(this, 'registration-fields')
            ? null
            : html`
                <c-text-field
                  name="username-reg"
                  label=${this._t('username')}
                  required
                ></c-text-field>
                <c-text-field
                  name="firstName-reg"
                  label=${this._t('firstName')}
                  required
                ></c-text-field>
                <c-text-field
                  name="lastName-reg"
                  label=${this._t('lastName')}
                  required
                ></c-text-field>
                <c-email-field
                  name="email-reg"
                  label=${this._t('email')}
                  required
                ></c-email-field>
              `}`

      case 'forgotPassword':
        return html`<slot
            name="forgot-password-fields"
            class="fields-slot"
          ></slot>
          ${hasSlot(this, 'forgot-password-fields')
            ? null
            : html`
                <c-text-field
                  name="username-fp"
                  label=${this._t('username')}
                  required
                ></c-text-field>

                <c-email-field
                  name="email-fp"
                  label=${this._t('email')}
                  required
                ></c-email-field>
              `}`

      case 'resetPassword':
        return html`<slot
            name="reset-password-fields"
            class="fields-slot"
          ></slot>
          ${hasSlot(this, 'forgot-password-fields')
            ? null
            : html`
                <c-text-field
                  name="username-rp"
                  label=${this._t('username')}
                  required
                ></c-text-field>
                <c-password-field
                  name="newPasswordRepeat-rp"
                  label=${this._t('newPasswordRepeat')}
                  required
                ></c-password-field>
                <c-text-field
                  name="securityCode-rp"
                  label=${this._t('securityCode')}
                  required
                ></c-text-field>
              `}`
    }
  }

  private _renderLinks() {
    switch (this._view) {
      case 'login':
        return html`
          <div class="links">
            ${this._renderForgotPasswordLink()}
            ${this._renderGoToRegistrationLink()}
          </div>
        `

      case 'registration':
        return html` <div class="links">${this._renderGoToLoginLink()}</div> `

      case 'forgotPassword':
        return html` <div class="links">${this._renderGoToLoginLink()}</div> `

      case 'resetPassword':
        return html` <div class="links">${this._renderGoToLoginLink()}</div> `
    }
  }

  private _renderForgotPasswordLink() {
    return this.enableForgotPassword
      ? html`
          <sl-button
            variant="text"
            class="forgot-password-link"
            @click=${this._onForgotPasswordClick}
          >
            ${this._t('forgotPassword')}
          </sl-button>
        `
      : ''
  }

  private _renderGoToLoginLink() {
    return html`
      <sl-button
        variant="text"
        class="go-to-login-link"
        @click=${this._onGoToLoginClick}
      >
        ${this._t('goToLogin')}
      </sl-button>
    `
  }

  private _renderGoToRegistrationLink() {
    return this.enableRegistration
      ? html`
          <sl-button
            variant="text"
            class="go-to-registration-link"
            @click=${this._onGoToRegistrationClick}
          >
            ${this._t('goToRegistration')}
          </sl-button>
        `
      : ''
  }

  private _renderSubmitButtonText() {
    if (!this._isLoading) {
      switch (this._view) {
        case 'login':
          return this._t('loginSubmitText')

        case 'registration':
          return this._t('registrationSubmitText')

        case 'forgotPassword':
          return this._t('forgotPasswordSubmitText')

        case 'resetPassword':
          return this._t('resetPasswordSubmitText')
      }
    } else {
      switch (this._view) {
        case 'login':
          return this._t('processingLoginSubmit')

        case 'forgotPassword':
          return this._t('processingForgotPasswordSubmit')

        case 'resetPassword':
          return this._t('processingResetPasswordSubmit')

        case 'registration':
          return this._t('processingRegistrationSubmit')
      }
    }
  }
}
