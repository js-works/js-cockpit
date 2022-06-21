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

export {
  validateTranslations,
  AbstractLocalizer,
  Adapter,
  Category,
  DateFormat,
  DayNameFormat,
  Direction,
  Locale,
  Localizer,
  MonthNameFormat,
  NumberFormat,
  RelativeTimeFormat,
  RelativeTimeUnit,
  TermKey,
  TermValue,
  Translation,
  Translations,
  PartialTranslation,
  PartialTranslations
}

type Locale = string
type Category = string
type TermKey = string
type Direction = 'ltr' | 'rtl'
type TermValue = string | ((params: any, localizer: Localizer<any>) => string)

type Translation = {
  [C: Category]: {
    [K: TermKey]: TermValue
  }
}

type Translations<T extends Translation = any> = Record<Locale, T>

type PartialTranslation<T extends Translation> = {
  [C in keyof T]?: {
    [K in keyof T[C]]?: T[C][K]
  }
}

type PartialTranslations<T extends Translation> = Record<
  Locale,
  PartialTranslation<T>
>

interface NumberFormat extends Intl.NumberFormatOptions {}
interface DateFormat extends Intl.DateTimeFormatOptions {}
type RelativeTimeFormat = Intl.RelativeTimeFormatOptions
type RelativeTimeUnit = Intl.RelativeTimeFormatUnit
type DayNameFormat = 'long' | 'short' | 'narrow'
type MonthNameFormat = 'long' | 'short' | 'narrow'

interface Localizer<T extends Translation = any> {
  getLocale(): Locale
  getDirection(): Direction

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

  parseNumber(numberString: string): number | null
  parseDate(dateString: string): Date | null
  formatNumber(value: number, format?: NumberFormat): string
  formatDate(value: Date, format?: DateFormat | null): string

  formatRelativeTime(
    value: number,
    unit: RelativeTimeUnit,
    format?: RelativeTimeFormat
  ): string

  // 0 to 6, 0 means Sunday
  getFirstDayOfWeek(): number

  // array of integer form 0 to 6
  getWeekendDays(): Readonly<number[]>

  getCalendarWeek(date: Date): number // 1 to 53
  getDayName(index: number, format?: DayNameFormat): string
  getDayNames(format?: DayNameFormat): string[]
  getMonthName(index: number, format?: MonthNameFormat): string
  getMonthNames(format?: MonthNameFormat): string[]
}

type Adapter = {
  translate: (
    locale: Locale,
    category: Category,
    termKey: TermKey,
    params?: Record<string, any>,
    i18n?: Localizer
  ) => string
}

// === local types ===================================================

type FirstArgument<T> = T extends (firstArg: infer A, ...rest: any[]) => any
  ? A
  : never

// === constants =====================================================

const regexCategory = /^[a-z][a-zA-Z0-9\.]*$/
const regexTermKey = /^[a-z][a-zA-Z0-9]*$/

// === validateTranslations ==========================================

function validateTranslations(translations: Translations): null | Error {
  let ret: null | Error = null

  try {
    for (const locale of Object.keys(translations)) {
      const translation = translations[locale]

      for (const category of Object.keys(translation)) {
        if (!category.match(regexCategory)) {
          throw Error(`Illegal translations category name "${category}"`)
        }

        for (const termKey of Object.keys(translation[category])) {
          if (!termKey.match(regexTermKey)) {
            throw Error(`Illegal translation key "${termKey}"`)
          }
        }
      }
    }
  } catch (error) {
    ret = error as Error
  }

  return ret
}

// === AbstractLocalizer =============================================

abstract class AbstractLocalizer<T extends Translation>
  implements Localizer<T>
{
  #getLocale: () => Locale
  #adapter: Adapter

  constructor(getLocale: () => Locale, adapter: Adapter) {
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
      category as string,
      termKey as string,
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
