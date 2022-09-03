// === exports =======================================================

export { Calendar };

// === exported types ================================================

namespace Calendar {
  export type Type =
    | 'date'
    | 'dates'
    | 'time'
    | 'dateTime'
    | 'dateRange'
    | 'month'
    | 'year';

  export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

  export type LocaleSettings = {
    daysShort: string[];
    months: string[];
    monthsShort: string[];
    firstDayOfWeek: Weekday;
    weekendDays: Weekday[];
    getCalendarWeek: (date: Date, firstDayOfWeek: Weekday) => number;

    texts: {
      ok: string;
      cancel: string;
      clear: string;
    };
  };

  export type Theme = {
    font: string;
    headerTextColor: string;
    headerBackgroundColor: string;
    headerHoverBackgroundColor: string;
    headerActiveBackgroundColor: string;
    buttonBackgroundColor: string;
    buttonHoverBackgroundColor: string;
    buttonActiveBackgroundColor: string;
  };
}

const defaultTheme: Calendar.Theme = {
  font: '15px Helvetica,Arial,sans-serif',
  headerTextColor: 'black',
  headerBackgroundColor: 'orange',
  headerHoverBackgroundColor: 'darkorange',
  headerActiveBackgroundColor: 'red',
  buttonBackgroundColor: 'yellow',
  buttonHoverBackgroundColor: 'orange',
  buttonActiveBackgroundColor: 'blue'
};

// === local types ===================================================

type View = 'month' | 'year' | 'decade';

// === local data ====================================================

const cache = new WeakMap<any, any>();

const defaultLocaleSettings: Calendar.LocaleSettings = {
  daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

  months: [
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
  ],

  monthsShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ],

  firstDayOfWeek: 0,
  weekendDays: [0, 6],
  getCalendarWeek,

  texts: {
    ok: 'OK',
    cancel: 'Cancel',
    clear: 'Clear'
  }
};

// === public ========================================================

class Calendar {
  readonly #theme: Calendar.Theme;

