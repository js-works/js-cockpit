import type { Translations } from '../../i18n/i18n';

type Terms = Translations<{
  'jsCockpit.loginForm': {
    email: string;
    firstName: string;
    lastName: string;
    failedLoginSubmit: string;
    failedForgotPasswordSubmit: string;
    failedResetPasswordSubmit: string;
    failedRegistrationSubmit: string;
    forgotPassword: string;
    forgotPasswordHeadline: string;
    forgotPasswordText: string;
    forgotPasswordSubmitText: string;
    goToLogin: string;
    goToRegistration: string;
    loginHeadline: string;
    loginText: string;
    loginSubmitText: string;
    newPassword: string;
    newPasswordRepeat: string;
    password: string;
    processingLoginSubmit: string;
    processingForgotPasswordSubmit: string;
    processingResetPasswordSubmit: string;
    processingRegistrationSubmit: string;
    registrationHeadline: string;
    registrationText: string;
    registrationSubmitText: string;
    rememberLogin: string;
    resetPasswordHeadline: string;
    resetPasswordText: string;
    resetPasswordSubmitText: string;
    securityCode: string;
    successfulLoginSubmit: string;
    successfulForgotPasswordSubmit: string;
    successfulResetPasswordSubmit: string;
    successfulRegistrationSubmit: string;
    username: string;
  };
}>;

declare global {
  namespace Localize {
    interface Translations extends Terms {}
  }
}
