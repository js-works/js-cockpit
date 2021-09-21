// === exports =======================================================

// I18n is a singleton object, the type of that singleton object
// and a namespace for other I18n related types.
export { I18n }

// === constants (used locally) ======================================

const EN_US = 'en-US'
const DEFAULT_FIRST_DAY_OF_WEEK = 0

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

    formatDate(locale: string, value: Date, format?: DateFormat): string
    formatNumber(locale: string, value: number, format?: NumberFormat): string

    formatRelativeTime(
      locale: string,
      value: number,
      unit: RelativeTimeUnit,
      format?: RelativeTimeFormat
    ): string

    getFirstDayOfWeek(locale: string): number // 0 to 6, 0 means Sunday
  }

  export type Localizer = {
    getLocale(): string
    translate(key: string, replacements?: any): string
    formatDate(value: Date, format?: DateFormat): string
    formatNumber(value: number, format?: NumberFormat): string

    formatRelativeTime(
      value: number,
      unit: RelativeTimeUnit,
      format?: RelativeTimeFormat
    ): string

    getFirstDayOfWeek(): number // 0 to 6, 0 means Sunday
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
          console.log(ret)
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

    formatNumber: (number, format) =>
      i18n.formatNumber(getLocale(), number, format),

    formatDate: (date, format) => i18n.formatDate(getLocale(), date, format),

    formatRelativeTime: (number, unit, format) =>
      i18n.formatRelativeTime(getLocale(), number, unit, format),

    getFirstDayOfWeek: () => i18n.getFirstDayOfWeek(getLocale()),

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

  formatDate(locale, value, format): string {
    return new Intl.DateTimeFormat(locale, format).format(value)
  },

  formatNumber(locale, value, format): string {
    return new Intl.NumberFormat(locale, format).format(value)
  },

  formatRelativeTime(locale, value, unit, format): string {
    return new Intl.RelativeTimeFormat(locale, format).format(value, unit)
  },

  getFirstDayOfWeek(locale) {
    return getFirstDayOfWeek(locale)
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