  readonly #getLocaleSettings: (
    locale: string
  ) => Partial<Calendar.LocaleSettings>;

  readonly #cal: HTMLDivElement;
  readonly #calBase: HTMLDivElement;
  readonly #calInput: HTMLInputElement;
  readonly #calTitle: HTMLAnchorElement;
  readonly #calPrev: HTMLAnchorElement;
  readonly #calNext: HTMLAnchorElement;
  readonly #calMain: HTMLDivElement;
  readonly #calTimeSelector: HTMLDivElement;
  readonly #calTime: HTMLDivElement;
  readonly #calHour: HTMLInputElement;
  readonly #calMinute: HTMLInputElement;
  readonly #calOk: HTMLInputElement;
  readonly #calCancel: HTMLInputElement;
  readonly #calClear: HTMLInputElement;
  readonly #focusables: HTMLElement[];

  #localeSettings = defaultLocaleSettings;
  #currView: View = 'month';
  #currMonth: number;
  #currYear: number;
  #currDecade: number;
  #currHour: number | null = 0;
  #currMinute: number | null = 0;

  #updateRequested = false;

  constructor(params: {
    getLocaleSettings: (locale: string) => Partial<Calendar.LocaleSettings>;
    theme?: Calendar.Theme;
    styles?: string;
  }) {
    this.#getLocaleSettings = params.getLocaleSettings;
    this.#theme = params.theme || defaultTheme;
    this.#cal = renderPickerScaffold(this.#theme, params.styles);
    this.#calBase = query(this.#cal.shadowRoot!, '.cal-base')!;
    this.#calInput = query(this.#calBase, '.cal-input')!;
    this.#calTitle = query(this.#calBase, '.cal-title')!;
    this.#calPrev = query(this.#calBase, '.cal-prev')!;
    this.#calNext = query(this.#calBase, '.cal-next')!;
    this.#calMain = query(this.#calBase, '.cal-main')!;
    this.#calTimeSelector = query(this.#calBase, '.cal-time-selector')!;
    this.#calTime = query(this.#calBase, '.cal-time')!;
    this.#calHour = query(this.#calBase, '.cal-hour')!;
    this.#calMinute = query(this.#calBase, '.cal-minute')!;
    this.#calOk = query(this.#calBase, '.cal-ok')!;
    this.#calCancel = query(this.#calBase, '.cal-cancel')!;
    this.#calClear = query(this.#calBase, '.cal-clear')!;

    this.#focusables = [
      this.#calHour,
      this.#calMinute,
      this.#calCancel,
      this.#calClear,
      this.#calOk
    ];

    const now = new Date();
    this.#currMonth = now.getMonth();
    this.#currYear = now.getFullYear();
    this.#currDecade = Math.floor(this.#currYear / 10) * 10;
    this.#calBase.addEventListener('mousedown', this.#onPickerMouseDown);
    this.#calBase.addEventListener('click', this.#onPickerClick);
    this.#calHour.addEventListener('input', this.#onHourInput);
    this.#calMinute.addEventListener('input', this.#onMinuteInput);
    this.#update();
  }

  getElement() {
    return this.#cal;
  }

  #onPickerMouseDown = (ev: MouseEvent) => {
    if (
      ev.target instanceof HTMLElement &&
      !this.#focusables.includes(ev.target)
    ) {
      ev.preventDefault();
      ev.stopPropagation();
    }
  };

  #onPickerClick = (ev: MouseEvent) => {
    const target = ev.target;

    if (this.#updateRequested || !(target instanceof HTMLElement)) {
      return;
    }

    if (target.classList.contains('cal-cell')) {
      this.#onCellClick(ev);
      return;
    }

    const action = target.getAttribute('data-action');

    if (action) {
      const actionMap: Record<string, (ev: MouseEvent) => void> = {
        movePrev: this.#onPrevClick,
        moveNext: this.#onNextClick,
        switchView: this.#onTitleClick,
        ok: this.#onOkClick,
        cancel: this.#onCancelClick,
        clear: this.#onClearClick
      };

      actionMap[action]?.(ev);
    }
  };

  #onTitleClick = () => {
    if (this.#currView !== 'decade') {
      this.#currView = this.#currView === 'month' ? 'year' : 'decade';
      this.#requestUpdate();
    }
  };

  #onPrevClick = () => {
    if (this.#currView === 'month') {
      if (this.#currMonth === 0) {
        this.#currMonth = 11;
        this.#currYear--;
      } else {
        this.#currMonth--;
      }

      this.#requestUpdate();
    }

    if (this.#currView === 'year') {
      this.#currYear--;

      this.#requestUpdate();
    } else if (this.#currView === 'decade') {
      this.#currDecade -= 10;
      this.#requestUpdate();
    }
  };

  #onNextClick = () => {
    if (this.#currView === 'month') {
      if (this.#currMonth === 11) {
        this.#currMonth = 0;
        this.#currYear++;
      } else {
        this.#currMonth++;
      }

      this.#requestUpdate();
    } else if (this.#currView === 'year') {
      this.#currYear++;

      this.#requestUpdate();
    } else if (this.#currView === 'decade') {
      this.#currDecade += 10;
      this.#requestUpdate();
    }
  };

  #onCellClick = (ev: Event) => {
    const target = ev.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    switch (this.#currView) {
      case 'month':
        break;

      case 'year':
        this.#currYear = parseInt(target.getAttribute('data-year')!, 10);
        this.#currMonth = parseInt(target.getAttribute('data-month')!, 10);
        this.#currView = 'month';
        this.#requestUpdate();
        break;

      case 'decade':
        this.#currYear = parseInt(target.getAttribute('data-year')!, 10);
        this.#currView = 'year';
        this.#requestUpdate();
        break;
    }
  };

  #onOkClick = () => {
    console.log('ok');
  };

  #onCancelClick = () => {
    console.log('cancel');
  };

  #onClearClick = () => {
    console.log('clear');
  };

  #onHourInput = (ev: Event) => {
    const target = ev.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.#currHour = target.valueAsNumber;
    this.#updateTimeText();
  };

  #onMinuteInput = (ev: Event) => {
    const target = ev.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.#currMinute = target.valueAsNumber;
    this.#updateTimeText();
  };

  #requestUpdate = () => {
    if (this.#updateRequested) {
      return;
    }

    this.#updateRequested = true;

    requestAnimationFrame(() => {
      this.#updateRequested = false;
      this.#update();
    });
  };

  #update = () => {
    switch (this.#currView) {
      case 'month': {
        const month = this.#currMonth;
        const year = this.#currYear;
        const title = `${this.#localeSettings.months[month]} ${year}`;
        this.#calTitle.innerText = title;
        this.#calMain.innerHTML = '';

        this.#calMain.append(
          this.#renderMonthView(this.#currYear, this.#currMonth)
        );

        break;
      }

      case 'year':
        this.#calTitle.innerText = String(this.#currYear);
        this.#calMain.innerHTML = '';
        this.#calMain.append(this.#renderYearView(this.#currYear));
        break;

      case 'decade':
        this.#calTitle.innerText =
          this.#currDecade + ' - ' + (this.#currDecade + 11);

        this.#calMain.innerHTML = '';
        this.#calMain.append(this.#renderDecadeView(this.#currDecade));
    }

    this.#updateTimeText();
  };

  #updateTimeText = () => {
    let timeText: string;

    if (this.#currHour === null || this.#currMinute === null) {
      timeText = '--:--';
    } else {
      const hour =
        this.#currHour < 9 ? `0${this.#currHour}` : `${this.#currHour}`;

      const minute =
        this.#currMinute < 9 ? `0${this.#currMinute}` : `${this.#currMinute}`;

      timeText = `${hour}:${minute}`;
    }

    this.#calTime.innerText = timeText;
  };

  #renderMonthView = (year: number, month: number) => {
    const ret = h('div', { className: 'cal-view-month' });

    const firstDayOfWeek = this.#localeSettings.firstDayOfWeek;
    const firstWeekdayOfMonth = new Date(year, month, 1).getDay();
    const dayCountOfCurrMonth = getDayCountOfMonth(year, month);
    const dayCountOfLastMonth = getDayCountOfMonth(year, month - 1);

    const remainingDaysOfLastMonth =
      firstDayOfWeek <= firstWeekdayOfMonth
        ? firstWeekdayOfMonth - firstDayOfWeek
        : 6 - (firstDayOfWeek - firstWeekdayOfMonth);

    let daysToShow = getDayCountOfMonth(year, month) + remainingDaysOfLastMonth;

    if (daysToShow % 7 > 0) {
      daysToShow += 7 - (daysToShow % 7);
    }

    ret.append(h('div'));

    for (let i = 0; i < 7; ++i) {
      ret.append(
        h('div', { class: 'cal-weekday' }, this.#localeSettings.daysShort[i])
      );
    }

    for (let i = 0; i < daysToShow; ++i) {
      let cellYear: number;
      let cellMonth: number;
      let cellDay: number;

      if (i < remainingDaysOfLastMonth) {
        cellDay = dayCountOfLastMonth - remainingDaysOfLastMonth + i + 1;
        cellMonth = month === 0 ? 11 : month - 1;
        cellYear = month === 0 ? year - 1 : year;
      } else {
        cellDay = i - remainingDaysOfLastMonth + 1;

        if (cellDay > dayCountOfCurrMonth) {
          cellDay = cellDay - dayCountOfCurrMonth;
          cellMonth = month === 11 ? 1 : month + 1;
          cellYear = month === 11 ? year + 1 : year;
        } else {
          cellMonth = month;
          cellYear = year;
        }
      }

      if (i % 7 === 0) {
        const weekElem = h(
          'div',
          { className: 'cal-week-number' },
          this.#localeSettings.getCalendarWeek(
            new Date(cellYear, cellMonth, cellDay),
            this.#localeSettings.firstDayOfWeek
          )
        );

        ret.append(weekElem);
      }

      const elem = h(
        'div',
        {
          'className': 'cal-cell',
          'data-year': cellYear,
          'data-month': cellMonth,
          'data-day': cellDay
        },
        cellDay
      );

      ret.append(elem);
    }

    return ret;
  };

  #renderYearView = (year: number) => {
    const ret = h('div', { className: 'cal-view-year' });

    for (let i = 0; i < 12; ++i) {
      const elem = h(
        'div',
        {
          'className': 'cal-cell',
          'data-year': year,
          'data-month': i
        },
        this.#localeSettings.monthsShort[i]
      );

      ret.append(elem);
    }

    return ret;
  };

  #renderDecadeView = (startYear: number) => {
    const ret = h('div', { className: 'cal-view-decade' });

    for (let i = 0; i < 12; ++i) {
      const year = startYear + i;

      const elem = h(
        'div',
        { 'className': 'cal-cell', 'data-year': year },
        year
      );

      ret.append(elem);
    }

    return ret;
  };
}

