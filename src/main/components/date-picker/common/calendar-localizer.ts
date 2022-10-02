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
  #getLocale: () => string;
  #getDirection: () => 'ltr' | 'rtl';
  #getWeekNumber: (date: Date) => number;

  constructor(params: {
    getLocale: () => string;
    getDirection: () => 'ltr' | 'rtl';
    getWeekNumber?: ((date: Date) => number) | null;
  }) {
    this.#getLocale = params.getLocale;
    this.#getDirection = params.getDirection;
    this.#getWeekNumber =
      params.getWeekNumber ||
      ((date) => getWeekNumber(this.#getLocale(), date));
  }

  getLocale(): string {
    return this.#getLocale();
  }

  getDirection(): 'ltr' | 'rtl' {
    return this.#getDirection();
  }

  getWeekNumber(date: Date) {
    return this.#getWeekNumber(date);
  }

  getFirstDayOfWeek(): number {
    return getFirstDayOfWeek(this.#getLocale());
  }

  formatDay(day: number) {
    return formatDay(this.#getLocale(), day);
  }

  formatWeekNumber(weekNumber: number) {
    return formatWeekNumber(this.#getLocale(), weekNumber);
  }

  formatYear(year: number) {
    return formatYear(this.#getLocale(), year);
  }

  getMonthName(month: number, format: 'long' | 'short' | 'narrow' = 'long') {
    return getMonthName(this.#getLocale(), month, format);
  }

  getWeekendDays(): Readonly<number[]> {
    return getWeekendDays(this.#getLocale());
  }

  getWeekdayName(day: number, format: 'long' | 'short' | 'narrow' = 'long') {
    return getWeekdayName(this.#getLocale(), day, format);
  }
}
