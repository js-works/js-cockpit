/* eslint-disable */

import de from '../translations/de'

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
  getFacade(
    localeOrGetLocale: string | null | (() => string | null),
    behaviorOrGetBehavior?: I18n.Behavior | (() => I18n.Behavior)
  ): I18n.Facade

  setDefaults(params: {
    defaultLocale?: string

    behavior?:
      | I18n.Behavior
      | ((
          self: I18n.Behavior,
          base: I18n.Behavior,
          getDefaultLocale: () => string
        ) => Partial<I18n.Behavior>)
  }): void

  watchDefaults(callback: () => void): () => void
  addTexts(locale: string, texts: I18n.Texts): void
}>

// eslint-disable-next-line
namespace I18n {
  export type Behavior = {
    getText(
      locale: string,
      textId: string,
      fallbackText?: string | null,
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

  export type Facade = {
    getLocale(): string
    getText(textId: string, replacements?: any): string
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
  export type Texts = { [key: string]: string | Texts }
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
  const texts = new Map<string, Map<string, string>>()

  const addTextsWithNamespace = (
    locale: string,
    namespace: string,
    texts: I18n.Texts
  ) => {
    Object.entries(texts).forEach(([key, value]) => {
      if (typeof value === 'string') {
        const newKey = namespace === '' ? key : `${namespace}.${key}`

        dict.addText(locale, newKey, value)
      } else {
        const newNamespace = namespace === '' ? key : `${namespace}.${key}`

        addTextsWithNamespace(locale, newNamespace, value)
      }
    })
  }

  return {
    addText(locale: string, textId: string, translation: string): void {
      let map = texts.get(locale)

      if (!map) {
        map = new Map()
        texts.set(locale, map)
      }

      map.set(textId, translation)
    },

    addTexts(locale: string, texts: I18n.Texts) {
      addTextsWithNamespace(locale, '', texts)
    },

    getText(locale: string, textId: string): string | null {
      let ret = texts.get(locale)?.get(textId) || null

      if (ret === null && locale) {
        const shortLocale = getShortLocale(locale)

        if (shortLocale && shortLocale !== locale) {
          ret = texts.get(shortLocale)?.get(textId) || null
        }

        if (ret === null) {
          const langCode = getLanguageCode(locale)

          if (langCode && langCode !== shortLocale) {
            ret = texts.get(langCode)?.get(textId) || null
          }
        }
      }

      return ret
    }
  }
})()

// === facade impl ===================================================

function createFacade(
  getLocale: () => string,
  getBehavior: () => I18n.Behavior
): I18n.Facade {
  const facade: I18n.Facade = {
    getLocale,

    getText(textId: string, replacements?: any) {
      return getBehavior().getText(getLocale(), textId, replacements) || ''
    },

    formatNumber: (number, format) =>
      getBehavior().formatNumber(getLocale(), number, format),

    formatDate: (date, format) =>
      getBehavior().formatDate(getLocale(), date, format),

    formatRelativeTime: (number, unit, format) =>
      getBehavior().formatRelativeTime(getLocale(), number, unit, format),

    getFirstDayOfWeek: () => getBehavior().getFirstDayOfWeek(getLocale()),

    getDayName(index, format = 'long') {
      const date = new Date(1970, 0, 4 + (index % 7))

      return new Intl.DateTimeFormat(getLocale(), { weekday: format }).format(
        date
      )
    },

    getDayNames(format = 'long') {
      const arr: string[] = []

      for (let i = 0; i < 7; ++i) {
        arr.push(facade.getDayName(i, format))
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
        arr.push(facade.getMonthName(i, format))
      }

      return arr
    }
  }

  return facade
}

// === base i18n behavior =========================================

const baseBehavior: I18n.Behavior = {
  getText(locale, textId, replacements): string | null {
    let text = dict.getText(locale, textId)

    if (text && replacements) {
      if (Array.isArray(replacements)) {
        replacements.forEach((value, idx) => {
          text = text!.replaceAll(`{${idx}}`, value)
        })
      } else {
        text = text.replaceAll(`{0}`, replacements)
      }
    }

    return text
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
  let defaultLocale = EN_US
  let defaultBehavior = baseBehavior
  const emitter = createEmitter<void>()

  return {
    getDefaultLocale: () => defaultLocale,

    setDefaultLocale(locale: string) {
      if (locale !== defaultLocale) {
        defaultLocale = locale
        emitter.emit()
      }
    },

    getDefaultBehavior: () => defaultBehavior,

    setDefaultBehavior(behavior: I18n.Behavior) {
      if (behavior !== defaultBehavior) {
        defaultBehavior = behavior
        emitter.emit()
      }
    },

    watch: emitter.subscribe
  }
})()

// === I18n singleton object =========================================

const I18n: I18n = Object.freeze({
  getFacade(localeOrGetLocale, behaviorOrGetBehavior?) {
    return createFacade(
      typeof localeOrGetLocale === 'function'
        ? () => localeOrGetLocale() || EN_US
        : () => localeOrGetLocale || EN_US,

      typeof behaviorOrGetBehavior === 'function'
        ? behaviorOrGetBehavior
        : i18nCtrl.getDefaultBehavior
    )
  },

  setDefaults(params: {
    defaultLocale?: string

    behavior?:
      | I18n.Behavior
      | ((
          self: I18n.Behavior,
          base: I18n.Behavior,
          getDefaultLocale: () => string
        ) => Partial<I18n.Behavior>)
  }): void {
    if (params.defaultLocale) {
      i18nCtrl.setDefaultLocale(params.defaultLocale)
    }

    if (params.behavior) {
      let newBehavior: I18n.Behavior

      if (typeof params.behavior === 'function') {
        const mapper = params.behavior as Function
        const self = { ...baseBehavior }
        newBehavior = Object.assign(
          self,
          mapper(self, baseBehavior, i18nCtrl.getDefaultLocale)
        )
      } else {
        newBehavior = params.behavior as I18n.Behavior
      }

      i18nCtrl.setDefaultBehavior(newBehavior)
    }
  },

  watchDefaults: i18nCtrl.watch,
  addTexts: dict.addTexts
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

function createEmitter<T>(): Emitter<T> {
  const subscribers = new Set<Subscriber<T>>()

  return {
    emit: (value) => subscribers.forEach((subscriber) => subscriber(value)),

    subscribe(subscriber) {
      subscribers.add(subscriber)
      return () => subscribers.delete(subscriber)
    }
  }
}

// === set standard behavior =========================================

I18n.setDefaults({
  defaultLocale: EN_US,

  behavior: (self, base, getDefaultLocale) => ({
    getText(locale, textId, replacements?) {
      let text = base.getText(locale, textId, replacements)

      if (text === null) {
        const defaultLocale = getDefaultLocale()

        if (defaultLocale !== locale) {
          text = base.getText(defaultLocale, textId, replacements)
        }
      }

      return text
    }
  })
})
