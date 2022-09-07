import { bind, elem, Component } from '../main/utils/components';
import { html } from '../main/utils/lit';
import { h } from '../main/utils/dom';
import { sharedTheme } from './shared/shared-theme';

import {
  Brand,
  DateField,
  EmailField,
  LoginForm,
  PasswordField,
  TextField,
  ThemeProvider
} from 'js-cockpit';

export default {
  title: 'login-form2'
};

export const loginForm = () => h('login-form2-demo');

@elem({
  tag: 'login-form2-demo',
  uses: [
    Brand,
    DateField,
    EmailField,
    LoginForm,
    TextField,
    PasswordField,
    ThemeProvider
  ]
})
class LoginFormDemo extends Component {
  private _processSubmit = async (data: any) => {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 10000);
    });

    alert(JSON.stringify(data, null, 2));
  };

  render() {
    return html`
      <cp-theme-provider .theme=${sharedTheme}>
        <cp-login-form2
          full-size
          enable-registration
          enable-forgot-password
          .processSubmit=${this._processSubmit}
        >
          <cp-brand
            slot="header"
            size="small"
            headline="My Company"
            text="Back Office"
            multi-color
            flat
          ></cp-brand>
          <cp-brand
            slot="form-fields-start"
            size="huge"
            headline="My Company"
            text="Back Office"
            logo="default"
            multi-color
          ></cp-brand>
          <div slot="footer">&copy; 2022, My Company - All rights reserved</div>
        </cp-login-form2>
      </cp-theme-provider>
    `;
  }
}
