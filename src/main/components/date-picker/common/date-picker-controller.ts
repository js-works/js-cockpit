import type { ReactiveControllerHost } from 'lit';
import { CalendarLocalizer } from './calendar-localizer';

import {
  getDecadeTitle,
  getHourMinuteString,
  getMonthTitle,
  getYearMonthDayString,
  getYearMonthString,
  getYearString,
  getYearTitle,
  getYearWeekString
} from './calendar-utils';

export { DatePickerController };

namespace DatePickerController {
  export type SelectionMode =
    | 'date'
    | 'dates'
    | 'time'
    | 'dateTime'
    | 'dateRange'
    | 'week'
    | 'weeks'
    | 'month'
    | 'months'
    | 'year'
    | 'years';

  export type Scene = 'month' | 'year' | 'decade' | 'time';
}

type SelectionMode = DatePickerController.SelectionMode;

class DatePickerController extends CalendarLocalizer {
  #selectionMode: DatePickerController.SelectionMode;
  #getSelectionMode: () => DatePickerController.SelectionMode;
  #selection = new Set<string>();
  #scene: DatePickerController.Scene = 'month';
  #activeYear = new Date().getFullYear();
  #activeMonth = new Date().getMonth();
  #activeHour = new Date().getHours();
  #activeMinute = new Date().getMinutes();
  #requestUpdate: () => void;
  #onChange: (() => void) | null;
  #getNode: () => HTMLElement | ShadowRoot;
  #notifyTimeoutId: unknown = null;

  constructor(
    host: ReactiveControllerHost & HTMLElement,

    params: {
      getLocale: () => string;
      getDirection: () => 'ltr' | 'rtl';
      getSelectionMode: () => SelectionMode;
      getWeekNumber?: ((date: Date) => number) | null;
      onChange?: () => void;
    }
  ) {
    super({
      getLocale: params.getLocale,
      getDirection: params.getDirection,
      getWeekNumber: params.getWeekNumber || null
    });

    let initialized = false;

    const innerController = {
      hostUpdate: () => {
        const newSelectionMode = this.#getSelectionMode();

        if (newSelectionMode !== this.#selectionMode) {
          this.#setSelectionMode(newSelectionMode);
        }
      },

      hostUpdated: () => {
        if (initialized) {
          return;
        }

        initialized = true;
        this.#addEventListeners();
      }
    };

    host.addController(innerController);
    this.#selectionMode = params.getSelectionMode();
    this.#getSelectionMode = params.getSelectionMode;
    this.#requestUpdate = () => host.requestUpdate();
    this.#getNode = () => host.shadowRoot || host;
    this.#onChange = params.onChange || null;
  }

  getSelectionMode() {
    return this.#selectionMode;
  }

