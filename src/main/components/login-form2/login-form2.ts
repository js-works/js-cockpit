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
} from '../../utils/components';

import { classMap, createRef, html, ref, repeat } from '../../utils/lit';
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

// icons
import loginIntroIcon from './assets/login.svg';
import forgotPasswordIntroIcon from './assets/forgot-password.svg';
import registrationIntroIcon from './assets/registration.svg';
import resetPasswordIntroIcon from './assets/reset-password.svg';

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
  @prop({ attr: Attrs.string })
  initialView?: LoginForm.View;

  @prop({ attr: Attrs.boolean })
  enableRememberLogin = false;

  @prop({ attr: Attrs.boolean })
  enableForgotPassword = false;

  @prop({ attr: Attrs.boolean })
  enableRegistration = false;

  @prop({ attr: Attrs.boolean })
  fullSize = false;

  @prop
  processSubmit?: (
    data: LoginForm.SubmitData
  ) => Promise<string | undefined | null>;

  @state
  private _view: LoginForm.View = 'login';

  render() {
    return html`
      <div class="base">
        ${this._renderHeader()}
        <div class="main-content">
          <div class="column-a">${this._renderColumnA()}</div>
          <div class="column-b">${this._renderColumnB()}</div>
        </div>
      </div>
    `;
  }

  private _renderHeader() {
    return html`
      <div class="header">
        <div>
          <b style="color: var(--sl-color-primary-600)">My Company</b>
          &nbsp;Back Office
        </div>
      </div>
    `;
  }

  private _renderColumnA() {
    return html`
      <div class="intro">
        <h3 class="intro-headline">Login</h3>
        <div class="intro-text">
          Please enter your credentials in the form to log in.
        </div>
      </div>
    `;
  }

  private _renderColumnB() {
    return html`
      <div class="form">
        <cp-text-field size="large" label="Username"></cp-text-field>
        <cp-password-field size="large" label="Password"></cp-password-field>
        <div></div>
        <sl-button class="submit-button" variant="primary" size="large"
          >Log in</sl-button
        >
      </div>
    `;
  }
}
