import { I18n } from '../misc/i18n'

const { formatNumber } = I18n.localize('de')

// prettier-ignore
I18n.addTranslations('de', {
  'js-cockpit': {
    'dialogs': {
      'ok': 'OK',
      'cancel': 'Abbrechen',
      'information': 'Information',
      'warning': 'Warnung',
      'error': 'Fehler',
      'input': 'Eingabe',
      'confirmation': 'Bestätigung',
      'approval': 'Zustimmung'
    },

  'login-form': {
    'email': 'E-mail',
    'first-name': 'Vorname',
    'last-name': 'Nachname',
    'forgot-password': 'Passwort vergessen?',
    'forgot-password-intro-headline': 'Passwort vergessen?',
    'forgot-password-intro-text': "Sie werden per E-Mail Anweisungen zu erhalten, wie Sie Ihr Passwort zurücksetzen können",
    'forgot-password-submit-text': 'Passwort zurücksetzen',
    'go-to-login': 'Gehe zur Anmeldung',
    'go-to-registration': 'Nicht registriert?',
    'login-intro-headline': 'Anmeldung',
    'login-intro-text': 'Bitte geben Sie zum Einloggen Ihre Zugangsdaten an',
    'login-submit-text': 'Anmelden',
    'new-password': 'Neues Passwort',
    'new-password-repeat': 'Wiederhole Passwort',
    'password': 'Passwort',
    'registration-intro-headline': 'Registrierung',
    'registration-intro-text': 'Bitte füllen Sie zur Registrierung das Formular aus',
    'registration-submit-text': 'Registrieren',
    'remember-login': 'Angemeldet bleiben',
    'reset-password-intro-headline': 'Passwort zurücksetzen',
    'reset-password-intro-text': 'Bitte füllen Sie für die Rücksetzung des Passworts das Formular aus',
    'reset-password-submit-text': 'Passwort zurücksetzen',
    'security-code': 'Sicherheitscode',
    'username': 'Benutzername',
    },

    'data-explorer': {
      'loading-message': 'Lade Daten...'
    },

    'pagination-bar': {
      'items-x-to-y-of-z': (params: {
        firstItemNo: number,
        lastItemNo: number, 
        itemCount: number
      }) =>
        `${formatNumber(params.firstItemNo)} - ${formatNumber(params.lastItemNo)} / ${formatNumber(params.itemCount)}`,

      'item-x-of-y': (params: {
        itemNo: number,
        itemCount: number
      }) =>
        `${formatNumber(params.itemNo)} - ${formatNumber(params.itemCount)}`,

      'of-x-pages': (params: {
        pageCount: number
      }) => `von ${formatNumber(params.pageCount)}`,

      'page': 'Seite',
      'page-size': 'Datensätze/Seite'
    }
  }
})