// === local =========================================================

function getDayCountOfMonth(year: number, month: number) {
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

function query<T extends HTMLElement>(
  root: HTMLElement | ShadowRoot,
  selector: string
): T | null {
  return root.querySelector(selector);
}

function h(
  tagName: string,
  props?: Record<string, any> | null,
  child?: string | number | Node
): HTMLElement {
  const ret = document.createElement(tagName);

  if (props) {
    for (const key of Object.keys(props)) {
      const value = props[key];

      if (key === 'class') {
        ret.className = value;
      } else if (key.startsWith('data-')) {
        ret.setAttribute(key, value);
      } else {
        (ret as any)[key] = value;
      }
    }
  }

  if (typeof child === 'string' || typeof child === 'number') {
    ret.append(document.createTextNode(String(child)));
  } else if (child) {
    ret.append(child);
  }

  return ret;
}

function html(parts: TemplateStringsArray, ...values: any[]): string {
  if (parts.length === 1) {
    return parts[0];
  }

  const arr: string[] = [];

  parts.forEach((part, idx) => {
    arr.push(part);

    const value = values![idx];

    if (value != null) {
      arr.push(String(values![idx]));
    }
  });

  return arr.join('');
}

function css(parts: TemplateStringsArray, ...values: any[]): string {
  return html(parts, ...values);
}

function renderPickerScaffold(
  theme: Calendar.Theme,
  customStyles?: string
): HTMLDivElement {
  const styles = getStyles(theme);

  const content = html`
    <style>
      ${styles}
      ${customStyles || null}
    </style>
    <div class="cal-base">
      <input class="cal-input" />
      <div class="cal-nav">
        <a class="cal-prev" data-action="movePrev">&#x1F860;</a>
        <div class="cal-title-container">
          <a class="cal-title" data-action="switchView"></a>
        </div>
        <a class="cal-next" data-action="moveNext">&#x1F862;</a>
      </div>
      <div class="cal-main"></div>
      <div class="cal-time-selector">
        <div class="cal-time"></div>
        <input class="cal-hour" value="0" type="range" min="0" max="23" />
        <input class="cal-minute" value="0" type="range" min="0" max="59" />
      </div>
      <div class="cal-buttons">
        <button class="cal-button cal-clear" data-action="clear">Clear</button>
        <button class="cal-button cal-cancel" data-action="cancel">
          Cancel
        </button>
        <button class="cal-button cal-ok" data-action="ok">OK</button>
      </div>
    </div>
  `;

  const ret = h('div') as HTMLDivElement;
  ret.attachShadow({ mode: 'open' }).innerHTML = content;
  return ret;
}

function getStyles(theme: Calendar.Theme) {
  return css`
    .cal-base {
      position: relative;
      display: flow;
      width: 300px;
      border: 1px solid red;
      font: ${theme.font};
      user-select: none;
    }

    .cal-input {
      position: absolute;
      border: 1px solid green;
      width: 0;
      height: 0;
      outline: none;
      border: none;
      overflow: hidden;
      opacity: 0;
      z-index: -1;
    }

    .cal-nav {
      display: flex;
      background-color: yellow;
      background-color: ${theme.headerBackgroundColor};
    }

    .cal-title-container {
      display: flex;
      flex-grow: 1;
      align-items: center;
      justify-content: center;
    }

    .cal-title,
    .cal-prev,
    .cal-next {
      padding: 0.125rem 0.25rem;
      margin: 0.125rem 0.25rem;
    }

    .cal-title {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
    }

    .cal-title:not(.cal--disabled),
    .cal-prev:not(.cal--disabled),
    .cal-next:not(.cal--disabled) {
      cursor: pointer;
    }

    .cal-title:not(.cal--disabled):hover,
    .cal-prev:not(.cal--disabled):hover,
    .cal-next:not(.cal--disabled):hover {
      background-color: ${theme.headerHoverBackgroundColor};
    }

    .cal-title:not(.cal--disabled):active,
    .cal-prev:not(.cal--disabled):active,
    .cal-next:not(.cal--disabled):active {
      background-color: ${theme.headerActiveBackgroundColor};
    }

    .cal-view-month {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
    }

    .cal-view-year {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
    }

    .cal-view-decade {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
    }

    .cal-time-selector {
      display: grid;
      grid-template-columns: auto 1fr;
      grid-template-rows: auto auto;
      padding: 0.5rem 0;
    }

    .cal-time {
      grid-column: 1;
      grid-row: 1 / span 2;
      align-self: center;
      padding: 0.5rem;
    }

    .cal-button {
      flex-grow: 1;
      outline: none;
      background-color: ${theme.buttonBackgroundColor};
    }

    .cal-button:hover {
      background-color: ${theme.buttonHoverBackgroundColor};
    }

    .cal-button:active {
      background-color: ${theme.buttonActiveBackgroundColor};
    }

    .cal-buttons {
      display: flex;
    }
  `;
}
