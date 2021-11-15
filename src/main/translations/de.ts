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
    'forgot-password-intro-text': "Bitte füllen Sie das Formular aus um per E-Mail Anweisungen zu erhalten, wie Sie Ihr Passwort zurücksetzen können",
    'forgot-password-submit-text': 'Passwort zurücksetzen',
    'go-to-login': 'Gehe zum Login',
    'login-intro-headline': 'Login',
    'login-intro-text': 'Um sich anzumelden geben Sie bitte Ihre Zugangsdaten an',
    'login-submit-text': 'Anmelden',
    'new-password': 'Neues Passwort',
    'new-password-repeat': 'Wiederhole Passwort',
    'password': 'Passwort',
    'register-intro-headline': 'Registrierung',
    'register-intro-text': 'Please fill out the form and press the submit button to register',
    'register-submit-text': 'Register',
    'remember-login': 'Remember login',
    'reset-password-intro-headline': 'Reset password',
    'reset-password-intro-text': 'Please fill out and submit the form to reset your password',
    'reset-password-submit-text': 'Reset password',
    'security-code': 'Security code',
    'username': 'Username',
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
