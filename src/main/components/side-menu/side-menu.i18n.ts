import type { Translations } from '../../i18n/i18n'

type Terms = Translations<{
  'jsCockpit.sideMenu': {}
}>

declare global {
  namespace Localize {
    interface Translations extends Terms {}
  }
}
