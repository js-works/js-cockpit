// === exports =======================================================

// I18n is a singleton object, the type of that singleton object
// and a namespace for other I18n related types.
export { I18n }

// === constants (used locally) ======================================

const EN_US = 'en-US'
const DEFAULT_FIRST_DAY_OF_WEEK = 1
const DEFAULT_WEEKEND_DAYS = Object.freeze([0, 6]) // Sunday and Saturday

const DEFAULT_DATE_FORMAT = Object.freeze({
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
} as const)

// === parsers by locale =============================================

const numberParserByLocale = new Map<
  string,
  (number: string) => number | null
>()
const dateParserByLocale = new Map<string, (date: string) => Date | null>()

// === data for first day of week per country (used locally) =========

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
}

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
}

// === public types ==================================================

type I18n = Readonly<{
  localizer(
    localeOrGetLocale: string | null | (() => string | null)
  ): I18n.Localizer

  init(params: {
    defaultLocale?: string

    customize?(
      self: I18n.Behavior,
      base: I18n.Behavior,
      defaultLocale: string
    ): Partial<I18n.Behavior>
  }): void

  addTranslations(locale: string, translations: I18n.Translations): void
}>

// eslint-disable-next-line
namespace I18n {
  export type Behavior = {
    translate(
      locale: string,
      key: string,
      replacements?: string[] | null
    ): string | null

    parseNumber(locale: string, numberString: string): number | null
    parseDate(locale: string, dateString: string): Date | null

    formatNumber(locale: string, value: number, format?: NumberFormat): string
    formatDate(locale: string, value: Date, format?: DateFormat | null): string

    formatRelativeTime(
      locale: string,
      value: number,
      unit: RelativeTimeUnit,
      format?: RelativeTimeFormat
    ): string

    getFirstDayOfWeek(locale: string): number // 0 to 6, 0 means Sunday
    getCalendarWeek(locale: string, date: Date): number // 1 to 53
    getWeekendDays(locale: string): Readonly<number[]> // array of integers between 0 and 6
  }

  export type Localizer = {
    getLocale(): string
    translate(key: string, replacements?: any): string

    parseNumber(numberString: string): number | null
    parseDate(dateString: string): Date | null

    formatNumber(value: number, format?: NumberFormat): string
    formatDate(value: Date, format?: DateFormat | null): string

    formatRelativeTime(
      value: number,
      unit: RelativeTimeUnit,
      format?: RelativeTimeFormat
    ): string

    getFirstDayOfWeek(): number // 0 to 6, 0 means Sunday
    getWeekendDays(): Readonly<number[]> // array of integer form 0 to 6
    getCalendarWeek(date: Date): number // 1 to 53
    getDayName(index: number, format?: 'long' | 'short' | 'narrow'): string
    getDayNames(format?: 'long' | 'short' | 'narrow'): string[]
    getMonthName(index: number, format?: 'long' | 'short' | 'narrow'): string
    getMonthNames(format?: 'long' | 'short' | 'narrow'): string[]
  }

  // type aliases
  export type NumberFormat = Intl.NumberFormatOptions
  export type DateFormat = Intl.DateTimeFormatOptions
  export type RelativeTimeFormat = Intl.RelativeTimeFormatOptions
  export type RelativeTimeUnit = Intl.RelativeTimeFormatUnit

  export type Translations = {
    [key: string]: string | ((...args: any[]) => string) | Translations
  }
}

// === local types ===================================================

type Subscriber<T> = (value: T) => void
type Unsubscribe = () => void
type Subscribable<T> = (subscriber: Subscriber<T>) => Unsubscribe

type Emitter<T> = {
  emit(value: T): void
  subscribe: Subscribable<T>
}

// === dictionary for translations ===================================

