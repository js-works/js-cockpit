// === exports =======================================================

export { Calendar };

// === exported types ================================================

namespace Calendar {
  export type Options = Readonly<{
    firstDayOfWeek: number;
    weekendDays: readonly number[];
    getCalendarWeek: (date: Date, firstDayOfWeek: number) => number;
    minDate: Date | null;
    maxDate: Date | null;
    disableWeekend: boolean;
    alwaysShow42Days: boolean;
  }>;

  export type DayData = Readonly<{
    year: number;
    month: number;
    day: number;
    weekNumber: number;
    current: boolean; // true if today, else false
    weekend: boolean; // true if weekend day, else false
    disabled: boolean;
    outOfMinMaxRange: boolean;
    adjacent: boolean;
  }>;

  export type MonthData = Readonly<{
    year: number;
    month: number; // 0 -> january, ..., 11 -> december
    current: boolean; // true if current month, else false
    disabled: boolean;
  }>;

  export type YearData = Readonly<{
    year: number;
    current: boolean; // true if current year, else false
    disabled: boolean;
  }>;

  export type MonthView = Readonly<{
    year: number;
    month: number; // 0 -> january, ..., 11 -> december
    days: DayData[];
    weekdays: number[];
    prevMonthDisabled: boolean;
    nextMonthDisabled: boolean;
  }>;

  export type YearView = Readonly<{
    year: number;
    months: readonly MonthData[];
    prevYearDisabled: boolean;
    nextYearDisabled: boolean;
  }>;

  export type DecadeView = Readonly<{
    startYear: number;
    endYear: number;
    years: readonly YearData[];
    prevDecadeDisabled: boolean;
    nextDecadeDisabled: boolean;
  }>;
}

// === Calendar ==============================================

class Calendar {
  #options: Calendar.Options;

  constructor(options: Calendar.Options) {
    this.#options = options;
  }

  vary(options: Partial<Calendar.Options>): Calendar {
    return new Calendar({ ...this.#options, ...options });
  }

  getMonthView(year: number, month: number): Calendar.MonthView {
    // we also allow month values less than 0 and greater than 11
    const n = year * 12 + month;
    year = Math.floor(n / 12);
    month = n % 12;

    const options = this.#options;
    const firstDayOfWeek = options.firstDayOfWeek;
    const firstWeekdayOfMonth = new Date(year, month, 1).getDay();
    const now = new Date();
    const currYear = now.getFullYear();
    const currMonth = now.getMonth();
    const currDay = now.getDate();
    const dayCountOfCurrMonth = getDayCountOfMonth(year, month);
    const dayCountOfLastMonth = getDayCountOfMonth(year, month - 1);

    const remainingDaysOfLastMonth =
      firstDayOfWeek <= firstWeekdayOfMonth
        ? firstWeekdayOfMonth - firstDayOfWeek
        : 6 - (firstDayOfWeek - firstWeekdayOfMonth);

    let daysToShow = 42;

    if (!options.alwaysShow42Days) {
      daysToShow = getDayCountOfMonth(year, month) + remainingDaysOfLastMonth;

      if (daysToShow % 7 > 0) {
        daysToShow += 7 - (daysToShow % 7);
      }
    }

    const days: Calendar.DayData[] = [];

    for (let i = 0; i < daysToShow; ++i) {
      let cellYear: number;
      let cellMonth: number;
      let cellDay: number;
      let adjacent = false;

      if (i < remainingDaysOfLastMonth) {
        cellDay = dayCountOfLastMonth - remainingDaysOfLastMonth + i + 1;
        cellMonth = month === 0 ? 11 : month - 1;
        cellYear = month === 0 ? year - 1 : year;
        adjacent = true;
      } else {
        cellDay = i - remainingDaysOfLastMonth + 1;

        if (cellDay > dayCountOfCurrMonth) {
          cellDay = cellDay - dayCountOfCurrMonth;
          cellMonth = month === 11 ? 1 : month + 1;
          cellYear = month === 11 ? year + 1 : year;
          adjacent = true;
        } else {
          cellMonth = month;
          cellYear = year;
          adjacent = false;
        }
      }

      const cellDate = new Date(cellYear, cellMonth, cellDay);
      const weekend = options.weekendDays.includes(cellDate.getDay());

      const outOfMinMaxRange = !inDateRange(
        cellDate,
        options.minDate,
        options.maxDate
      );

      days.push({
        year: cellYear,
        month: cellMonth,
        day: cellDay,
        disabled: (options.disableWeekend && weekend) || outOfMinMaxRange,
        outOfMinMaxRange,
        adjacent,
        weekend,

        weekNumber: options.getCalendarWeek(
          new Date(cellYear, cellMonth, cellDay),
          firstDayOfWeek
        ),

        current:
          cellYear === currYear &&
          cellMonth === currMonth &&
          cellDay === currDay
      });
    }

    const weekdays: number[] = [];

    for (let i = 0; i < 7; ++i) {
      weekdays.push((i + options.firstDayOfWeek) % 7);
    }

    return {
      year,
      month,
      days,
      weekdays,
      prevMonthDisabled: false, // TODO!!
      nextMonthDisabled: false // TODO!!!
    };
  }

  getYearView(year: number): Calendar.YearView {
    const months: Calendar.MonthData[] = [];
    const currYear = new Date().getFullYear();
    const currMonth = new Date().getMonth();

    for (let month = 0; month < 12; ++month) {
      months.push({
        year,
        month,
        current: year === currYear && month === currMonth,
        disabled: false // TODO!!!
      });
    }

    return {
      year,
      months,
      prevYearDisabled: false, // TODO!!!
      nextYearDisabled: false // TODO!!!
    };
  }

  getDecadeView(year: number): Calendar.DecadeView {
    const startYear = year - (year % 10);
    const endYear = startYear + 11;
    const currYear = new Date().getFullYear();
    const years: Calendar.YearData[] = [];

    for (let cellYear = startYear; cellYear <= endYear; ++cellYear) {
      years.push({
        current: cellYear === currYear,
        year: cellYear,
        disabled: false // TODO!!!!!!!!!
      });
    }

    return {
      startYear,
      endYear,
      years,
      prevDecadeDisabled: false, // TODO!!!
      nextDecadeDisabled: false // TODO!!!
    };
  }
}

// === helpers =======================================================

function inDateRange(date: Date, start: Date | null, end: Date | null) {
  if (start === null && end === null) {
    return true;
  }

  const toNumber = (date: Date) =>
    date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate();

  const val = toNumber(date);

  if (start === null) {
    return val <= toNumber(end!);
  } else if (end === null) {
    return val >= toNumber(start!);
  } else {
    return val >= toNumber(start) && val <= toNumber(end);
  }
}

function getDayCountOfMonth(year: number, month: number) {
  // we also allow month values less than 0 and greater than 11
  const n = year * 12 + month;
  year = Math.floor(n / 12);
  month = n % 12;

  if (month !== 1) {
    return (month % 7) % 2 === 0 ? 31 : 30;
  }

  return year % 4 !== 0 || (year % 100 === 0 && year % 400 !== 0) ? 28 : 29;
}
