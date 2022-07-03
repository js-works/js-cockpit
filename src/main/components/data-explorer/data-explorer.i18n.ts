import type { TermsDefinition } from '../../i18n/i18n'

type Terms = TermsDefinition<{
  loadingMessage: string
}>

declare global {
  namespace Localize {
    interface Translations {
      'jsCockpit.dataExplorer': Terms
    }
  }
}
