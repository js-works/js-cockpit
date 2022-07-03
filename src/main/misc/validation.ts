import { addToDict, defineTerms, TermsOf } from '../i18n/i18n'

// === translations ==================================================

declare global {
  namespace Localize {
    interface Translations extends TermsOf<typeof translations> {}
  }
}

const translations = defineTerms({
  en: {
    'jsCockpit.validation': {
      fieldRequired: 'Required field',
      formInvalid: 'The form data has invalid form values'
    }
  }
})

addToDict(translations)
