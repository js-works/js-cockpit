import type { Translations } from '../i18n/i18n'

type Terms = Translations<{
  'jsCockpit.validation': {
    fieldRequired: string
    formInvalid: string
  }
}>

declare global {
  namespace Localize {
    interface Translations extends Terms {}
  }
}
