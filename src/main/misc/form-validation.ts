import { I18nFacade } from '../i18n/i18n';

// === exports =======================================================

export { FieldCheckers, FieldValidator };

// === public types ==================================================

namespace FieldValidator {
  export type Checker = (
    value: unknown,
    translate: TranslationFunc
  ) => string | null;
}

// === local types ===================================================

type FirstArgument<T> = T extends (firstArg: infer A, ...rest: any[]) => any
  ? A
  : never;

type TranslationFunc = <
  C extends keyof Localize.Translations,
  K extends keyof Localize.Translations[C]
>(
  category: C,
  termKey: K,
  params?: FirstArgument<Localize.Translations[C][K]>
) => string;

// === local constants ===============================================

const regexEmail =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

// === locals ========================================================

// === public functions ==============================================

class FieldValidator<T> {
  #getValue: () => T;
  #getLocale: () => string;
  #checkers: FieldValidator.Checker[];
  #currLocale = '';
  #translate = new I18nFacade(() => this.#currLocale).translate();

  constructor(
    getValue: () => T,
    getLocale: () => string,
    checkers: FieldValidator.Checker[]
  ) {
    this.#getValue = getValue;
    this.#getLocale = getLocale;
    this.#checkers = checkers;
  }

  validate(): string {
    const value = this.#getValue();
    this.#currLocale = this.#getLocale();

    for (const checker of this.#checkers) {
      const errorMsg = checker(value, this.#translate);

      if (errorMsg !== null) {
        return errorMsg;
      }
    }

    return '';
  }
}

const FieldCheckers = {
  required: createCheckerFactory(
    (isSatisfied?: (value: unknown) => boolean) => (value, t) => {
      let valid = isSatisfied ? !!isSatisfied(value) : !!value;

      return valid ? null : t('jsCockpit.formValidation', 'fieldRequired');
    }
  ),

  email: createCheckerFactory(() => (value, t) => {
    let valid = typeof value === 'string' && regexEmail.test(value);

    return valid ? null : t('jsCockpit.formValidation', 'emailInvalid');
  })
};

// === local functions ===============================================

function createCheckerFactory<
  F extends (...args: any[]) => FieldValidator.Checker
>(fn: F): F {
  return fn;
}
