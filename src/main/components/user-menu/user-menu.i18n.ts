import type { Translations } from '../../i18n/i18n'

type Terms = Translations<{
  'jsCockpit.userMenu': {
    anonymous: string
    logOut: string
  }
}>

declare global {
  namespace Localize {
    interface Translations extends Terms {}
  }
}
