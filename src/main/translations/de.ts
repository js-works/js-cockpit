import { addToDict, localize, FullTranslations } from 'js-localize'

const { formatNumber } = localize('de')

const translations: FullTranslations<'jsCockpit.*'> = {
  de: {
    'jsCockpit.dialogs': {
      ok: 'OK',
      cancel: 'Abbrechen',
      information: 'Information',
      warning: 'Warnung',
      error: 'Fehler',
      input: 'Eingabe',
      confirmation: 'Bestätigung',
      approval: 'Zustimmung'
    },

    'jsCockpit.loginForm': {
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
      newPasswordRepeat: 'Wiederhole Passwort',
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
    },

    'jsCockpit.dataExplorer': {
      loadingMessage: 'Lade Daten...'
    },

    'jsCockpit.paginationBar': {
      itemsXToYOfZ(params) {
        const firstItemNo = formatNumber(params.firstItemNo)
        const lastItemNo = formatNumber(params.lastItemNo)
        const itemCount = formatNumber(params.itemCount)

        return `${firstItemNo} - ${lastItemNo} / ${itemCount}`
      },

      itemXOfY(params) {
        const itemNo = formatNumber(params.itemNo)
        const itemCount = formatNumber(params.itemCount)

        return `${itemNo} - ${itemCount}`
      },

      ofXPages(params) {
        const pageCount = formatNumber(params.pageCount)

        return `von ${pageCount}`
      },

      page: 'Seite',
      pageSize: 'Datensätze/Seite'
    }
  }
}

addToDict(translations)
