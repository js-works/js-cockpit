import { Localizer, Translation } from './localize/localize'

type I18n = Localizer<CockpitTranslation>

const x: I18n = null as any
x.translate('jsCockpit.dataExplorer', 'loadingMessage')

export { CockpitTranslation }

const xx = {
  'jsCockpit.dialogs': {
    ok: 'string',
    cancel: 'string'
  }
}

type X = {
  a: number
}

type CockpitTranslation = {
  'jsCockpit.dialogs': {
    ok: string
    cancel: string
    information: string
    warning: string
    error: string
    input: string
    confirmation: string
    approval: string
  }

  'jsCockpit.loginForm': {
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
  }

  'jsCockpit.dataExplorer': {
    loadingMessage: string
  }

  'jsCockpit.paginationBar': {
    itemsXToYOfZ(
      params: { firstItemNo: number; lastItemNo: number; itemCount: number },
      i18n: I18n
    ): string

    itemXOfY(params: { itemNo: number; itemCount: number }, i18n: I18n): string

    ofXPages( //
      params: { pageCount: number },
      i18n: I18n
    ): string

    page: string
    pageSize: string
  }

  'jsCockpit.sideMenu': {}

  'jsCockpit.validation': {
    fieldRequired: string
    formInvalid: string
  }

  'jsCockpit.userMenu': {
    anonymous: string
    logOut: string
  }
}