const dict = (() => {
  const translations = new Map<
    string,
    Map<string, string | ((...args: any[]) => string)>
  >()

  const addTranslationsWithNamespace = (
    locale: string,
    namespace: string,
    translations: I18n.Translations
  ) => {
    Object.entries(translations).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'function') {
        const newKey = namespace === '' ? key : `${namespace}.${key}`

        dict.addTranslation(locale, newKey, value)
      } else {
        const newNamespace = namespace === '' ? key : `${namespace}.${key}`

        addTranslationsWithNamespace(locale, newNamespace, value)
      }
    })
  }

  return {
    addTranslation(
      locale: string,
      key: string,
      translation: string | ((...args: any[]) => string)
    ): void {
      let map = translations.get(locale)

      if (!map) {
        map = new Map()
        translations.set(locale, map)
      }

      map.set(key, translation)
    },

    addTranslations(locale: string, translations: I18n.Translations) {
      addTranslationsWithNamespace(locale, '', translations)
    },

    translate(locale: string, key: string, replacements?: any): string | null {
      let ret = translations.get(locale)?.get(key) || null

      if (ret === null && locale) {
        const shortLocale = getShortLocale(locale)

        if (shortLocale && shortLocale !== locale) {
          ret = translations.get(shortLocale)?.get(key) || null
        }

        if (ret === null) {
          const langCode = getLanguageCode(locale)

          if (langCode && langCode !== shortLocale) {
            ret = translations.get(langCode)?.get(key) || null
          }
        }
      }

      if (ret !== null && replacements) {
        if (typeof ret !== 'function') {
          console.log(ret) // TODO

          throw new Error(
            `Invalid translation parameters for key "${key}" in locale "${locale}"`
          )
        }

        if (Array.isArray(replacements)) {
          ret = ret(...replacements)
        } else {
          ret = ret(replacements)
        }
      }

      return ret as string
    }
  }
})()

// === localizer impl ===================================================

function createLocalizer(getLocale: () => string): I18n.Localizer {
  const i18n = i18nCtrl.behavior

  const localizer: I18n.Localizer = {
    getLocale,

    translate(key: string, replacements?: any) {
      return i18n.translate(getLocale(), key, replacements) || ''
    },

    parseNumber: (numberString) => i18n.parseNumber(getLocale(), numberString),
    parseDate: (dateString) => i18n.parseDate(getLocale(), dateString),

    formatNumber: (number, format) =>
      i18n.formatNumber(getLocale(), number, format),

    formatDate: (date, format) => i18n.formatDate(getLocale(), date, format),

    formatRelativeTime: (number, unit, format) =>
      i18n.formatRelativeTime(getLocale(), number, unit, format),

    getFirstDayOfWeek: () => i18n.getFirstDayOfWeek(getLocale()),
    getWeekendDays: () => i18n.getWeekendDays(getLocale()),
    getCalendarWeek: (date: Date) => i18n.getCalendarWeek(getLocale(), date),

    getDayName(index, format = 'long') {
      const date = new Date(1970, 0, 4 + (index % 7))

      return new Intl.DateTimeFormat(getLocale(), { weekday: format }).format(
        date
      )
    },

    getDayNames(format = 'long') {
      const arr: string[] = []

      for (let i = 0; i < 7; ++i) {
        arr.push(localizer.getDayName(i, format))
      }

      return arr
    },

    getMonthName(index, format = 'long') {
      const date = new Date(1970, index % 12, 1)

      return new Intl.DateTimeFormat(getLocale(), { month: format }).format(
        date
      )
    },

    getMonthNames(format = 'long') {
      const arr: string[] = []

      for (let i = 0; i < 12; ++i) {
        arr.push(localizer.getMonthName(i, format))
      }

      return arr
    }
  }

  return localizer
}

// === base i18n behavior =========================================