  getScene(): DatePickerController.Scene {
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

  getActiveMinute() {
    return this.#activeMinute;
  }

  hasSelectedYear(year: number) {
    return this.#selection.has(getYearString(year));
  }

  hasSelectedMonth(year: number, month: number) {
    return this.#selection.has(getYearMonthString(year, month));
  }

  hasSelectedDay(year: number, month: number, day: number) {
    const mode = this.#selectionMode;

    if (mode === 'date' || mode === 'dates' || mode === 'dateTime') {
      const value = this.#selectionMode;
      return this.#selection.has(getYearMonthDayString(year, month, day));
    } else if (mode === 'week' || mode === 'weeks') {
      const weekNumber = this.getWeekNumber(new Date(year, month, day));
      return this.#selection.has(getYearWeekString(year, weekNumber));
    }

    return false;
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

  setValue(value: string) {
    throw 'TODO'; // TODO!!!
  }

  getMonthTitle() {
    return getMonthTitle(this.getLocale(), this.#activeYear, this.#activeMonth);
  }

  getYearTitle() {
    return getYearTitle(this.getLocale(), this.#activeYear);
  }

  getDecadeTitle() {
    return getDecadeTitle(this.getLocale(), this.#activeYear, 12);
  }

  #clearSelection() {
    this.#selection.clear();
    this.#notifyChange();
  }

  #addSelection(value: string) {
    this.#selection.add(value);
    this.#notifyChange();
  }

  #removeSelection(value: string) {
    this.#selection.delete(value);
    this.#notifyChange();
  }

  #notifyChange() {
    if (this.#notifyTimeoutId !== null) {
      return;
    }

    this.#notifyTimeoutId = setTimeout(() => {
      this.#notifyTimeoutId = null;

      this.#getNode().dispatchEvent(
        new Event('change', { bubbles: true, composed: true })
      );

      if (this.#onChange) {
        this.#onChange();
      }
    }, 50);
  }

  #addEventListeners = () => {
    const node = this.#getNode();

    node.addEventListener('change', (ev: Event) => {
      if (ev.target !== this.#getNode()) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    });

    node.addEventListener('input', (ev: Event) => {
      const target = ev.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const subject = target.getAttribute('data-subject');

      if (!subject) {
        return;
      }

      switch (subject) {
        case 'hours':
          this.#setActiveHours(
            parseInt(
              String((target as unknown as { value: string | number }).value),
              10
            )
          );

          this.#notifyChange();
          break;

        case 'minutes':
          this.#setActiveMinutes(
            parseInt(
              String((target as unknown as { value: string | number }).value),
              10
            )
          );

          this.#notifyChange();
          break;
      }

      ev.preventDefault();
      ev.stopPropagation();
    });

    node.addEventListener('mousedown', (ev: Event) => {
      const target = ev.target;
      let preventDefault = true;

      if (target instanceof HTMLElement) {
        const subject = target.getAttribute('data-subject');

        if (subject === 'hour' || subject === 'minute') {
          preventDefault = false;
        }
      }

      if (preventDefault) {
        //ev.preventDefault();
        //ev.stopPropagation();
      }
    });

    node.addEventListener('click', (ev: Event) => {
      const target = ev.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const subject = target.getAttribute('data-subject');

      if (!subject) {
        return;
      }

      switch (subject) {
        case 'prev':
          this.#clickPrev();
          break;

        case 'next':
          this.#clickNext();
          break;

        case 'title':
          this.#clickTitle();
          break;

        case 'day': {
          const year = parseInt(target.getAttribute('data-year')!, 10);
          const month = parseInt(target.getAttribute('data-month')!, 10);
          const day = parseInt(target.getAttribute('data-day')!, 10);

          this.#clickDay(year, month, day);
          break;
        }

        case 'month': {
          const year = parseInt(target.getAttribute('data-year')!, 10);
          const month = parseInt(target.getAttribute('data-month')!, 10);

          this.#clickMonth(year, month);
          break;
        }

        case 'year': {
          const year = parseInt(target.getAttribute('data-year')!, 10);

          this.#clickYear(year);
          break;
        }
      }

      ev.preventDefault();
      ev.stopPropagation();
    });
  };

  #toggleSelected = (value: string, clear = false) => {
    const hasValue = this.#selection.has(value);

    if (clear) {
      this.#clearSelection();
    }

    if (!hasValue) {
      this.#addSelection(value);
    } else if (!clear) {
      this.#removeSelection(value);
    }

    this.#requestUpdate();
  };

  #clickPrev = () => {
    this.#clickPrevOrNext(-1);
  };

  #clickNext = () => {
    this.#clickPrevOrNext(1);
  };

  #clickPrevOrNext = (signum: number) => {
    const duration = 100;
    const offset = 100;
    const node = this.#getNode();
    const sheet = node.querySelector('.cal-sheet') as HTMLElement;
    const parent = sheet.parentElement!;
    const oldParentOverflowValue = parent.style.overflow;

    parent.style.overflow = 'hidden';

    const animate = (type: 'out' | 'in') => {
      const keyframes =
        type === 'out'
          ? [
              {
                opacity: 0,
                transform: `translateX(calc(${-signum}*${offset}px))`
              }
            ]
          : [
              {
                opacity: 0,
                transform: `translateX(calc(${signum}*${offset}px))`
              },
              {
                opacity: 1,
                transform: `translateX(0)`
              }
            ];

      return sheet.animate(keyframes, {
        duration
      });
    };

    animate('out').finished.then(() => {
      animate('in').finished.then(() => {
        parent.style.overflow = oldParentOverflowValue;
      });

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
    });
  };

  #setSelectionMode = (mode: DatePickerController.SelectionMode) => {
    if (mode === this.#selectionMode) {
      return;
    }

    this.#selectionMode = mode;
    this.#clearSelection();

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
  };

  #setScene = (scene: DatePickerController.Scene) => {
    this.#scene = scene;
    this.#requestUpdate();
  };

  #setActiveHours = (hour: number) => {
    this.#activeHour = hour;
    this.#requestUpdate();
  };

  #setActiveMinutes = (minute: number) => {
    this.#activeMinute = minute;
    this.#requestUpdate();
  };

  #clickTitle = () => {
    if (this.#scene !== 'month' && this.#scene !== 'year') {
      return;
    }

    this.#setScene(this.#scene === 'month' ? 'year' : 'decade');
  };

  #clickDay = (year: number, month: number, day: number) => {
    switch (this.#selectionMode) {
      case 'date':
      case 'dates':
      case 'dateTime': {
        const dateString = getYearMonthDayString(year, month, day);

        this.#toggleSelected(dateString, this.#selectionMode !== 'dates');
        break;
      }

      case 'week':
      case 'weeks': {
        const weekNumber = this.getWeekNumber(new Date(year, month, day));
        const weekString = getYearWeekString(year, weekNumber);
        this.#toggleSelected(weekString, this.#selectionMode !== 'weeks');
        break;
      }
    }

    this.#requestUpdate();
  };

  #clickMonth = (year: number, month: number) => {
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
  };

  #clickYear = (year: number) => {
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
  };
}
