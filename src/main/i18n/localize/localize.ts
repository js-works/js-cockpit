import type { ReactiveControllerHost } from 'lit'

import {
  formatDate,
  formatNumber,
  formatRelativeTime,
  getCalendarWeek,
  getFirstDayOfWeek,
  getWeekendDays,
  parseDate,
  parseNumber
} from './localize-utils'

export {
  Adapter,
  Category,
  ComponentLocalizer,
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

type Translations<T extends Translation> = Record<Locale, T>

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

interface Adapter {
  translate: (
    locale: Locale,
    category: Category,
    termKey: TermKey,
    params?: Record<string, any>,
    i18n?: Localizer<any>
  ) => string

  observeComponent(element: HTMLElement & ReactiveControllerHost): {
    getLocale(): Locale
    getDirection(): Direction
  }
}

abstract class Localizer<T extends Translation> {
  #getLocale: () => Locale
  #adapter: Adapter

  constructor(getLocale: () => Locale, adapter: Adapter) {
    this.#getLocale = getLocale
    this.#adapter = adapter
  }

  getLocale(): Locale {
    return this.#getLocale()
  }

  translate<U extends Translation = any>(): <
    C extends keyof U,
    K extends keyof U[C]
  >(
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
      this
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

abstract class ComponentLocalizer<T extends Translation> extends Localizer<T> {
  #element: HTMLElement
  #getDirection: () => Direction

  constructor(element: HTMLElement & ReactiveControllerHost, adapter: Adapter) {
    const { getLocale, getDirection } = adapter.observeComponent(element)
    super(getLocale, adapter)
    this.#element = element
    this.#getDirection = getDirection
  }

  getDirection(): Direction {
    const ret = this.#getDirection()

    return ret === 'rtl' ? 'rtl' : 'ltr'
  }
}

type FirstArgument<T> = T extends (firstArg: infer A, ...rest: any[]) => any
  ? A
  : never
