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
} from './i18n-utils'

import {
  registerTranslation,
  LocalizeController
} from '@shoelace-style/localize'

import { ReactiveControllerHost } from 'lit'

// === exports =======================================================

export { addToDict, I18nFacade }

export type {
  DateFormat,
  DayNameFormat,
  FullTranslations,
  MonthNameFormat,
  NumberFormat,
  PartialTranslations,
  RelativeTimeFormat,
  RelativeTimeUnit,
  Translations
}

// === exported types ================================================

declare global {
  namespace Localize {
    interface Translations {}
  }
}

type FullTranslations<B extends string> = {
  [L: string]: {
    [C in keyof Localize.Translations &
      `${B}.${string}`]: Localize.Translations[C]
  }
}

type PartialTranslations<B extends string> = {
  [L: string]: {
    [C in keyof Localize.Translations & `${B}.${string}`]?: Partial<
      Localize.Translations[C]
    >
  }
}

interface NumberFormat extends Intl.NumberFormatOptions {}
interface DateFormat extends Intl.DateTimeFormatOptions {}
type RelativeTimeFormat = Intl.RelativeTimeFormatOptions
type RelativeTimeUnit = Intl.RelativeTimeFormatUnit
type DayNameFormat = 'long' | 'short' | 'narrow'
type MonthNameFormat = 'long' | 'short' | 'narrow'

// === local types ===================================================

type Locale = string
type Category = string
type TermKey = string
type Direction = 'ltr' | 'rtl'
type TermValue = string | ((params: any, localizer: I18nFacade) => string)

type Translations<
  T extends Record<Category, Record<TermKey, TermValue>> = Record<
    Category,
    Record<TermKey, TermValue>
  >
> = T

type AllowedTranslations = {
  [L: Locale]: {
    [C in keyof Localize.Translations]?: {
      [K in keyof Localize.Translations[C]]?: Localize.Translations[C][K]
    }
  }
}

type FirstArgument<T> = T extends (firstArg: infer A, ...rest: any[]) => any
  ? A
  : never

// === constants =====================================================

const regexCategory = /^[a-z][a-zA-Z0-9\.]*$/
const regexTermKey = /^[a-z][a-zA-Z0-9]*$/
const categoryTermSeparator = '/'

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
  )

  const fakeLocalizeController = new LocalizeController(fakeElem)

  return <
    C extends keyof Localize.Translations,
    K extends keyof Localize.Translations[C]
  >(
    locale: Locale,
    category: C & Category,
    termKey: K & TermKey,
    params: FirstArgument<Localize.Translations[C][K]>,
    i18n: I18nFacade
  ) => {
    const key = `${category}${categoryTermSeparator}${termKey}` // TODO!!!
    fakeElem.lang = locale

    return fakeLocalizeController.term(key, params, i18n)
  }
})()

class I18nFacade {
  #getLocale: () => Locale

  constructor(getLocale: () => Locale) {
    this.#getLocale = getLocale
  }

  getLocale(): Locale {
    return this.#getLocale()
  }

  getDirection(): Direction {
    return getDirection(this.#getLocale())
  }

  translate<U extends Translations>(): <
    C extends keyof U,
    K extends keyof U[C]
  >(
    category: C,
    termKey: K,
    params?: FirstArgument<U[C][K]>
  ) => string

  translate<C extends keyof Localize.Translations>(
    category: C
  ): <K extends keyof Localize.Translations[C]>(
    termKey: K,
    params?: FirstArgument<Localize.Translations[C][K]>
  ) => string

  translate<
    C extends keyof Localize.Translations,
    K extends keyof Localize.Translations[C]
  >(
    category: C,
    termKey: keyof Localize.Translations[C],
    params?: FirstArgument<Localize.Translations[C][K]>
  ): string

  translate(category?: any, termKey?: any, params?: any): any {
    if (arguments.length === 0) {
      return (category: any, key: any, params: any) =>
        this.translate(category, key, params)
    } else if (arguments.length === 1) {
      return (key: any, params?: any) => this.translate(category, key, params)
    }

    return translate(
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

function addToDict(...translationsList: AllowedTranslations[]): void {
  for (const translations of translationsList) {
    for (const locale of Object.keys(translations)) {
      const translation = translations[locale] as Translations

      const convertedTranslation: any = {
        $code: locale,
        $name: new Intl.DisplayNames(locale, { type: 'language' }).of(locale),
        $dir: getDirection(locale)
      }

      for (const category of Object.keys(translation)) {
        if (!category.match(regexCategory)) {
          throw Error(`Illegal translations category name "${category}"`)
        }

        if (translation[category]) {
          const terms = translation[category]

          for (const termKey of Object.keys(translation[category])) {
            if (!termKey.match(regexTermKey)) {
              throw Error(
                `Illegal ${locale}, ${category} translation key "${termKey}"`
              )
            }
            convertedTranslation[
              `${category}${categoryTermSeparator}${termKey}`
            ] = terms[termKey]
          }
        }
      }

      registerTranslation(convertedTranslation)
    }
  }
}
