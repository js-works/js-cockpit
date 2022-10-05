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

  getMonthTitle(year: number, month: number) {
    const date = new Date(year, month, 1);

    return ucFirst(
      new Intl.DateTimeFormat(this.#locale, {
        year: 'numeric',
        month: 'long'
      }).format(date)
    );
  }

  getYearTitle(year: number) {
    const date = new Date(year, 0, 1);

    return new Intl.DateTimeFormat(this.#locale, {
      year: 'numeric'
    }).format(date);
  }

  getDecadeTitle(year: number, yearCount = 10, offset = 0) {
    const startYear = Math.floor(year / 10) * 10;

    return Intl.DateTimeFormat(this.#locale, {
      year: 'numeric'
      /* @ts-ignore */ // TODO!!!
    }).formatRange(
      new Date(startYear + offset, 1, 1),
      new Date(startYear + offset + yearCount - 1, 1, 1)
    );
  }

  getCenturyTitle(year: number, decadeCount = 10, offset = 0) {
    const startYear = Math.floor(year / 100) * 100;
    return this.getDecadeTitle(startYear, decadeCount * 10, offset * 10);
  }
}

// === helpers =======================================================

function ucFirst(s: string): string {
  const length = s.length;

  if (length === 0) {
    return s;
  } else if (length === 1) {
    return s.toUpperCase();
  } else {
    return s[0].toUpperCase() + s.slice(1);
  }
}
