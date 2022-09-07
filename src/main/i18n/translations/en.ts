import { addToDict, FullTranslations } from '../i18n';

const translations: FullTranslations<'jsCockpit'> = {
  en: {
    'jsCockpit.dialogs': {
      ok: 'OK',
      cancel: 'Cancel',
      information: 'Information',
      warning: 'Warning',
      error: 'Error',
      input: 'Input',
      confirmation: 'Confirmation',
      approval: 'Approval'
    },

    'jsCockpit.loginForm': {
      email: 'Email',
      firstName: 'First name',
      lastName: 'Last name',
      failedLoginSubmit: 'You could not be logged in',
      failedForgotPasswordSubmit: 'Data could not be submitted',
      failedResetPasswordSubmit: 'Data could not be submitted',
      failedRegistrationSubmit: 'Data could not be submitted',
      forgotPassword: 'Forgot password?',
      forgotPasswordIntroHeadline: 'Forgot password?',

      forgotPasswordIntroText:
        "Please fill out and submit the form and you'll receive an e-mail with further instructions how to reset your password",

      forgotPasswordSubmitText: 'Request password reset',
      goToLogin: 'Go to login form',
      goToRegistration: 'Need account?',
      loginIntroHeadline: 'Login',
      loginIntroText: 'Please enter your credentials in the form to log in',
      loginSubmitText: 'Log in',
      newPassword: 'New password',
      newPasswordRepeat: 'Repeat new password',
      password: 'Password',
      processingLoginSubmit: 'Logging in...',
      processingForgotPasswordSubmit: 'Submitting...',
      processingResetPasswordSubmit: 'Submitting...',
      processingRegistrationSubmit: 'Submitting...',
      registrationIntroHeadline: 'Registration',

      registrationIntroText:
        'Please fill out the form and press the submit button to register',

      registrationSubmitText: 'Register',
      rememberLogin: 'Remember login',
      resetPasswordIntroHeadline: 'Reset password',

      resetPasswordIntroText:
        'Please fill out and submit the form to reset your password',

      resetPasswordSubmitText: 'Reset password',
      securityCode: 'Security code',
      successfulLoginSubmit: 'You have been successfully logged in',
      successfulForgotPasswordSubmit: 'Data have been submitted successfully',
      successfulResetPasswordSubmit: 'Data have been submitted successfully',
      successfulRegistrationSubmit: 'Data have been submitted successfully',
      username: 'Username'
    },

    'jsCockpit.dataExplorer': {
      loadingMessage: 'Loading...'
    },

    'jsCockpit.paginationBar': {
      itemsXToYOfZ({ firstItemNo, lastItemNo, itemCount }, i18n) {
        const formattedFirstItemNo = i18n.formatNumber(firstItemNo);
        const formattedLastItemNo = i18n.formatNumber(lastItemNo);
        const formattedItemCount = i18n.formatNumber(itemCount);

        return `${formattedFirstItemNo} - ${formattedLastItemNo} / ${formattedItemCount}`;
      },

      itemXOfY({ itemNo, itemCount }, i18n) {
        const formattedItemNo = i18n.formatNumber(itemNo);
        const formattedItemCount = i18n.formatNumber(itemCount);

        return `${formattedItemNo} / ${formattedItemCount}`;
      },

      ofXPages({ pageCount }, i18n) {
        const formattedPageCount = i18n.formatNumber(pageCount);

        return `of ${formattedPageCount}`;
      },

      page: 'Page',
      pageSize: 'Items/Page'
    },

    'jsCockpit.sideMenu': {},

    'jsCockpit.validation': {
      fieldRequired: 'Please fill out this field',
      emailInvalid: 'Please enter a valid email address',

      formInvalid:
        'Form contains invalid data. ' +
        'Please correct the invalid entries before continuing.'
    },

    'jsCockpit.userMenu': {
      anonymous: 'Anonymous',
      logOut: 'Log out'
    }
  }
};

addToDict(translations);
