import type { ReactiveController, ReactiveControllerHost } from 'lit';

import {
  registerTranslation,
  LocalizeController
} from '@shoelace-style/localize';

// === exports =======================================================

export { addToDict, I18nFacade, I18nController };

export type {
  DateFormat,
  DayNameFormat,
  FullTranslations,
  MonthNameFormat,
  Localizer,
  NumberFormat,
  PartialTranslations,
  RelativeTimeFormat,
  RelativeTimeUnit,
  Translations
};

// === exported types ================================================

declare global {
  namespace Localize {
    interface Translations {}
  }
}

type FullTranslations<B extends string> = {
  [L: string]: {
    [C in keyof Localize.Translations &
      `${B}.${string}`]: Localize.Translations[C];
  };
};

type PartialTranslations<B extends string> = {
  [L: string]: {
    [C in keyof Localize.Translations & `${B}.${string}`]?: Partial<
      Localize.Translations[C]
    >;
  };
};

interface Localizer {
  getLocale(): Locale;
  getDirection(): Direction;

  translate<U extends Translations>(): <
    C extends keyof U,
    K extends keyof U[C]
  >(
    category: C,
    termKey: K,
    params?: FirstArgument<U[C][K]>
  ) => string;

  translate<C extends keyof Localize.Translations>(
    category: C
  ): <K extends keyof Localize.Translations[C]>(
    termKey: K,
    params?: FirstArgument<Localize.Translations[C][K]>
  ) => string;

  translate<
    C extends keyof Localize.Translations,
    K extends keyof Localize.Translations[C]
  >(
    category: C,
    termKey: keyof Localize.Translations[C],
    params?: FirstArgument<Localize.Translations[C][K]>
  ): string;

  parseNumber(numberString: string): number | null;
  parseDate(dateString: string): Date | null;
  formatNumber(value: number, format?: NumberFormat): string;
  formatDate(value: Date, format?: DateFormat | null): string;

  formatRelativeTime(
    value: number,
    unit: RelativeTimeUnit,
    format?: RelativeTimeFormat
  ): string;

  getFirstDayOfWeek(): number; // 0 to 6, 0 means Sunday
  getWeekendDays(): Readonly<number[]>; // array of integer form 0 to 6
  getCalendarWeek(date: Date): number; // 1 to 53
  getDayName(index: number, format?: DayNameFormat): string;
  getDayNames(format?: DayNameFormat): string[];
  getMonthName(index: number, format?: MonthNameFormat): string;
  getMonthNames(format?: MonthNameFormat): string[];
}

interface NumberFormat extends Intl.NumberFormatOptions {}
interface DateFormat extends Intl.DateTimeFormatOptions {}
type RelativeTimeFormat = Intl.RelativeTimeFormatOptions;
type RelativeTimeUnit = Intl.RelativeTimeFormatUnit;
type DayNameFormat = 'long' | 'short' | 'narrow';
type MonthNameFormat = 'long' | 'short' | 'narrow';

// === local types ===================================================

type Locale = string;
type Category = string;
type TermKey = string;
type Direction = 'ltr' | 'rtl';
type TermValue = string | ((params: any, i18n: Localizer) => string);

type Translations<
  T extends Record<Category, Record<TermKey, TermValue>> = Record<
    Category,
    Record<TermKey, TermValue>
  >
> = T;

type AllowedTranslations = {
  [L: Locale]: {
    [C in keyof Localize.Translations]?: {
      [K in keyof Localize.Translations[C]]?: Localize.Translations[C][K];
    };
  };
};

type FirstArgument<T> = T extends (firstArg: infer A, ...rest: any[]) => any
  ? A
  : never;

// === constants =====================================================

const regexCategory = /^[a-z][a-zA-Z0-9\.]*$/;
const regexTermKey = /^[a-z][a-zA-Z0-9]*$/;
const categoryTermSeparator = '/';

