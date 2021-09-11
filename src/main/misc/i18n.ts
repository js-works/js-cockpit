/* eslint-disable */
import { LitElement } from 'lit'

// === exports =======================================================

// I18n is a singleton object, the type of that singleton object
// and a namespace for other I18n related types.
export { I18n }

// === constants (used locally) ======================================

const DEFAULT_LOCALE = 'en-US'
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
  localize(
    subject:
      | LitElement
      | {
          element: HTMLElement
          refresh(): void
          onConnect(action: () => void): void
          onDisconnect(action: () => void): void
        }
      | string,

    category?: string
  ): I18n.Facade

  customize(
    mapper: (self: I18n.Behavior, base: I18n.Behavior) => Partial<I18n.Behavior>
  ): void

  addTexts(locale: string, texts: Record<string, string>): void
}>

// eslint-disable-next-line
namespace I18n {
  export type Behavior = {
    getText(
      locale: string,
      textId: string,
      replacements?: string[] | null,
      baseText?: string | null
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
    // translation function
    (textId: string, replacements?: string[]): string
    (textId: string, baseText: string): string
    (textId: string, baseText: string, repacements: any[]): string

    getLocale(): string
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
}

// === local types ===================================================

type Subscriber<T> = (value: T) => void
type Unsubscribe = () => void
type Subscribable<T> = (subscriber: Subscriber<T>) => Unsubscribe

type Emitter<T> = {
  emit(value: T): void
  subscribe: Subscribable<T>
}

type ElementInst =
  | LitElement
  | {
      element: HTMLElement
      refresh(): void
      onConnect(action: () => void): void
      onDisconnect(action: () => void): void
    }

// === dictionary for translations ===================================

const dict = (() => {
  const texts = new Map<string, Map<string, string>>()

  return {
    addText(locale: string, textId: string, translation: string): void {
      let map = texts.get(locale)

      if (!map) {
        map = new Map()
        texts.set(locale, map)
      }

      map.set(textId, translation)
    },

    addTexts(locale: string, texts: Record<string, string>) {
      Object.entries(texts).forEach(([key, value]) =>
        dict.addText(locale, key, value)
      )
    },

    getText(
      locale: string,
      textId: string,
      replacements?: string[] | null
    ): string | null {
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

      if (ret && replacements) {
        replacements.forEach((value, idx) => {
          ret = ret!.replaceAll(`{${idx}}`, value)
        })
      }

      return ret
    }
  }
})()

// === facade impl ===================================================

function createFacade(
  getLocale: () => string,
  getBehavior: () => I18n.Behavior,
  category: string
): I18n.Facade {
  const facade = <I18n.Facade>((textId: string, arg2?: any, arg3?: any) => {
    const fullId = !textId || textId[0] !== '.' ? textId : category + textId

    const baseText = typeof arg2 === 'string' ? arg2 : null

    const replacements = Array.isArray(arg2)
      ? arg2
      : Array.isArray(arg3)
      ? arg3
      : null

    let text = getBehavior().getText(
      getLocale(),
      fullId,
      replacements,
      baseText
    )

    if (text && replacements) {
      // TODO: optimize
      replacements.forEach((value, idx) => {
        text = text!.replaceAll(`{${idx}}`, value)
      })
    }

    return text
  })

  return Object.assign(facade, <I18n.Facade>{
    getLocale,

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
  })
}

// === base i18n behavior =========================================

const baseBehavior: I18n.Behavior = {
  getText(locale, textId, replacements?, baseText?): string | null {
    let ret = dict.getText(locale, textId, replacements)

    if (
      ret === null &&
      typeof baseText === 'string' &&
      locale === DEFAULT_LOCALE
    ) {
      ret = baseText
    }

    return ret
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
  let behavior = baseBehavior
  let version = 0
  const emitter = createEmitter<boolean>()

  return {
    getBehavior: () => behavior,

    setBehavior(newBehavior: I18n.Behavior) {
      if (newBehavior !== behavior) {
        behavior = newBehavior
        emitter.emit(true)
      }
    },

    getVersion() {
      if (version === 0) {
        const observer = new MutationObserver((mutations) => {
          ++version
          emitter.emit(false)
        })

        const config = {
          attributes: true,
          attributeFilter: ['lang'],
          subtree: true
        }

        observer.observe(document, config)
        version = 1
      }

      return version
    },

    watch: emitter.subscribe,

    // be careful, this is an expensive
    determineLocale(elem: HTMLElement): string {
      if (elem.lang && !(elem.getRootNode() instanceof ShadowRoot)) {
        return elem.lang
      } else {
        let el: any = elem

        while (el) {
          if (el.host) {
            while (el.host) {
              el = el.host
            }
          } else {
            el = el.parentNode

            while (el && el.host) {
              el = el.host
            }
          }

          if (!el) {
            return DEFAULT_LOCALE
          } else if (el.lang) {
            return el.lang
          }
        }
      }

      return DEFAULT_LOCALE
    }
  }
})()

// === I18n singleton object =========================================

const I18n: I18n = Object.freeze({
  localize(subject: ElementInst | string, category: string = ''): I18n.Facade {
    if (typeof subject === 'string') {
      return createFacade(() => subject, i18nCtrl.getBehavior, category)
    }

    const isLit = subject instanceof LitElement
    const elem = isLit ? subject : (subject as any).element
    let version = 0
    let locale = DEFAULT_LOCALE

    const getLocale = () => {
      const currentVersion = i18nCtrl.getVersion()

      if (version !== currentVersion) {
        version = currentVersion
        locale = i18nCtrl.determineLocale(elem)
      }

      return locale
    }

    if (isLit) {
      const litElem = elem as LitElement
      let cleanup: Unsubscribe | null = null

      litElem.addController({
        hostConnected() {
          cleanup = i18nCtrl.watch((forceUpdate) => {
            const oldLocale = locale
            const newLocale = getLocale()

            if (forceUpdate || oldLocale !== newLocale) {
              litElem.requestUpdate()
            }
          })
        },

        hostDisconnected() {
          cleanup && cleanup()
          cleanup = null
        }
      })
    } else {
      const { refresh, onConnect, onDisconnect } = subject as Exclude<
        ElementInst,
        LitElement
      >

      let cleanup: Unsubscribe | null = null

      onConnect(() => {
        cleanup = i18nCtrl.watch((forceUpdate) => {
          const oldLocale = locale
          const newLocale = getLocale()

          if (forceUpdate || oldLocale !== newLocale) {
            refresh()
          }
        })
      })

      onDisconnect(() => {
        cleanup && cleanup()
        cleanup = null
      })
    }

    return createFacade(
      getLocale,
      i18nCtrl.getBehavior,
      `${category}.${elem.localName}`
    )
  },

  customize(
    mapper: (self: I18n.Behavior, base: I18n.Behavior) => Partial<I18n.Behavior>
  ): void {
    const self = Object.assign({}, baseBehavior)

    i18nCtrl.setBehavior(Object.assign(self, mapper(self, baseBehavior)))
  },

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

I18n.customize((self, base) => {
  return {
    getText(locale, textId, replacements?, baseText?) {
      return (
        base.getText(locale, textId, replacements, baseText) ?? baseText ?? null
      )
    }
  }
})
