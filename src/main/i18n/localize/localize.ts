import {
  formatDate,
  formatNumber,
  formatRelativeTime,
  getCalendarWeek,
  getDirection,
  getFirstDayOfWeek,
  getWeekendDays,
  parseDate,
  parseNumber
} from './localize-utils'

// == exports ========================================================

export { Dictionary, Localizer }

export type {
  LocalizeAdapter,
  Category,
  DateFormat,
  DayNameFormat,
  Direction,
  FullTranslations,
  Locale,
  MonthNameFormat,
  NumberFormat,
  PartialTranslations,
  RelativeTimeFormat,
  RelativeTimeUnit,
  TermKey,
  TermValue,
  Translation,
  Translations
}

// === exported types ================================================

declare global {
  namespace Localize {
    interface Translations {}
  }
}

type Locale = string
type Category = string
type TermKey = string
type Direction = 'ltr' | 'rtl'
type TermValue = string | ((params: any, localizer: Localizer) => string)

type Translation = {
  [C: Category]: {
    [K: TermKey]: TermValue
  }
}

type Translations = Record<Locale, Translation>

type PartialTranslationsOf<T extends Translation> = {
  [L: Locale]: {
    [C in keyof T]?: {
      [K in keyof T[C]]?: T[C][K]
    }
  }
}

type FullTranslations<
  B extends string,
  T extends Translation = Localize.Translations
> = {
  [L: string]: {
    [C in keyof T]: C extends `${B}.${string}` ? T[C] : never
  }
}

type PartialTranslations<
  B extends string,
  T extends Translation = Localize.Translations
> = {
  [L: string]: {
    [C in keyof T]?: C extends `${B}.${string}` ? Partial<T[C]> : never
  }
}

interface NumberFormat extends Intl.NumberFormatOptions {}
interface DateFormat extends Intl.DateTimeFormatOptions {}
type RelativeTimeFormat = Intl.RelativeTimeFormatOptions
type RelativeTimeUnit = Intl.RelativeTimeFormatUnit
type DayNameFormat = 'long' | 'short' | 'narrow'
type MonthNameFormat = 'long' | 'short' | 'narrow'

type LocalizeAdapter<T extends Translation = Localize.Translations> = {
  registerTranslations(translations: PartialTranslationsOf<T>): void

  translate: <C extends keyof T, K extends keyof T[C]>(
    locale: Locale,
    category: C & Category,
    termKey: K & TermKey,
    params: FirstArgument<T[C][K]>,
    i18n: Localizer<T>
  ) => string
}

// === local types ===================================================

type FirstArgument<T> = T extends (firstArg: infer A, ...rest: any[]) => any
  ? A
  : never

// === constants =====================================================

const regexCategory = /^[a-z][a-zA-Z0-9\.]*$/
const regexTermKey = /^[a-z][a-zA-Z0-9]*$/

// === Dictionary ====================================================

class Dictionary<T extends Translation = Localize.Translations> {
  #adapter: LocalizeAdapter
  #localizerByLocale = new Map<Locale, Localizer<T>>()

  constructor(adapter: LocalizeAdapter) {
    this.#adapter = adapter
  }

  registerTranslations(...translationsList: PartialTranslationsOf<T>[]): void {
    for (const translations of translationsList) {
      for (const locale of Object.keys(translations)) {
        const translation: Translation = translations[locale as any] as any // TODO!!!!!

        for (const category of Object.keys(translation)) {
          if (!category.match(regexCategory)) {
            throw Error(`Illegal translations category name "${category}"`)
          }

          if (translation[category]) {
            for (const termKey of Object.keys(translation[category])) {
              if (!termKey.match(regexTermKey)) {
                throw Error(
                  `Illegal ${locale}, ${category} translation key "${termKey}"`
                )
              }
            }
          }
        }
      }

      this.#adapter.registerTranslations(translations)
    }
  }

