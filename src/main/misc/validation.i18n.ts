import type { TermsDefinition } from '../i18n/i18n'

type Terms = TermsDefinition<{
  fieldRequired: string
  formInvalid: string
}>

declare global {
  namespace Localize {
    interface Translations {
      'jsCockpit.validation': Terms
    }
  }
}
