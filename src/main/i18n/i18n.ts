import {
  formatDate,
  formatNumber,
  formatRelativeTime,
  getCalendarWeek,
  getFirstDayOfWeek,
  getWeekendDays,
  parseDate,
  parseNumber
} from './i18n-utils'

import * as dictionary from './dictionary'

// === exports =======================================================

// I18n is a singleton object, the type of that singleton object
// and a namespace for other I18n related types.
export { I18n }

// === constants (used locally) ======================================

const EN_US = 'en-US'

// === global dictionary =============================================

const dict = new dictionary.Dictionary()

// === public types =================================================

type I18n = Readonly<{
  localize(
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
  export type Behavior = Readonly<{
    translate(
      locale: string,
      key: string,
      params?: Record<string, any>
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
  }>

  export type Localizer = Readonly<{
    getLocale(): string
    translate(key: string, params?: Record<string, any>): string
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
  }>

  // type aliases
  export type NumberFormat = Intl.NumberFormatOptions
  export type DateFormat = Intl.DateTimeFormatOptions
  export type RelativeTimeFormat = Intl.RelativeTimeFormatOptions
  export type RelativeTimeUnit = Intl.RelativeTimeFormatUnit
  export type Translation = dictionary.Translation
  export type Translations = dictionary.Translations
}

function createLocalizer(
  getLocale: () => string,
  i18n: I18n.Behavior
): I18n.Localizer {
  const localizer: I18n.Localizer = {
    getLocale,

    translate: (key: string, replacements?: any) =>
      i18n.translate(getLocale(), key, replacements) || '',

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
  translate: dict.translate.bind(dict),
  formatNumber,
  formatDate,
  parseNumber,
  parseDate,
  formatRelativeTime,
  getFirstDayOfWeek,
  getCalendarWeek,
  getWeekendDays
}

// === I18n singleton object =========================================

let isFinal = false
let defaultLocale = EN_US

let behavior: I18n.Behavior = {
  ...baseBehavior,

  translate(locale, key, replacements?) {
    let translation = baseBehavior.translate(locale, key, replacements)

    if (translation === null && defaultLocale !== locale) {
      translation = baseBehavior.translate(defaultLocale, key, replacements)
    }

    return translation
  }
}

const I18n: I18n = Object.freeze({
  localize(localeOrGetLocale) {
    const getLocale =
      typeof localeOrGetLocale === 'function'
        ? () => localeOrGetLocale() || defaultLocale
        : () => localeOrGetLocale || defaultLocale

    isFinal = true
    return createLocalizer(getLocale, behavior)
  },

  init(params: {
    defaultLocale?: string

    customize?: (
      self: I18n.Behavior,
      base: I18n.Behavior,
      defaultLocale: string
    ) => Partial<I18n.Behavior>
  }): void {
    if (isFinal) {
      throw (
        'Illegal invocation of `i18n.init(...)`' +
        '- must only be used at start of the app' +
        ' before any other I18n function has been used'
      )
    }

    isFinal = true

    if (params.defaultLocale) {
      defaultLocale = params.defaultLocale
    }

    if (params.customize) {
      let newBehavior: I18n.Behavior

      if (params.customize) {
        const self = { ...baseBehavior }

        behavior = Object.assign(
          self,
          params.customize(self, baseBehavior, defaultLocale)
        )
      }
    }
  },

  addTranslations: dict.addTranslations.bind(dict)
})
