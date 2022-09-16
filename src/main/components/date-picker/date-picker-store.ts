export { DatePickerStore };

namespace DatePickerStore {
  export type SelectionMode =
    | 'date'
    | 'dates'
    | 'time'
    | 'dateTime'
    // | 'dateRange'
    // | 'week'
    // | 'weeks'
    | 'month'
    | 'months'
    | 'year'
    | 'years';

  export type Scene = 'month' | 'year' | 'decade' | 'time';
}

class DatePickerStore {
  #selectionMode: DatePickerStore.SelectionMode = 'date';
  #selection = new Set<string>();
  #scene: DatePickerStore.Scene = 'month';
  #activeYear = new Date().getFullYear();
  #activeMonth = new Date().getMonth();
  #activeDay = new Date().getDate();
  #activeHour = new Date().getHours();
  #activeMinute = new Date().getMinutes();
  #requestUpdate: () => void;

  constructor(requestUpdate: () => void) {
    this.#requestUpdate = requestUpdate;
  }

  setSelectionMode(mode: DatePickerStore.SelectionMode) {
    if (mode === this.#selectionMode) {
      return;
    }

    this.#selectionMode = mode;
    this.#selection.clear();

    switch (mode) {
      case 'year':
      case 'years':
        this.#scene = 'decade';
        break;

      case 'month':
      case 'months':
        this.#scene = 'year';
        break;

      case 'time':
        this.#scene = 'time';
        break;

      default:
        this.#scene = 'month';
    }

    this.#requestUpdate();
  }

  getSelectionMode() {
    return this.#selectionMode;
  }

  getScene(): DatePickerStore.Scene {
    return this.#scene;
  }

  isTimeVisible(): boolean {
    return this.#selectionMode === 'time' || this.#selectionMode === 'dateTime';
  }

  getActiveYear() {
    return this.#activeYear;
  }

  getActiveMonth() {
    return this.#activeMonth;
  }

  getActiveHour() {
    return this.#activeHour;
  }

  setActiveHour(hour: number) {
    this.#activeHour = hour;
    this.#requestUpdate();
  }

  getActiveMinute() {
    return this.#activeMinute;
  }

  setActiveMinute(minute: number) {
    this.#activeMinute = minute;
    this.#requestUpdate();
  }

  hasSelectedYear(year: number) {
    return this.#selection.has(getYearString(year));
  }

  hasSelectedMonth(year: number, month: number) {
    return this.#selection.has(getYearMonthString(year, month));
  }

  hasSelectedDay(year: number, month: number, day: number) {
    return this.#selection.has(getYearMonthDayString(year, month, day));
  }

  getValue() {
    if (this.#selectionMode === 'dateTime') {
      const dateString = Array.from(this.#selection)[0];

      const timeString = getHourMinuteString(
        this.#activeHour,
        this.#activeMinute
      );

      return !dateString ? '' : `${dateString}T${timeString}`;
    } else if (this.#selectionMode === 'time') {
      return getHourMinuteString(this.#activeHour, this.#activeMinute);
    } else {
      return Array.from(this.#selection).sort().join(',');
    }
  }

  clickSceneSwitch() {
    if (this.#scene === 'decade') {
      throw new Error('Illegal operation ' + this.clickSceneSwitch.name);
    }

    this.#scene = this.#scene === 'year' ? 'decade' : 'year';

    this.#requestUpdate();
  }

  clickPrev() {
    this.#clickPrevOrNext(-1);
  }

  clickNext() {
    this.#clickPrevOrNext(1);
  }

  #clickPrevOrNext(signum: number) {
    switch (this.#scene) {
      case 'month': {
        let n = this.#activeYear * 12 + this.#activeMonth + signum;

        this.#activeYear = Math.floor(n / 12);
        this.#activeMonth = n % 12;
        break;
      }

      case 'year':
        this.#activeYear += signum;
        break;

      case 'decade':
        this.#activeYear += signum * 11;
        break;
    }

    this.#requestUpdate();
  }

  clickDay(year: number, month: number, day: number) {
    if (this.#scene !== 'month') {
      throw new Error('Illegal operation: ' + this.clickDay.name);
    }

    const dateString = getYearMonthDayString(year, month, day);

    switch (this.#selectionMode) {
      case 'date':
      case 'dateTime':
        this.#toggleSelected(dateString, true);
        break;

      case 'dates':
        this.#toggleSelected(dateString);
        break;
    }

    this.#requestUpdate();
  }

  clickMonth(year: number, month: number) {
    if (this.#selectionMode !== 'month' && this.#selectionMode !== 'months') {
      this.#activeYear = year;
      this.#activeMonth = month;
      this.#scene = 'month';
    } else {
      const monthString = getYearMonthString(year, month);

      switch (this.#selectionMode) {
        case 'month':
          this.#toggleSelected(monthString, true);
          break;

        case 'months':
          this.#toggleSelected(monthString);
          break;
      }
    }

    this.#requestUpdate();
  }

  clickYear(year: number) {
    if (this.#selectionMode !== 'year' && this.#selectionMode !== 'years') {
      this.#activeYear = year;
      this.#scene = 'year';
    } else {
      const yearString = getYearString(year);

      switch (this.#selectionMode) {
        case 'year':
          this.#toggleSelected(yearString, true);
          break;

        case 'years':
          this.#toggleSelected(yearString);
          break;
      }
    }

    this.#requestUpdate();
  }

  #toggleSelected = (value: string, clear = false) => {
    const hasValue = this.#selection.has(value);

    if (clear) {
      this.#selection.clear();
    }

    if (!hasValue) {
      this.#selection.add(value);
    } else if (!clear) {
      this.#selection.delete(value);
    }

    this.#requestUpdate();
  };
}

// === helpers =======================================================

function getYearMonthDayString(year: number, month: number, day: number) {
  const y = year.toString().padStart(4, '0');
  const m = (month + 1).toString().padStart(2, '0');
  const d = day.toString().padStart(2, '0');

  return `${y}-${m}-${d}`;
}

function getYearMonthString(year: number, month: number) {
  const y = year.toString().padStart(4, '0');
  const m = (month + 1).toString().padStart(2, '0');

  return `${y}-${m}`;
}

/* Needed in future
function getYearWeekString(year: number, week: number) {
  const y = year.toString().padStart(4, '0');
  const w = week.toString().padStart(2, '0');

  return `${y}-W${w}`;
}
*/

function getYearString(year: number) {
  return year.toString();
}

function getHourMinuteString(hour: number, minute: number) {
  const h = hour.toString().padStart(2, '0');
  const m = minute.toString().padStart(2, '0');

  return `${h}:${m}`;
}
