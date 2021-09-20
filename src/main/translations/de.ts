import { I18n } from '../misc/i18n'

export default {
  'js-cockpit': {
    dialogs: {
      ok: 'OK',
      cancel: 'Abbrechen',
      information: 'Information',
      warning: 'Warnung',
      error: 'Fehler',
      input: 'Eingabe',
      confirmation: 'Bestätigung',
      approval: 'Zustimmung'
    },

    'c-login-form': {
      'login-intro-headline': 'Anmeldung',
      'login-intro-text':
        'Herzlich willkommen! Bitte geben Sie Ihre Anmeldedaten ein.',

      username: 'Benutzername',
      password: 'Passwort',
      'remember-login': 'Angemeldet bleiben',
      'log-in': 'Anmelden'
    },

    'c-data-explorer': {
      'loading-message': 'Lade Daten...'
    },

    'c-pagination-bar': {
      'items-x-to-y-of-z'(x: number, y: number, z: number) {
        const i18n = I18n.getFacade('de')

        return `${i18n.formatNumber(x)} - ${i18n.formatNumber(
          y
        )} / ${i18n.formatNumber(z)}`
      },

      'item-x-of-y'(x: number, y: number) {
        const i18n = I18n.getFacade('de')

        return `${i18n.formatNumber(x)} - ${i18n.formatNumber(y)}`
      },

      'of-x-pages'(x: number) {
        const i18n = I18n.getFacade('de')

        return `von ${i18n.formatNumber(x)}`
      },

      page: 'Seite',
      'page-size': 'Datensätze/Seite'
    }
  }
}