const defaultFirstDayOfWeek = 1;
const defaultWeekendDays = Object.freeze([0, 6]); // Sunday and Saturday

// === adaption ======================================================

const translate = (() => {
  const fakeElem: HTMLElement & ReactiveControllerHost = Object.assign(
    document.createElement('div'),
    {
      addController() {},
      removeController() {},
      requestUpdate() {},
      updateComplete: Promise.resolve(true)
    }
  );

  const fakeLocalizeController = new LocalizeController(fakeElem);

  return <
    C extends keyof Localize.Translations,
    K extends keyof Localize.Translations[C]
  >(
    locale: Locale,
    category: C & Category,
    termKey: K & TermKey,
    params: FirstArgument<Localize.Translations[C][K]>,
    i18n: Localizer
  ) => {
    const key = `${category}${categoryTermSeparator}${termKey}`; // TODO!!!
    fakeElem.lang = locale;

    return fakeLocalizeController.term(key, params, i18n);
  };
})();

function addToDict(...translationsList: AllowedTranslations[]): void {
  for (const translations of translationsList) {
    for (const locale of Object.keys(translations)) {
      const translation = translations[locale] as Translations;

      const convertedTranslation: any = {
        $code: locale,
        $name: new Intl.DisplayNames(locale, { type: 'language' }).of(locale),
        $dir: getDirection(locale)
      };

      for (const category of Object.keys(translation)) {
        if (!category.match(regexCategory)) {
          throw Error(`Illegal translations category name "${category}"`);
        }

        if (translation[category]) {
          const terms = translation[category];

          for (const termKey of Object.keys(translation[category])) {
            if (!termKey.match(regexTermKey)) {
              throw Error(
                `Illegal ${locale}, ${category} translation key "${termKey}"`
              );
            }
            convertedTranslation[
              `${category}${categoryTermSeparator}${termKey}`
            ] = terms[termKey];
          }
        }
      }

      registerTranslation(convertedTranslation);
    }
  }
}

class BaseLocalizer implements Localizer {
  #getLocale: () => Locale;
  #i18n: Localizer;

  constructor(getLocale: () => Locale) {
    this.#getLocale = getLocale;

    this.#i18n =
      this.constructor === BaseLocalizer ? this : new BaseLocalizer(getLocale);
  }

  getLocale(): Locale {
    return this.#getLocale();
  }

