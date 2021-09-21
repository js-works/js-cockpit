import { I18n } from '../misc/i18n'

const { formatNumber } = I18n.getFacade('de')

// prettier-ignore
I18n.addTexts('de', {
  'js-cockpit': {
    dialogs: {
      'ok': 'OK',
      'cancel': 'Abbrechen',
      'information': 'Information',
      'warning': 'Warnung',
      'error': 'Fehler',
      'input': 'Eingabe',
      'confirmation': 'Bestätigung',
      'approval': 'Zustimmung'
    },

    'c-login-form': {
      'login-intro-headline': 'Anmeldung',
      'login-intro-text':
        'Herzlich willkommen! Bitte geben Sie Ihre Anmeldedaten ein.',

      'username': 'Benutzername',
      'password': 'Passwort',
      'remember-login': 'Angemeldet bleiben',
      'log-in': 'Anmelden'
    },

    'c-data-explorer': {
      'loading-message': 'Lade Daten...'
    },

    'c-pagination-bar': {
      'items-x-to-y-of-z'(x: number, y: number, z: number) {
        return `${formatNumber(x)} - ${formatNumber(y)} / ${formatNumber(z)}`
      },

      'item-x-of-y'(x: number, y: number) {
        return `${formatNumber(x)} - ${formatNumber(y)}`
      },

      'of-x-pages'(x: number) {
        return `von ${formatNumber(x)}`
      },

      'page': 'Seite',
      'page-size': 'Datensätze/Seite'
    }
  }
})