const baseBehavior: I18n.Behavior = {
  translate(locale, key, replacements): string | null {
    return dict.translate(locale, key, replacements)
  },

  parseNumber(locale: string, numberString: string): number | null {
    let numberParser = numberParserByLocale.get(locale)

    if (!numberParser) {
      const example = Intl.NumberFormat(locale).format(3.4)

      if (
        example.indexOf('3') !== 0 ||
        example.indexOf('4') !== 2 ||
        example.length !== 3
      ) {
        throw new Error('Unsupported locale for automatic number parser')
      }

      const separators = new Set(
        Intl.NumberFormat(locale).format(123456789).replace(/\d/g, '').split('')
      )

      if (separators.size > 1) {
        throw new Error('Unsupported locale for automatic number parser')
      }

      const decimalSeparator = example[1]
      const digitGroupSeparator = [...separators.values()][0] || ''

      const regExp = new RegExp(
        `^\\d(\\d|${escapeRegExp(digitGroupSeparator)})*(${escapeRegExp(
          decimalSeparator
        )}\\d+)?$`
      )

      numberParser = (s: string) => {
        if (!s.match(regExp)) {
          return null
        }

        let numberString = s

        if (digitGroupSeparator) {
          numberString = numberString.replaceAll(digitGroupSeparator, '')
        }

        numberString = numberString.replace(decimalSeparator, '.')

        let number = parseFloat(numberString)

        if (numberString !== number.toString()) {
          return null
        }

        return number
      }

      numberParserByLocale.set(locale, numberParser)
    }

    return numberParser(numberString)
  },

  parseDate(locale: string, dateString: string): Date | null {
    let dateParser = dateParserByLocale.get(locale)

    if (!dateParser) {
      const example = Intl.DateTimeFormat(locale).format(new Date('2100-11-23'))

      if (
        example.indexOf('2100') === -1 ||
        example.indexOf('11') === -1 ||
        example.indexOf('23') === -1
      ) {
        // too complex date format - use ISO format as fallback
        dateParserByLocale.set(locale, parseIsoDateString)
        return parseIsoDateString(dateString)
      }

      const regExp = new RegExp(
        '^' +
          escapeRegExp(example)
            .replace('2100', '\\s*(?<year>\\d{1,4})\\s*')
            .replace('11', '\\s*(?<month>\\d{1,2})\\s*')
            .replace('23', '\\s*(?<day>\\d{1,2})\\s*') +
          '$'
      )

      dateParser = (s: string) => {
        const match = regExp.exec(s)

        if (!match) {
          return null
        }

        const { year, month, day } = match.groups!

        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      }

      dateParserByLocale.set(locale, dateParser)
    }

    return dateParser(dateString)
  },

  formatNumber(locale, value, format): string {
    return new Intl.NumberFormat(locale, format).format(value)
  },

  formatDate(locale, value, format): string {
    if (!format) {
      let dateParser = dateParserByLocale.get(locale)

      if (!dateParserByLocale.has(locale)) {
        baseBehavior.parseDate(locale, '1970-01-01') // TODO!!!
        dateParser = dateParserByLocale.get(locale)
      }

      if (dateParser === parseIsoDateString) {
        return value.toISOString().substr(0, 10)
      }

      format = DEFAULT_DATE_FORMAT
    }

    return new Intl.DateTimeFormat(locale, format).format(value)
  },

  formatRelativeTime(locale, value, unit, format): string {
    return new Intl.RelativeTimeFormat(locale, format).format(value, unit)
  },

  getFirstDayOfWeek(locale) {
    return getFirstDayOfWeek(locale)
  },

  getCalendarWeek(locale: string, date: Date) {
    // Code is based on this solution here:
    // https://stackoverflow.com/questions/23781366/date-get-week-number-for-custom-week-start-day
    // TODO - check algorithm

    const weekstart = this.getFirstDayOfWeek(locale)
    const target = new Date(date)

    // Replaced offset of (6) with (7 - weekstart)
    const dayNum = (date.getDay() + 7 - weekstart) % 7
    target.setDate(target.getDate() - dayNum + 3)
    const firstThursday = target.valueOf()
    target.setMonth(0, 1)

    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7))
    }

    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000)
  },

  getWeekendDays(locale: string) {
    return getWeekendDays(locale)
  }
}

// === i18n controller ===============================================

