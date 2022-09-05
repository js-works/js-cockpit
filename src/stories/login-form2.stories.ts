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
  render() {
    return html`
      <cp-theme-provider .theme=${sharedTheme}>
        <cp-login-form2>
          <div slot="header">
            <b style="color: var(--sl-color-primary-600)">My Company</b>
            &nbsp;Back Office
          </div>
          <div slot="header-end">&copy; 2022, My Company</div>
        </cp-login-form2>
      </cp-theme-provider>
    `;
  }
}
