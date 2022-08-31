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
import { MessageBar } from '../message-bar/message-bar';
import { Form } from '../form/form';
import { PasswordField } from '../password-field/password-field';
import { TextField } from '../text-field/text-field';

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
        <div>${this._renderHeader()}</div>
        <div>${this._renderMain()}</div>
      </div>
    `;
  }

  private _renderHeader() {
    return html`
      <div class="header">
        <div>Header</div>
      </div>
    `;
  }

  private _renderMain() {
    return html`
      <div class="main">
        <div>${this._renderColumnA()}</div>
        <div>${this._renderColumnB()}</div>
      </div>
    `;
  }

  private _renderColumnA() {
    return html`<div class="column-a">leftColumn</div>`;
  }

  private _renderColumnB() {
    return html`<div class="column-b">rightColumn</div>`;
  }
}
