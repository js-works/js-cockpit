import {
  formatDay,
  formatWeekNumber,
  formatYear,
  getWeekNumber,
  getFirstDayOfWeek,
  getMonthName,
  getWeekdayName,
  getWeekendDays
} from './calendar-utils';

export { CalendarLocalizer };

class CalendarLocalizer {
  readonly #locale: string;
  readonly #direction: 'ltr' | 'rtl';
  readonly #getWeekNumber: (date: Date) => number;

  constructor(params: {
    locale: string;
    direction: 'ltr' | 'rtl';
    getWeekNumber?: ((date: Date) => number) | null;
  }) {
    this.#locale = params.locale;
    this.#direction = params.direction;

    this.#getWeekNumber =
      params.getWeekNumber || ((date) => getWeekNumber(this.#locale, date));
  }

  getLocale(): string {
    return this.#locale;
  }

  getDirection(): 'ltr' | 'rtl' {
    return this.#direction;
  }

  getWeekNumber(date: Date) {
    return this.#getWeekNumber(date);
  }

  getFirstDayOfWeek(): number {
    return getFirstDayOfWeek(this.#locale);
  }

  formatDay(day: number) {
    return formatDay(this.#locale, day);
  }

  formatWeekNumber(weekNumber: number) {
    return formatWeekNumber(this.#locale, weekNumber);
  }

  formatYear(year: number) {
    return formatYear(this.#locale, year);
  }

  getMonthName(month: number, format: 'long' | 'short' | 'narrow' = 'long') {
    return getMonthName(this.#locale, month, format);
  }

  getWeekendDays(): Readonly<number[]> {
    return getWeekendDays(this.#locale);
  }

  getWeekdayName(day: number, format: 'long' | 'short' | 'narrow' = 'long') {
    return getWeekdayName(this.#locale, day, format);
  }
}
