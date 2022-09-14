import type { Translations } from '../../i18n/i18n';

type Terms = Translations<{
  'jsCockpit.datePicker': {
    cancel: string;
    clear: string;
    ok: string;
  };
}>;

declare global {
  namespace Localize {
    interface Translations extends Terms {}
  }
}
