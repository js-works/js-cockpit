import type { Translations } from '../i18n/i18n';

type Terms = Translations<{
  'jsCockpit.formValidation': {
    fieldRequired: string;
    emailInvalid: string;
    formInvalid: string;
  };
}>;

declare global {
  namespace Localize {
    interface Translations extends Terms {}
  }
}
