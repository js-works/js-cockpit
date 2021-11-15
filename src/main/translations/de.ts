import { I18n } from '../misc/i18n'

const { formatNumber } = I18n.localizer('de')

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
    'go-to-registration': 'Kein Account?',
    'login-intro-headline': 'Anmeldung',
    'login-intro-text': 'Bitte geben Sie zum Einloggen Ihre Zugangsdaten an',
    'login-submit-text': 'Anmelden',
    'new-password': 'Neues Passwort',
    'new-password-repeat': 'Wiederhole Passwort',
    'password': 'Passwort',
    'register-intro-headline': 'Registrierung',
    'register-intro-text': 'Bitte füllen Sie zur Registrierung das Formular aus',
    'register-submit-text': 'Registrieren',
    'remember-login': 'Angemeldet bleiben',
    'reset-password-intro-headline': 'Passwort zurücksetzen',
    'reset-password-intro-text': 'Bitte füllen Sie für die Rücksetzung des Passworts',
    'reset-password-submit-text': 'Passwort zurücksetzen',
    'security-code': 'Sicherheitscode',
    'username': 'Benutzername',
    },

    'data-explorer': {
      'loading-message': 'Lade Daten...'
    },

    'pagination-bar': {
      'items-x-to-y-of-z': (x: number, y: number, z: number) =>
        `${formatNumber(x)} - ${formatNumber(y)} / ${formatNumber(z)}`,

      'item-x-of-y': (x: number, y: number) =>
        `${formatNumber(x)} - ${formatNumber(y)}`,

      'of-x-pages': (x: number) => `von ${formatNumber(x)}`,
      'page': 'Seite',
      'page-size': 'Datensätze/Seite'
    }
  }
})
