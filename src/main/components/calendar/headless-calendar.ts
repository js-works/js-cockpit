// === exports =======================================================

export { HeadlessCalendar };

// === exported types ================================================

namespace HeadlessCalendar {
  export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

  export type Localization = Readonly<{
    dayNames: readonly string[];
    dayNamesShort: readonly string[];
    monthNames: readonly string[];
    monthNamesShort: readonly string[];
    firstDayOfWeek: Weekday;
    weekendDays: readonly Weekday[];
    getCalendarWeek: (date: Date, firstDayOfWeek: Weekday) => number;
  }>;

  export type Options = Readonly<{
    localization: Localization;
    minDate: Date | null;
    maxDate: Date | null;
    disableWeekend: boolean;
    alwaysShow42Days: boolean;
  }>;

  export type PartialOptions = Partial<
    Omit<Options, 'localization'> & {
      localization: Partial<Localization>;
    }
  >;

  export type DayData = Readonly<{
    year: number;
    month: number;
    day: number;
    weekNumber: number;
    current: boolean; // true if today, else false
    disabled: boolean;
    outOfMinMaxRange: boolean;
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
    prevMonthDisabled: boolean;
    nextMonthDisabled: boolean;
    dayNames: readonly string[];
    dayNamesShort: readonly string[];
    monthNames: readonly string[];
    monthNamesShort: readonly string[];
  }>;

  export type YearView = Readonly<{
    year: number;
    months: readonly MonthData[];
    prevYearDisabled: boolean;
    nextYearDisabled: boolean;
    monthNames: readonly string[];
    monthNamesShort: readonly string[];
  }>;

  export type DecadeView = Readonly<{
    startYear: number;
    endYear: number;
    years: readonly YearData[];
    prevDecadeDisabled: boolean;
    nextDecadeDisabled: boolean;
  }>;
}

// === local types ===================================================

// === local data ====================================================

const defaultDayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const defaultMonthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const defaultLocalization: HeadlessCalendar.Localization = {
  dayNames: defaultDayNames,
  dayNamesShort: defaultDayNames.map((it) => it.substring(0, 3)),
  monthNames: defaultMonthNames,
  monthNamesShort: defaultMonthNames.map((it) => it.substring(0, 3)),
  firstDayOfWeek: 0,
  weekendDays: [0, 6],
  getCalendarWeek
};

const defaultOptions: HeadlessCalendar.Options = {
  localization: defaultLocalization,
  minDate: null,
  maxDate: null,
  disableWeekend: false,
  alwaysShow42Days: false
};

// === HeadlessCalendar ==============================================

class HeadlessCalendar {
  #options: HeadlessCalendar.Options = defaultOptions;

  static #mergeOptions(
    options: HeadlessCalendar.Options,
    partialOptions: HeadlessCalendar.PartialOptions
  ): HeadlessCalendar.Options {
    const newOptions = { ...options, ...partialOptions };

    if (partialOptions.localization) {
      newOptions.localization = {
        ...options.localization,
        ...partialOptions.localization
      };
    }

    return newOptions as HeadlessCalendar.Options;
  }

  constructor(options?: HeadlessCalendar.PartialOptions) {
    if (options) {
      this.#options = HeadlessCalendar.#mergeOptions(defaultOptions, options);
    }
  }

  vary(options: HeadlessCalendar.PartialOptions): HeadlessCalendar {
    return new HeadlessCalendar(
      HeadlessCalendar.#mergeOptions(this.#options, options)
    );
  }

  getMonthView(year: number, month: number): HeadlessCalendar.MonthView {
    // we also allow month values less than 0 and greater than 11
    const n = year * 12 + month;
    year = Math.floor(n / 12);
    month = n % 12;

    const options = this.#options;
    const localization = options.localization;
    const firstDayOfWeek = localization.firstDayOfWeek;
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

    const days: HeadlessCalendar.DayData[] = [];

    for (let i = 0; i < daysToShow; ++i) {
      let cellYear: number;
      let cellMonth: number;
      let cellDay: number;
      let inOtherMonth = false;

      if (i < remainingDaysOfLastMonth) {
        cellDay = dayCountOfLastMonth - remainingDaysOfLastMonth + i + 1;
        cellMonth = month === 0 ? 11 : month - 1;
        cellYear = month === 0 ? year - 1 : year;
        inOtherMonth = true;
      } else {
        cellDay = i - remainingDaysOfLastMonth + 1;

        if (cellDay > dayCountOfCurrMonth) {
          cellDay = cellDay - dayCountOfCurrMonth;
          cellMonth = month === 11 ? 1 : month + 1;
          cellYear = month === 11 ? year + 1 : year;
          inOtherMonth = true;
        } else {
          cellMonth = month;
          cellYear = year;
          inOtherMonth = false;
        }
      }

      days.push({
        year: cellYear,
        month: cellMonth,
        day: cellDay,
        disabled: false, // TODO!!!
        outOfMinMaxRange: false, // TODO!!!
        weekNumber: getCalendarWeek(
          new Date(cellYear, cellMonth, cellDay),
          firstDayOfWeek
        ),

        current:
          cellYear === currYear &&
          cellMonth === currMonth &&
          cellDay === currDay
      });
    }

    return {
      year,
      month,
      dayNames: localization.dayNames,
      dayNamesShort: localization.dayNamesShort,
      monthNames: localization.monthNames,
      monthNamesShort: localization.monthNamesShort,
      days,
      prevMonthDisabled: false, // TODO!!
      nextMonthDisabled: false // TODO!!!
    };
  }

  getYearView(year: number): HeadlessCalendar.YearView {
    const localization = this.#options.localization;
    const months: HeadlessCalendar.MonthData[] = [];
    const currYear = new Date().getFullYear();
    const currMonth = new Date().getMonth();

    for (let month = 0; month < 11; ++month) {
      months.push({
        year,
        month,
        current: year === currYear && month === currMonth,
        disabled: false // TODO!!!
      });
    }

    return {
      year,
      monthNames: localization.monthNames,
      monthNamesShort: localization.monthNamesShort,
      months,
      prevYearDisabled: false, // TODO!!!
      nextYearDisabled: false // TODO!!!
    };
  }

  getDecadeView(year: number): HeadlessCalendar.DecadeView {
    const startYear = year - (year % 10);
    const endYear = startYear + 11;
    const currYear = new Date().getFullYear();

    const years: HeadlessCalendar.YearData[] = [];

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

function getCalendarWeek(date: Date, firstDayOfWeek: number) {
  // Code is based on this solution here:
  // https://stackoverflow.com/questions/23781366/date-get-week-number-for-custom-week-start-day
  // TODO - check algorithm

  const target = new Date(date);

  // Replaced offset of (6) with (7 - firstDayOfWeek)
  const dayNum = (date.getDay() + 7 - firstDayOfWeek) % 7;
  target.setDate(target.getDate() - dayNum + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);

  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }

  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}
