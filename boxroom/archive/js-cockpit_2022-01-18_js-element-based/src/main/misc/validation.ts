import { addToDict, TermsOf } from 'js-localize'

// === translations ===================================================

declare global {
  namespace Localize {
    interface TranslationsMap {
      'jsCockpit.validation': TermsOf<typeof translations>
    }
  }
}

const translations = {
  en: {
    'jsCockpit.validation': {
      fieldRequired: 'The field is required',
      formInvalid: 'Form contains invalid entries'
    }
  }
}

addToDict(translations)
