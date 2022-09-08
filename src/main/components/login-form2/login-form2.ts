import {
  afterInit,
  afterUpdate,
  createEmitter,
  elem,
  prop,
  state,
  Attrs,
  Component,
  Listener
} from '../../utils/components';

import {
  classMap,
  createRef,
  html,
  ref,
  repeat,
  TemplateResult,
  when
} from '../../utils/lit';

import { I18nController } from '../../i18n/i18n';
import { hasSlot } from '../../utils/slots';

// custom elements
import SlAnimation from '@shoelace-style/shoelace/dist/components/animation/animation';
import SlButton from '@shoelace-style/shoelace/dist/components/button/button';
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlSpinner from '@shoelace-style/shoelace/dist/components/spinner/spinner';
import { FocusTrap } from '@a11y/focus-trap';
import { Message } from '../message/message';
import { Form } from '../form/form';
import { PasswordField } from '../password-field/password-field';
import { TextField } from '../text-field/text-field';
import { Brand } from '../brand/brand';

// styles
import loginFormStyles from './login-form2.styles';
import { FormSubmitEvent } from 'js-cockpit';

// === exports =======================================================

export { LoginForm as LoginForm2 };

// === types =========================================================

namespace LoginForm {
  export type View =
    | 'login'
    | 'registration'
    | 'forgotPassword'
    | 'resetPassword';

  export type SubmitData =
    | {
        view: 'login';
        locale: string;
        rememberLogin: boolean;
        params: Record<string, any>;
      }
    | {
        view: 'forgotPassword' | 'resetPassword' | 'registration';
        locale: string;
        params: Record<string, any>;
      };
}

// === local types ===================================================

// === Login form ====================================================

