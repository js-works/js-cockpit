import type { ReactiveControllerHost } from 'lit';

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

type LocaleInfo = Readonly<{
  baseName: string;
  language: string;
  region: string | undefined;
}>;

// ***********************************************************************
// ** Locale information for "first day of week", or "weekend days", or
// ** "week number" is currently (September 2022) not available in Intl
// ** (see https://github.com/tc39/proposal-intl-locale-info)
// ** so we have to take care of that on our own
// ***********************************************************************

// Source: https://github.com/unicode-cldr/cldr-core/blob/master/supplemental/weekData.json
// Day of week is represented by number (0 = sunday, ..., 6 = saturday).
const firstDayOfWeekData: Record<number, string> = {
  0:
    'AG,AS,AU,BD,BR,BS,BT,BW,BZ,CA,CN,CO,DM,DO,ET,GT,GU,HK,HN,ID,IL,IN,' +
    'JM,JP,KE,KH,KR,LA,MH,MM,MO,MT,MX,MZ,NI,NP,PA,PE,PH,PK,PR,PT,PY,SA,' +
    'SG,SV,TH,TT,TW,UM,US,VE,VI,WS,YE,ZA,ZW',
  1:
    'AD,AI,AL,AM,AN,AR,AT,AX,AZ,BA,BE,BG,BM,BN,BY,CH,CL,CM,CR,CY,CZ,DE,' +
    'DK,EC,EE,ES,FI,FJ,FO,FR,GB,GE,GF,GP,GR,HR,HU,IE,IS,IT,KG,KZ,LB,LI,' +
    'LK,LT,LU,LV,MC,MD,ME,MK,MN,MQ,MY,NL,NO,NZ,PL,RE,RO,RS,RU,SE,SI,SK,' +
    'SM,TJ,TM,TR,UA,UY,UZ,VA,VN,XK',
  5: 'MV',
  6: 'AE,AF,BH,DJ,DZ,EG,IQ,IR,JO,KW,LY,OM,QA,SD,SY'
};

// Source: https://github.com/unicode-cldr/cldr-core/blob/master/supplemental/weekData.json
const weekendData: Record<string, string> = {
  // Friday and Saturday
  '5+6': 'AE,BH,DZ,EG,IL,IQ,JO,KW,LY,OM,QA,SA,SD,SY,YE',

  // Thursday and Friday
  '4+5': 'AF',

  // Sunday
  '6': 'IN,UG',

  // Friday
  '5': 'IR'
};

const localeInfoMap = new Map<string, LocaleInfo>();
let firstDayOfWeekByCountryCode: Map<string, number>;
let weekendDaysByCountryCode: Map<string, Readonly<number[]>>;

class DatePickerController {
  #selectionMode: DatePickerController.SelectionMode;
  #getSelectionMode: () => DatePickerController.SelectionMode;
  #selection = new Set<string>();
  #scene: DatePickerController.Scene = 'month';
  #activeYear = new Date().getFullYear();
  #activeMonth = new Date().getMonth();
  #activeHour = new Date().getHours();
  #activeMinute = new Date().getMinutes();
  #requestUpdate: () => void;
  #getLocale: () => string;
  #onChange: (() => void) | null;
  #getNode: () => Node;
  #notifyTimeout: unknown = null;

  constructor(
    host: ReactiveControllerHost & HTMLElement,

    params: {
      getLocale: () => string;
      getSelectionMode: () => SelectionMode;
      onChange?: () => void;
    }
  ) {
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
    this.#getLocale = params.getLocale;
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
      const weekNumber = this.getCalendarWeek(new Date(year, month, day));
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
    const date = new Date(this.#activeYear, this.#activeMonth, 1);

    return new Intl.DateTimeFormat(this.#getLocale(), {
      year: 'numeric',
      month: 'long'
    }).format(date);
  }

  getYearTitle() {
    const date = new Date(this.#activeYear, 0, 1);

    return new Intl.DateTimeFormat(this.#getLocale(), {
      year: 'numeric'
    }).format(date);
  }

  getDecadeTitle() {
    const startYear = Math.floor(this.#activeYear / 10) * 10;

    return Intl.DateTimeFormat(this.#getLocale(), {
      year: 'numeric'
    }).formatRange(new Date(startYear, 1, 1), new Date(startYear + 11, 1, 1));
  }

  getLocaleInfo(): LocaleInfo {
    const locale = this.#getLocale();
    let info = localeInfoMap.get(locale);

    if (!info) {
      info = new (Intl as any).Locale(locale); // TODO
      localeInfoMap.set(locale, info!);
    }

    return info!;
  }

  getCalendarWeek(date: Date) {
    // Code is based on this solution here:
    // https://stackoverflow.com/questions/23781366/date-get-week-number-for-custom-week-start-day
    // TODO - check algorithm

    const weekstart = this.getFirstDayOfWeek();
    const target = new Date(date);

    // Replaced offset of (6) with (7 - weekstart)
    const dayNum = (date.getDay() + 7 - weekstart) % 7;
    target.setDate(target.getDate() - dayNum + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);

    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }

    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  }

  getFirstDayOfWeek(): number {
    if (!firstDayOfWeekByCountryCode) {
      firstDayOfWeekByCountryCode = new Map();

      for (const firstDayOfWeek of Object.keys(firstDayOfWeekData)) {
        const firstDay = Number.parseInt(firstDayOfWeek, 10);
        const countryCodes = firstDayOfWeekData[firstDay].split(',');

        countryCodes.forEach((countryCode) => {
          firstDayOfWeekByCountryCode.set(countryCode, firstDay);
        });
      }
    }

    const region = this.getLocaleInfo().region!;

    return region ? firstDayOfWeekByCountryCode.get(region) ?? 1 : 1;
  }

  getMonthName(month: number, format: 'long' | 'short' | 'narrow' = 'long') {
    const date = new Date(1970, month, 1);

    return new Intl.DateTimeFormat(this.#getLocale(), { month: format }).format(
      date
    );
  }

  getWeekendDays(): Readonly<number[]> {
    if (!weekendDaysByCountryCode) {
      weekendDaysByCountryCode = new Map();

      for (const [key, value] of Object.entries(weekendData)) {
        const days = Object.freeze(key.split('+').map((it) => parseInt(it)));
        const countryCodes = value.split(',');

        countryCodes.forEach((countryCode) => {
          weekendDaysByCountryCode.set(countryCode, days);
        });
      }
    }

    const region = this.getLocaleInfo().region;

    return region ? weekendDaysByCountryCode.get(region) || [0, 6] : [0, 6];
  }

  getWeekdayName(day: number, format: 'long' | 'short' | 'narrow' = 'long') {
    const date = new Date(1970, 0, 4 + (day % 7));
    return new Intl.DateTimeFormat(this.#getLocale(), {
      weekday: format
    }).format(date);
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
    if (this.#notifyTimeout !== null) {
      return;
    }

    this.#notifyTimeout = setTimeout(() => {
      this.#notifyTimeout = null;

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
        const weekNumber = this.getCalendarWeek(new Date(year, month, day));
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

function getYearWeekString(year: number, week: number) {
  const y = year.toString().padStart(4, '0');
  const w = week.toString().padStart(2, '0');

  return `${y}-W${w}`;
}

function getYearString(year: number) {
  return year.toString();
}

function getHourMinuteString(hour: number, minute: number) {
  const h = hour.toString().padStart(2, '0');
  const m = minute.toString().padStart(2, '0');

  return `${h}:${m}`;
}
