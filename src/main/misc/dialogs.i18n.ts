import type { Translations } from '../i18n/i18n'

type Terms = Translations<{
  'jsCockpit.dialogs': {
    ok: string
    cancel: string
    information: string
    warning: string
    error: string
    input: string
    confirmation: string
    approval: string
  }
}>

declare global {
  namespace Localize {
    interface Translations extends Terms {}
  }
}