  getDirection(): Direction {
    return getDirection(this.#getLocale());
  }

  translate<U extends Localize.Translations>(): <
    C extends keyof U,
    K extends keyof U[C]
  >(
    category: C,
    termKey: K,
    params?: FirstArgument<U[C][K]>
  ) => string;

  translate<C extends keyof Localize.Translations>(
    category: C
  ): <K extends keyof Localize.Translations[C]>(
    termKey: K,
    params?: FirstArgument<Localize.Translations[C][K]>
  ) => string;

  translate<
    C extends keyof Localize.Translations,
    K extends keyof Localize.Translations[C]
  >(
    category: C,
    termKey: keyof Localize.Translations[C],
    params?: FirstArgument<Localize.Translations[C][K]>
  ): string;

  translate(category?: any, termKey?: any, params?: any): any {
    if (arguments.length === 0) {
      return (category: any, key: any, params: any) =>
        this.translate(category, key, params);
    } else if (arguments.length === 1) {
      return (key: any, params?: any) => this.translate(category, key, params);
    }

    return translate(
      this.#getLocale(),
      category,
      termKey,
      params || null,
      this.#i18n
    );
  }

  parseNumber(numberString: string): number | null {
    return getNumberParser(this.#getLocale())(numberString);
  }

  parseDate(dateString: string): Date | null {
    return getDateParser(this.#getLocale())(dateString);
  }

  formatNumber(value: number, format?: NumberFormat): string {
    return new Intl.NumberFormat(this.#getLocale(), format).format(value);
  }

  formatDate(value: Date, format?: DateFormat): string {
    return new Intl.DateTimeFormat(this.#getLocale(), format).format(value);
  }

  formatRelativeTime(
    value: number,
    unit: RelativeTimeUnit,
    format?: RelativeTimeFormat
  ): string {
    return new Intl.RelativeTimeFormat(this.#getLocale(), format).format(
      value,
      unit
    );
  }

  // 0 to 6, 0 means Sunday
  getFirstDayOfWeek(): number {
    return getFirstDayOfWeek(this.#getLocale());
  }

  // array of integer form 0 to 6
  getWeekendDays(): Readonly<number[]> {
    return getWeekendDays(this.#getLocale());
  }

  // 1 to 53
  getCalendarWeek(date: Date): number {
    return getCalendarWeek(this.#getLocale(), date);
  }

  getDayName(index: number, format: DayNameFormat = 'long'): string {
    const date = new Date(1970, 0, 4 + (index % 7));

    return new Intl.DateTimeFormat(this.#getLocale(), {
      weekday: format
    }).format(date);
  }

  getDayNames(format: DayNameFormat = 'long'): string[] {
    const arr: string[] = [];

    for (let i = 0; i < 7; ++i) {
      arr.push(this.getDayName(i, format));
    }

    return arr;
  }

  getMonthName(index: number, format: MonthNameFormat = 'long'): string {
    const date = new Date(1970, index % 12, 1);

    return new Intl.DateTimeFormat(this.#getLocale(), { month: format }).format(
      date
    );
  }

  getMonthNames(format?: MonthNameFormat): string[] {
    const arr: string[] = [];

    for (let i = 0; i < 12; ++i) {
      arr.push(this.getMonthName(i, format));
    }

    return arr;
  }
}

class I18nFacade extends BaseLocalizer {}

class I18nController extends BaseLocalizer {
  #localizeController: LocalizeController;

  constructor(element: HTMLElement & ReactiveControllerHost);

  constructor(
    element: HTMLElement,
    params: null | {
      onConnect: (action: () => void) => void;
      onDisconnect: (action: () => void) => void;
      update: () => void;
    }
  );

  constructor(arg1: any, arg2?: any) {
    super(() => this.#localizeController.lang());

    if (arg2 === undefined) {
      this.#localizeController = new LocalizeController(arg1);
    } else {
      const host: ReactiveControllerHost = {
        addController(controller: ReactiveController) {
          if (arg2) {
            arg2.onConnect(() => controller.hostConnected!());
            arg2.onDisconnect(() => controller.hostDisconnected!());
          }
        },

        removeController: () => {},
        requestUpdate: () => arg2?.update(),
        updateComplete: Promise.resolve(true) // TODO!!!
      };

      const proxy = new Proxy(arg1, {
        get(target, prop) {
          return Object.hasOwn(host, prop)
            ? (host as any)[prop]
            : (target as any)[prop];
        }
      }) as HTMLElement & ReactiveControllerHost;

      this.#localizeController = new LocalizeController(proxy);
    }
  }

  override getDirection() {
    const ret = this.#localizeController.dir();

    return ret === 'rtl' ? 'rtl' : 'ltr';
  }
}

// === getLocaleInfo =================================================

type LocaleInfo = Readonly<{
  baseName: string;
  language: string;
  region: string | undefined;
}>;

const localeInfoMap = new Map<string, LocaleInfo>();

function getLocaleInfo(locale: string): LocaleInfo {
  let info = localeInfoMap.get(locale);

  if (!info) {
    info = new (Intl as any).Locale(locale); // TODO
    localeInfoMap.set(locale, info!);
  }

  return info!;
}

// === getDirection ==================================================

var rtlLangs = new Set([
  'ar',
  'dv',
  'fa',
  'ha',
  'he',
  'ks',
  'ku',
  'ps',
  'ug',
  'ur',
  'yi'
]);

function getDirection(locale: string) {
  const lang = locale.substring(0, 2);

  return rtlLangs.has(lang) ? 'rtl' : 'ltr';
}

// === getFirstDayOfWeek =============================================

// Source: https://github.com/unicode-cldr/cldr-core/blob/master/supplemental/weekData.json
// Day of week is represented by number (0 = sunday, ..., 6 = saturday).
const firstDayOfWeekData: Record<number, string> = {
  0:
    'AG,AS,AU,BD,BR,BS,BT,BW,BZ,CA,CN,CO,DM,DO,ET,GT,GU,HK,HN,ID,IL,IN,' +
    'JM,JP,KE,KH,KR,LA,MH,MM,MO,MT,MX,MZ,NI,NP,PA,PE,PH,PK,PR,PT,PY,SA,' +
    'SG,SV,TH,TT,TW,UM,US,VE,VI,WS,YE,ZA,ZW',
  1:
    'AD,AI,AL,AM,AN,AR,AT,AX,AZ,BA,BE,BG,BM,BN,BY,CH,CL,CM,CR,CY,CZ,DE,' +
    'DK,EC,EE,ES,FI,FJ,FO,FR,GB,GE,GF,GP,GR,HR,HU,IE,IS,IT,KG,KZ,LB,LI,' +
    'LK,LT,LU,LV,MC,MD,ME,MK,MN,MQ,MY,NL,NO,NZ,PL,RE,RO,RS,RU,SE,SI,SK,' +
    'SM,TJ,TM,TR,UA,UY,UZ,VA,VN,XK',
  5: 'MV',
  6: 'AE,AF,BH,DJ,DZ,EG,IQ,IR,JO,KW,LY,OM,QA,SD,SY'
};

let firstDayOfWeekByCountryCode: Map<string, number>;

function getFirstDayOfWeek(locale: string): number {
  if (!firstDayOfWeekByCountryCode) {
    firstDayOfWeekByCountryCode = new Map();

    for (const firstDayOfWeek of Object.keys(firstDayOfWeekData)) {
      const firstDay = Number.parseInt(firstDayOfWeek, 10);
      const countryCodes = firstDayOfWeekData[firstDay].split(',');

      countryCodes.forEach((countryCode) => {
        firstDayOfWeekByCountryCode.set(countryCode, firstDay);
      });
    }
  }

  const region = getLocaleInfo(locale).region!;

  return region
    ? firstDayOfWeekByCountryCode.get(region) ?? defaultFirstDayOfWeek
    : defaultFirstDayOfWeek;
}

// === getWeekendDays ================================================

// Source: https://github.com/unicode-cldr/cldr-core/blob/master/supplemental/weekData.json
const weekendData: Record<string, string> = {
  // Friday and Saturday
  '5+6': 'AE,BH,DZ,EG,IL,IQ,JO,KW,LY,OM,QA,SA,SD,SY,YE',

  // Thursday and Friday
  '4+5': 'AF',

  // Sunday
  '6': 'IN,UG',

  // Friday
  '5': 'IR'
};

let weekendDaysByCountryCode: Map<string, Readonly<number[]>>;

function getWeekendDays(locale: string): Readonly<number[]> {
  if (!weekendDaysByCountryCode) {
    weekendDaysByCountryCode = new Map();

    for (const [key, value] of Object.entries(weekendData)) {
      const days = Object.freeze(key.split('+').map((it) => parseInt(it)));
      const countryCodes = value.split(',');

      countryCodes.forEach((countryCode) => {
        weekendDaysByCountryCode.set(countryCode, days);
      });
    }
  }

  const region = getLocaleInfo(locale).region;

  return region
    ? weekendDaysByCountryCode.get(region) || defaultWeekendDays
    : defaultWeekendDays;
}

// === getCalendarWeek ===============================================

function getCalendarWeek(locale: string, date: Date) {
  // Code is based on this solution here:
  // https://stackoverflow.com/questions/23781366/date-get-week-number-for-custom-week-start-day
  // TODO - check algorithm

  const weekstart = getFirstDayOfWeek(locale);
  const target = new Date(date);

  // Replaced offset of (6) with (7 - weekstart)
  const dayNum = (date.getDay() + 7 - weekstart) % 7;
  target.setDate(target.getDate() - dayNum + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);

  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }

  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

// === getNumberParser ===============================================

const numberParserByLocale = new Map<string, (s: string) => number | null>();

function getNumberParser(
  locale: string
): (numberString: string) => number | null {
  let numberParser = numberParserByLocale.get(locale);

  if (!numberParser) {
    const example = Intl.NumberFormat(locale).format(3.4);

    if (
      example.indexOf('3') !== 0 ||
      example.indexOf('4') !== 2 ||
      example.length !== 3
    ) {
      throw new Error('Unsupported locale for automatic number parser');
    }

    const separators = new Set(
      Intl.NumberFormat(locale).format(123456789).replace(/\d/g, '').split('')
    );

    if (separators.size > 1) {
      throw new Error('Unsupported locale for automatic number parser');
    }

    const decimalSeparator = example[1];
    const digitGroupSeparator = [...separators.values()][0] || '';

    const regExp = new RegExp(
      `^\\d(\\d|${escapeRegExp(digitGroupSeparator)})*(${escapeRegExp(
        decimalSeparator
      )}\\d+)?$`
    );

    numberParser = (s: string) => {
      if (!s.match(regExp)) {
        return null;
      }

      let numberString = s;

      if (digitGroupSeparator) {
        numberString = numberString.replaceAll(digitGroupSeparator, '');
      }

      numberString = numberString.replace(decimalSeparator, '.');

      let number = parseFloat(numberString);

      if (numberString !== number.toString()) {
        return null;
      }

      return number;
    };

    numberParserByLocale.set(locale, numberParser);
  }

  return numberParser;
}

// === getDateParser =================================================

const dateParserByLocale = new Map<string, (date: string) => Date | null>();

function getDateParser(locale: string): (s: string) => Date | null {
  let dateParser = dateParserByLocale.get(locale) || null;

  if (!dateParser) {
    const example = Intl.DateTimeFormat(locale).format(new Date('2100-11-23'));

    if (
      example.indexOf('2100') === -1 ||
      example.indexOf('11') === -1 ||
      example.indexOf('23') === -1
    ) {
      // too complex date format - use ISO format as fallback
      dateParserByLocale.set(locale, parseIsoDate);
      return parseIsoDate;
    }

    const regExp = new RegExp(
      '^' +
        escapeRegExp(example)
          .replace('2100', '\\s*(?<year>\\d{1,4})\\s*')
          .replace('11', '\\s*(?<month>\\d{1,2})\\s*')
          .replace('23', '\\s*(?<day>\\d{1,2})\\s*') +
        '$'
    );

    dateParser = (s: string) => {
      const match = regExp.exec(s);

      if (!match) {
        return null;
      }

      const { year: y, month: m, day: d } = match.groups!;
      const year = parseInt(y);
      const month = parseInt(m) - 1;
      const day = parseInt(d);
      const date = new Date(0);

      date.setFullYear(year, month, day);

      return !isNaN(date.getTime()) &&
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
        ? date
        : null;
    };

    dateParserByLocale.set(locale, dateParser);
  }

  return dateParser;
}

// === parseIsoDate ==================================================

// this parses only the ISO date part, e.g. 2021-12-24
function parseIsoDate(s: string): Date | null {
  if (!/^\d{1,4}-\d{1,2}-\d{1,2}$/.test(s)) {
    return null;
  }

  const [year, month, day] = s
    .split('-')
    .map((n, idx) => parseInt(n) - (idx === 1 ? 1 : 0));

  const date = new Date(0);

  date.setFullYear(year, month, day);

  if (isNaN(date.getTime())) {
    return null;
  }

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

// === helpers =========================================================

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
