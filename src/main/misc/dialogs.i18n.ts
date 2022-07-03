import type { I18nFacade, TermsDefinition } from '../i18n/i18n'

type Terms = TermsDefinition<{
  ok: string
  cancel: string
  information: string
  warning: string
  error: string
  input: string
  confirmation: string
  approval: string
}>

declare global {
  namespace Localize {
    interface Translations {
      'jsCockpit.dialogs': Terms
    }
  }
}
