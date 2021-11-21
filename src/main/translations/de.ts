import { I18n } from '../i18n/i18n'

const { formatNumber } = I18n.localize('de')

I18n.registerTranslations(
  I18n.defineTranslations({
    category: 'jsCockpit.dialogs',
    language: 'de',

    terms: {
      ok: 'OK',
      cancel: 'Abbrechen',
      information: 'Information',
      warning: 'Warnung',
      error: 'Fehler',
      input: 'Eingabe',
      confirmation: 'Bestätigung',
      approval: 'Zustimmung'
    }
  })
)

I18n.registerTranslations(
  I18n.defineTranslations({
    category: 'jsCockpit.loginForm',
    language: 'de',

    terms: {
      email: 'E-mail',
      firstName: 'Vorname',
      lastName: 'Nachname',
      forgotPassword: 'Passwort vergessen?',
      forgotPasswordIntroHeadline: 'Passwort vergessen?',
      forgotPasswordIntroText:
        'Sie werden per E-Mail Anweisungen zu erhalten, wie Sie Ihr Passwort zurücksetzen können',
      forgotPasswordSubmitText: 'Passwort zurücksetzen',
      goToLogin: 'Gehe zur Anmeldung',
      goToRegistration: 'Nicht registriert?',
      loginIntroHeadline: 'Anmeldung',
      loginIntroText: 'Bitte geben Sie zum Einloggen Ihre Zugangsdaten an',
      loginSubmitText: 'Anmelden',
      newPassword: 'Neues Passwort',
      'newPassword-repeat': 'Wiederhole Passwort',
      password: 'Passwort',
      registrationIntroHeadline: 'Registrierung',
      registrationIntroText:
        'Bitte füllen Sie zur Registrierung das Formular aus',
      registrationSubmitText: 'Registrieren',
      rememberLogin: 'Angemeldet bleiben',
      resetPasswordIntroHeadline: 'Passwort zurücksetzen',
      resetPasswordIntroText:
        'Bitte füllen Sie für die Rücksetzung des Passworts das Formular aus',
      resetPasswordSubmitText: 'Passwort zurücksetzen',
      securityCode: 'Sicherheitscode',
      username: 'Benutzername'
    }
  })
)

I18n.registerTranslations(
  I18n.defineTranslations({
    category: 'jsCockpit.dataExplorer',
    language: 'de',

    terms: {
      loadingMessage: 'Lade Daten...'
    }
  })
)

I18n.registerTranslations(
  I18n.defineTranslations({
    category: 'jsCockpit.paginationBar',
    language: 'de',

    terms: {
      itemsXToYOfZ: (params: {
        firstItemNo: number
        lastItemNo: number
        itemCount: number
      }) =>
        `${formatNumber(params.firstItemNo)} - ${formatNumber(
          params.lastItemNo
        )} / ${formatNumber(params.itemCount)}`,

      itemXOfY: (params: { itemNo: number; itemCount: number }) =>
        `${formatNumber(params.itemNo)} - ${formatNumber(params.itemCount)}`,

      ofXPages: (params: { pageCount: number }) =>
        `von ${formatNumber(params.pageCount)}`,

      page: 'Seite',
      pageSize: 'Datensätze/Seite'
    }
  })
)