@elem({
  tag: 'cp-login-form2',
  styles: loginFormStyles,

  uses: [
    Brand,
    FocusTrap,
    Form,
    Message,
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
  @prop({ attr: Attrs.boolean })
  fullSize = false;

  @prop(Attrs.string)
  initialView?: LoginForm.View;

  @prop(Attrs.boolean)
  enableRememberLogin = false;

  @prop(Attrs.boolean)
  enableForgotPassword = false;

  @prop(Attrs.boolean)
  enableRegistration = false;

  @prop
  processSubmit?: (
    data: LoginForm.SubmitData
  ) => Promise<string | undefined | null>;

  @state
  private _view: LoginForm.View = 'login';

  @state
  private _isLoading = false;

  @state
  private _errorBoxVisible = false;

  private _i18n = new I18nController(this);
  private _t = this._i18n.translate('jsCockpit.loginForm');
  private _formRef = createRef<Form>();
  private _rememberLoginCheckboxRef = createRef<SlCheckbox>();
  private _submitButtonRef = createRef<SlButton>();
  private _animationRef = createRef<SlAnimation>();

  private _onInput = () => {
    this._errorBoxVisible = false;
  };

  private _onFormSubmit = async (ev: FormSubmitEvent) => {
    if (!this.processSubmit) {
      return;
    }

    this._submitButtonRef.value!.focus();

    const data: LoginForm.SubmitData =
      this._view === 'login'
        ? {
            view: 'login',
            locale: this._i18n.getLocale(),
            rememberLogin: !!this._rememberLoginCheckboxRef.value?.checked,
            params: ev.detail.data || {} // TODO!!!
          }
        : {
            view: this._view,
            locale: this._i18n.getLocale(),
            params: ev.detail.data || {} // TODO!!!
          };

    this._isLoading = true;

    try {
      await this.processSubmit(data);
    } catch {
    } finally {
      this._isLoading = false;
    }
  };

  private _onFormInvalid = () => {
    this._errorBoxVisible = true;
  };

  private _onSubmitClick = (ev: any) => {
    this._formRef.value!.submit();
  };

  private _onForgotPasswordClick = () => {
    this._changeView('forgotPassword');
  };

  private _onGoToLoginClick = () => {
    this._changeView('login');
  };

  private _onGoToRegistrationClick = () => {
    this._changeView('registration');
  };

  private _changeView(view: LoginForm.View) {
    const animation = this._animationRef.value!;
    animation.duration = 400;
    animation.easing = 'ease';
    animation.iterations = 1;
    animation.name = view === 'login' ? 'fadeOutRight' : 'fadeOutLeft';
    animation.play = true;

    setTimeout(() => {
      animation.style.visibility = 'hidden';
    }, animation.duration - 50);

    const finishListener = () => {
      this._view = view;
      this._isLoading = false;
      this._errorBoxVisible = false;
      setTimeout(() => (animation.style.visibility = 'visible'), 50);
      animation.removeEventListener('sl-finish', finishListener);
      animation.name = view === 'login' ? 'fadeInLeft' : 'fadeInRight';
      animation.play = true;
    };

    animation.addEventListener('sl-finish', finishListener);
  }

  render() {
    return html`
      <div
        class="base ${classMap({
          'full-size': this.fullSize
        })}"
      >
        ${!this._isLoading ? null : html`<div class="overlay"></div>`}
        ${this._renderHeader()}
        <sl-animation ${ref(this._animationRef)}>
          <div class="main">${this._renderMain()}</div>
        </sl-animation>
        <div class="footer">${this._renderFooter()}</div>
      </div>
    `;
  }

  private _renderHeader() {
    return html`
      <div class="header">
        <div class="header-start"><slot name="header-start" /></div>
        <div class="header-main"><slot name="header" /></div>
        <div class="header-end"><slot name="header-end" /></div>
      </div>
    `;
  }

  private _renderMain() {
    return html`
      <cp-form
        class="form"
        .onFormSubmit=${this._onFormSubmit}
        .onFormInvalid=${this._onFormInvalid}
        @input=${this._onInput}
        ${ref(this._formRef)}
      >
        ${when(
          hasSlot(this, 'form-fields-start'),
          () => html`
            <div class="form-fields-start">
              <slot name="form-fields-start"></slot>
            </div>
          `
        )}
        <div class="form-fields">${this._renderFormFields()}</div>
        <div class="form-footer">
          ${when(
            this._view === 'login' && this.enableRememberLogin,
            () => html`
              <div>
                <sl-checkbox
                  class="remember-login-checkbox"
                  ${ref(this._rememberLoginCheckboxRef)}
                >
                  ${this._t('rememberLogin')}
                </sl-checkbox>
              </div>
            `
          )}
          <cp-message
            class="error-box"
            variant="danger"
            .hidden=${!this._errorBoxVisible}
          >
            ${this._i18n.translate('jsCockpit.validation', 'formInvalid')}
          </cp-message>
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
          <div class="links">${this._renderLinks()}</div>
        </div>
      </cp-form>
    `;
  }

  _renderFormFields() {
    switch (this._view) {
      case 'login':
        return html`
          <h3 class="form-fields-headline">${this._t('loginIntroHeadline')}</h3>
          <p class="form-fields-text">${this._t('loginIntroText')}</p>
          <slot name="login-fields" class="fields-slot"></slot>
          ${hasSlot(this, 'login-fields')
            ? null
            : html`
                <cp-text-field
                  name="username"
                  label=${this._t('username')}
                  required
                ></cp-text-field>
                <cp-password-field
                  name="password"
                  label=${this._t('password')}
                  required
                ></cp-password-field>
              `}
        `;

      case 'registration':
        return html`
          <h3 class="form-fields-headline">
            ${this._t('registrationIntroHeadline')}
          </h3>
          <p class="form-fields-text">${this._t('registrationIntroText')}</p>
          <slot name="registration-fields" class="fields-slot"></slot>
          ${hasSlot(this, 'registration-fields')
            ? null
            : html`
                <cp-text-field
                  name="username-reg"
                  label=${this._t('username')}
                  required
                ></cp-text-field>
                <cp-text-field
                  name="firstName-reg"
                  label=${this._t('firstName')}
                  required
                ></cp-text-field>
                <cp-text-field
                  name="lastName-reg"
                  label=${this._t('lastName')}
                  required
                ></cp-text-field>
                <cp-email-field
                  name="email-reg"
                  label=${this._t('email')}
                  required
                ></cp-email-field>
              `}
        `;

      case 'forgotPassword':
        return html`
          <h3 class="form-fields-headline">
            ${this._t('forgotPasswordIntroHeadline')}
          </h3>
          <p class="form-fields-text">${this._t('forgotPasswordIntroText')}</p>
          <slot name="forgot-password-fields" class="fields-slot"></slot>
          ${hasSlot(this, 'forgot-password-fields')
            ? null
            : html`
                <cp-text-field
                  name="username-fp"
                  label=${this._t('username')}
                  required
                ></cp-text-field>

                <cp-email-field
                  name="email-fp"
                  label=${this._t('email')}
                  required
                ></cp-email-field>
              `}
        `;

      case 'resetPassword':
        return html`<slot
            name="reset-password-fields"
            class="fields-slot"
          ></slot>
          <h3 class="form-fields-headline">Reset password</h3>
          <p class="form-fields-text">${this._t('resetPasswordIntroText')}</p>
          ${hasSlot(this, 'reset-password-fields')
            ? null
            : html`
                <cp-text-field
                  name="username-rp"
                  label=${this._t('username')}
                  required
                ></cp-text-field>
                <cp-password-field
                  name="newPassword"
                  label=${this._t('password')}
                  required
                ></cp-password-field>
                <cp-password-field
                  name="newPasswordRepeat"
                  label=${this._t('newPasswordRepeat')}
                  required
                ></cp-password-field>
                <cp-text-field
                  name="securityCode-rp"
                  label=${this._t('securityCode')}
                  required
                ></cp-text-field>
              `}`;
    }
  }

  _renderFooter() {
    return html`
      <div class="footer-start">
        <slot name="footer-start"></slot>
      </div>
      <div class="footer-main">
        <slot name="footer"></slot>
      </div>
      <div class="footer-end">
        <slot name="footer-end"></slot>
      </div>
    `;
  }

  private _renderSubmitButtonText() {
    if (!this._isLoading) {
      switch (this._view) {
        case 'login':
          return this._t('loginSubmitText');

        case 'registration':
          return this._t('registrationSubmitText');

        case 'forgotPassword':
          return this._t('forgotPasswordSubmitText');

        case 'resetPassword':
          return this._t('resetPasswordSubmitText');
      }
    } else {
      switch (this._view) {
        case 'login':
          return this._t('processingLoginSubmit');

        case 'forgotPassword':
          return this._t('processingForgotPasswordSubmit');

        case 'resetPassword':
          return this._t('processingResetPasswordSubmit');

        case 'registration':
          return this._t('processingRegistrationSubmit');
      }
    }
  }

  private _renderLinks() {
    switch (this._view) {
      case 'login':
        return html`
          ${this._renderForgotPasswordLink()}
          ${this._renderGoToRegistrationLink()}
        `;

      case 'registration':
        return this._renderGoToLoginLink();

      case 'forgotPassword':
        return this._renderGoToLoginLink();

      case 'resetPassword':
        return this._renderGoToLoginLink();
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
      : '';
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
    `;
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
      : '';
  }
}
