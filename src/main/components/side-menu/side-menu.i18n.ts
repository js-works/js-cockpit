import type { TermsDefinition } from '../../i18n/i18n'

type Terms = TermsDefinition<{}>

declare global {
  namespace Localize {
    interface Translations {
      'jsCockpit.sideMenu': Terms
    }
  }
}
