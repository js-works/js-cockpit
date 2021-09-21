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
      'login-intro-headline': 'Anmeldung',

      'login-intro-text':
        'Herzlich willkommen! Bitte geben Sie Ihre Anmeldedaten ein.',

      'username': 'Benutzername',
      'password': 'Passwort',
      'remember-login': 'Angemeldet bleiben',
      'log-in': 'Anmelden'
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
