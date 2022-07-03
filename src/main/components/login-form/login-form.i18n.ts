import type { TermsDefinition } from '../../i18n/i18n'

type Terms = TermsDefinition<{
  email: string
  firstName: string
  lastName: string
  failedLoginSubmit: string
  failedForgotPasswordSubmit: string
  failedResetPasswordSubmit: string
  failedRegistrationSubmit: string
  forgotPassword: string
  forgotPasswordIntroHeadline: string
  forgotPasswordIntroText: string
  forgotPasswordSubmitText: string
  goToLogin: string
  goToRegistration: string
  loginIntroHeadline: string
  loginIntroText: string
  loginSubmitText: string
  newPassword: string
  newPasswordRepeat: string
  password: string
  processingLoginSubmit: string
  processingForgotPasswordSubmit: string
  processingResetPasswordSubmit: string
  processingRegistrationSubmit: string
  registrationIntroHeadline: string
  registrationIntroText: string
  registrationSubmitText: string
  rememberLogin: string
  resetPasswordIntroHeadline: string
  resetPasswordIntroText: string
  resetPasswordSubmitText: string
  securityCode: string
  successfulLoginSubmit: string
  successfulForgotPasswordSubmit: string
  successfulResetPasswordSubmit: string
  successfulRegistrationSubmit: string
  username: string
}>

declare global {
  namespace Localize {
    interface Translations {
      'jsCockpit.loginForm': Terms
    }
  }
}
