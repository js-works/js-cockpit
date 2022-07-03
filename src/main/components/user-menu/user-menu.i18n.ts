import type { TermsDefinition } from '../../i18n/i18n'

type Terms = TermsDefinition<{
  anonymous: string
  logOut: string
}>

declare global {
  namespace Localize {
    interface Translations {
      'jsCockpit.userMenu': Terms
    }
  }
}
