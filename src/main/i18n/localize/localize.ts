import { registerTranslation } from '@shoelace-style/localize'

import {
  LocalizeController,
  Translation as LocalizeTranslation
} from '@shoelace-style/localize'

import { ReactiveControllerHost } from 'lit'

import {
  formatDate,
  formatNumber,
  formatRelativeTime,
  getCalendarWeek,
  getFirstDayOfWeek,
  getLocaleInfo,
  getWeekendDays,
  parseDate,
  parseNumber
} from './localize-utils'

export {
  addToDict,
  Category,
  ComponentLocalizer,
  Locale,
  Localizer,
  TermKey,
  Translation
}

const defaultLocale = 'en-US'
const regexCategory = /^[a-z][a-zA-Z0-9]*(\.[a-z][a-zA-Z0-9]*)*$/
const regexTermKey = /^[a-z][a-zA-Z0-9]*(\.[a-z][a-zA-Z0-9]*)*$/
const categoryTermSeparator = '::'

type Locale = string
type Category = string
type TermKey = string

type TermValue<T extends Translation> =
  | string
  | ((params: any, localizer: Localizer<T>) => string) // TODO!!!!!!

type Translation<T = any> = T extends {
  // T extends Record<Category, Record<TermKey, TermValue<T>>>
  [C in keyof T]: {
    [K in keyof T[C]]: TermValue<T>
  }
}
  ? T
  : //  : never
    never

interface NumberFormat extends Intl.NumberFormatOptions {}
interface DateFormat extends Intl.DateTimeFormatOptions {}
type RelativeTimeFormat = Intl.RelativeTimeFormatOptions
type RelativeTimeUnit = Intl.RelativeTimeFormatUnit
type DayNameFormat = 'long' | 'short' | 'narrow'
type MonthNameFormat = 'long' | 'short' | 'narrow'

class Localizer<T extends Translation> {
  #getLocale: () => Locale

  static #translate: (
    locale: Locale,
    category: Category,
    termKey: TermKey,
    params: Record<string, any> | null,
    i18n: Localizer<any>
  ) => string

  static {
    const element = Object.assign(document.createElement('div'), 
      {
        addController() {},
        removeController() {},
        requestUpdate() {},
        updateComplete: Promise.resolve(true)
      }
    )

    const localizeController = new LocalizeController(element)

    Localizer.#translate = (locale, category, termKey, params, i18n) => {
      const key = `${category}${categoryTermSeparator}${termKey}`
      element.lang = locale

      return localizeController.term(key, params, i18n)
    }
  }

  constructor(getLocale: () => Locale) {
    this.#getLocale = getLocale
  }

  getLocale(): Locale {
    return this.#getLocale()
  }

  translate<C extends keyof T>(
    category: C
  ): <K extends keyof T[C]>(termKey: K, params?: FirstArgument<T[C][K]>) => string

  translate<C extends keyof T, K extends keyof T[C]>(
    category: C,
    termKey: keyof T[C],
    params?: FirstArgument<T[C][K]>
  ): string
  
  translate(category: any, termKey?: any, params?: any): any {
    if (arguments.length === 1) {
      return (key: any, params?: any) => this.translate(category, key, params)
    }

    return Localizer.#translate(
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

class ComponentLocalizer<T extends Translation> extends Localizer<T> {
  #element: HTMLElement
  #localizeController: LocalizeController

  constructor(element: HTMLElement & ReactiveControllerHost) {
    super(() => this.#localizeController.lang()) 
    this.#element = element
    this.#localizeController = new LocalizeController(element)
  }

  getDirection(): 'ltr' | 'rtl' {
    const ret = this.#localizeController.dir()

    return ret === 'rtl' ? 'rtl' : 'ltr'
  }
}

type FirstArgument<T> = T extends (firstArg: infer A, ...rest: any[]) => any
  ? A
  : never

function addToDict<T extends Translation>(
  translationsByLocale: Record<Locale, T>
) {
  for (const [locale, translations] of <any>(
    Object.entries(translationsByLocale)
  )) {
    const convertedTranslations: LocalizeTranslation = {
      $code: locale,
      $name: '???', // TODO
      $dir: 'ltr' // TODO
    }

    for (const category of Object.keys(translations)) {
      for (const termKey of Object.keys(translations[category])) {
        const key = `${category}${categoryTermSeparator}${termKey}`

        ;(convertedTranslations as any)[key] = translations[category][termKey]
      }
    }

    registerTranslation(convertedTranslations)
  }
}