const i18nCtrl = (() => {
  let isFinal = false
  let defaultLocale = EN_US

  let behavior: I18n.Behavior = {
    ...baseBehavior,

    translate(locale, key, replacements?) {
      let translation = baseBehavior.translate(locale, key, replacements)

      if (translation === null) {
        if (defaultLocale !== locale) {
          translation = baseBehavior.translate(defaultLocale, key, replacements)
        }
      }

      return translation
    }
  }

  return {
    get isFinal() {
      return isFinal
    },

    get defaultLocale() {
      isFinal = true
      return defaultLocale
    },

    set defaultLocale(locale: string) {
      isFinal = true
      defaultLocale = locale
    },

    get behavior() {
      isFinal = true
      return behavior
    },

    set behavior(behavior: I18n.Behavior) {
      isFinal = true
      behavior = behavior
    },

    addTranslations(locale: string, translations: I18n.Translations): void {
      isFinal = true
      return dict.addTranslations(locale, translations)
    }
  }
})()

// === I18n singleton object =========================================

const I18n: I18n = Object.freeze({
  localizer(localeOrGetLocale) {
    return createLocalizer(
      typeof localeOrGetLocale === 'function'
        ? () => localeOrGetLocale() || i18nCtrl.defaultLocale
        : () => localeOrGetLocale || i18nCtrl.defaultLocale
    )
  },

  init(params: {
    defaultLocale?: string

    customize?: (
      self: I18n.Behavior,
      base: I18n.Behavior,
      defaultLocale: string
    ) => Partial<I18n.Behavior>
  }): void {
    if (i18nCtrl.isFinal) {
      throw (
        'Illegal invocation of `i18n.init(...)`' +
        '- must only be used at start of the app' +
        ' before any other I18n function has been used'
      )
    }

    if (params.defaultLocale) {
      i18nCtrl.defaultLocale = params.defaultLocale
    }

    if (params.customize) {
      let newBehavior: I18n.Behavior

      if (params.customize) {
        const self = { ...baseBehavior }
        newBehavior = Object.assign(
          self,
          params.customize(self, baseBehavior, i18nCtrl.defaultLocale)
        )

        i18nCtrl.behavior = newBehavior
      }
    }
  },

  addTranslations: i18nCtrl.addTranslations
})

// === utils ==========================================================

function getLanguageCode(locale: string): string {
  const result = /^[a-z]+/.exec(locale)
  return result ? result[0] : ''
}

function getCountryCode(locale: string): string {
  const result = /^[a-z]+-([A-Z]+)/.exec(locale)
  return result ? result[1] : ''
}

function getShortLocale(locale: string): string {
  const result = /^[a-z]+(-([A-Z]+))?/.exec(locale)
  return result ? result[0] : ''
}

const getFirstDayOfWeek: (locale: string) => number = (() => {
  const firstDayOfWeekByCountryCode = new Map<string, number>()

  for (const firstDayOfWeek of Object.keys(firstDayOfWeekData)) {
    const firstDay = (firstDayOfWeek as any) as number
    const countryCodes = firstDayOfWeekData[firstDay].split(',')

    countryCodes.forEach((countryCode) => {
      firstDayOfWeekByCountryCode.set(countryCode, firstDay)
    })
  }

  return (locale: string): number => {
    return (
      firstDayOfWeekByCountryCode.get(getCountryCode(locale)) ||
      DEFAULT_FIRST_DAY_OF_WEEK
    )
  }
})()

const getWeekendDays = ((): ((locale: string) => Readonly<number[]>) => {
  const weekendDaysByCountryCode = new Map<string, Readonly<number[]>>()

  for (const [key, value] of Object.entries(weekendData)) {
    const days = Object.freeze(key.split('+').map((it) => parseInt(it)))
    const countryCodes = value.split(',')

    countryCodes.forEach((countryCode) =>
      weekendDaysByCountryCode.set(countryCode, days)
    )
  }

  return (locale: string) =>
    weekendDaysByCountryCode.get(getCountryCode(locale)) || DEFAULT_WEEKEND_DAYS
})()

function parseIsoDateString(s: string): Date | null {
  // TODO!!!!!
  return new Date(s)
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
