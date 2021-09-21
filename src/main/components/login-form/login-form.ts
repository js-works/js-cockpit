import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { classMap, html, lit } from 'js-element/lit'
import { Theme } from '../../misc/themes'
import { useI18n } from '../../utils/hooks'
import { I18n } from '../../misc/i18n'

// custom elements
import SlButton from '@shoelace-style/shoelace/dist/components/button/button'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox'
import SlForm from '@shoelace-style/shoelace/dist/components/form/form'
import { TextField } from '../text-field/text-field'
import { PasswordField } from '../password-field/password-field'
import { FormCtrlProvider } from '../form-ctrl-provider/form-ctrl-provider'
import { FormCtrl } from '../../ctrls/form-ctrl'
import { ThemeProvider } from '../theme-provider/theme-provider'
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
    'username': 'Username',
    'password': 'Password',
    'remember-login': 'Remember login',
    'log-in': 'Log in'
  }
})

@elem({
  tag: 'c-login-form',
  styles: [loginFormStyles, topAlignedLabelsStyles],
  impl: lit(loginFormImpl),
  uses: [
    FormCtrlProvider,
    PasswordField,
    TextField,
    ThemeProvider,
    SlButton,
    SlCheckbox,
    SlIcon,
    SlForm
  ]
})
class LoginForm extends component() {
  @prop({ attr: Attrs.boolean })
  fullSize = false

  @prop
  theme?: Theme
}

function loginFormImpl(self: LoginForm) {
  const { t } = useI18n('js-cockpit.login-form')

  const formCtrl: FormCtrl = {
    submit() {
      alert('submit')
    },

    subscribeField: () => () => {}
  }

  const onSubmitClick = () => {
    formCtrl.submit(() => alert('handler'))
  }

  return () => html`
    <c-theme-provider .theme=${self.theme}>
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
            <form-ctrl-provider class="column2" .value=${formCtrl}>
              <div class="column2-top">
                <slot name="login-fields">
                  <c-text-field label=${t('username')} required></c-text-field>
                  <c-password-field
                    label=${t('password')}
                    required
                  ></c-password-field>
                </slot>
              </div>
              <div class="column2-bottom">
                <sl-checkbox>${t('remember-login')}</sl-checkbox>
                <sl-button
                  type="primary"
                  class="login-button"
                  submit
                  @click=${onSubmitClick}
                  >${t('log-in')}</sl-button
                >
              </div>
            </c-form-ctrl-provider>
          </div>
          <div class="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </c-theme-provider>
  `
}