  translate<C extends keyof T, K extends keyof T[C]>(
    locale: Locale,
    category: C & Category,
    termKey: K & TermKey,
    params: FirstArgument<T[C][K]>
  ) {
    let localizer = this.#localizerByLocale.get(locale)

    if (!localizer) {
      localizer = new Localizer(() => locale, this.#adapter)
      this.#localizerByLocale.set(locale, localizer)
    }

    return this.#adapter.translate(
      locale,
      category as any, // TODO!!!
      termKey as any, // TODO!!!,
      params as any, // TODO!!!,
      localizer as any // TODO!!!
    ) // TODO!!!!!!!
  }
}

// === AbstractLocalizer =============================================

class Localizer<T extends Translation = Localize.Translations> {
  #getLocale: () => Locale
  #adapter: LocalizeAdapter

  constructor(getLocale: () => Locale, adapter: LocalizeAdapter) {
    this.#getLocale = getLocale
    this.#adapter = adapter
  }

  getLocale(): Locale {
    return this.#getLocale()
  }

  getDirection(): Direction {
    return getDirection(this.#getLocale())
  }

  translate<U extends Translation>(): <C extends keyof U, K extends keyof U[C]>(
    category: C,
    termKey: K,
    params?: FirstArgument<U[C][K]>
  ) => string

  translate<C extends keyof T>(
    category: C
  ): <K extends keyof T[C]>(
    termKey: K,
    params?: FirstArgument<T[C][K]>
  ) => string

  translate<C extends keyof T, K extends keyof T[C]>(
    category: C,
    termKey: keyof T[C],
    params?: FirstArgument<T[C][K]>
  ): string

  translate(category?: any, termKey?: any, params?: any): any {
    if (arguments.length === 0) {
      return (category: any, key: any, params: any) =>
        this.translate(category, key, params)
    } else if (arguments.length === 1) {
      return (key: any, params?: any) => this.translate(category, key, params)
    }

    return this.#adapter.translate(
      this.#getLocale(),
      category as any,
      termKey as any,
      (params as any) || null,
      this as any // TODO!!!
    )
  }

  parseNumber(numberString: string): number | null {
    return parseNumber(this.#getLocale(), numberString)
  }

  parseDate(dateString: string): Date | null {
    return parseDate(this.#getLocale(), dateString)
  }

  formatNumber(value: number, format?: NumberFormat): string {
    return formatNumber(this.#getLocale(), value, format || {})
  }

  formatDate(value: Date, format?: DateFormat | null): string {
    return formatDate(this.#getLocale(), value, format || {})
  }

  formatRelativeTime(
    value: number,
    unit: RelativeTimeUnit,
    format?: RelativeTimeFormat
  ): string {
    return formatRelativeTime(this.#getLocale(), value, unit, format || {})
  }

  // 0 to 6, 0 means Sunday
  getFirstDayOfWeek(): number {
    return getFirstDayOfWeek(this.#getLocale())
  }

  // array of integer form 0 to 6
  getWeekendDays(): Readonly<number[]> {
    return getWeekendDays(this.#getLocale())
  }

  // 1 to 53
  getCalendarWeek(date: Date): number {
    return getCalendarWeek(this.#getLocale(), date)
  }

  getDayName(index: number, format?: DayNameFormat): string {
    const date = new Date(1970, 0, 4 + (index % 7))

    return new Intl.DateTimeFormat(this.#getLocale(), {
      weekday: format
    }).format(date)
  }

  getDayNames(format?: DayNameFormat): string[] {
    const arr: string[] = []

    for (let i = 0; i < 7; ++i) {
      arr.push(this.getDayName(i, format))
    }

    return arr
  }

  getMonthName(index: number, format?: MonthNameFormat): string {
    const date = new Date(1970, index % 12, 1)

    return new Intl.DateTimeFormat(this.#getLocale(), { month: format }).format(
      date
    )
  }

  getMonthNames(format?: MonthNameFormat): string[] {
    const arr: string[] = []

    for (let i = 0; i < 12; ++i) {
      arr.push(this.getMonthName(i, format))
    }

    return arr
  }
}
