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

  export type Localization = {
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

  export type Options = {
    localization: Localization;
    alwaysShow42Days: boolean;
  };
}

// === local types ===================================================

type View = 'month' | 'year' | 'decade';

// === local data ====================================================

const defaultLocalization: Calendar.Localization = {
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

const defaultOptions: Calendar.Options = {
  localization: defaultLocalization,
  alwaysShow42Days: false
};

// === public ========================================================

class Calendar {
  static #template: HTMLTemplateElement | null = null;

  #cal: HTMLElement;
  #calBase: HTMLElement;
  #calInput: HTMLInputElement;
  #calTitle: HTMLAnchorElement;
  #calPrev: HTMLAnchorElement;
  #calNext: HTMLAnchorElement;
  #calSheet: HTMLElement;
  #calTimeSelector: HTMLElement;
  #calTime: HTMLElement;
  #calHourSlider: HTMLInputElement;
  #calMinuteSlider: HTMLInputElement;
  #calOk: HTMLInputElement;
  #calCancel: HTMLInputElement;
  #calClear: HTMLInputElement;
  #focusables: HTMLElement[];

  #options = defaultOptions;
  #currView: View = 'month';
  #currMonth: number;
  #currYear: number;
  #currDecade: number;
  #currHour: number | null = 0;
  #currMinute: number | null = 0;

  #updateRequested = false;

  constructor(params: { styles?: string }, options: Partial<Calendar.Options>) {
    if (options) {
      this.setOptions(options);
    }

    this.#cal = this.#renderPicker(params.styles);
    this.#calBase = query(this.#cal.shadowRoot!, '.cal-base')!;
    this.#calInput = query(this.#calBase, '.cal-input')!;
    this.#calTitle = query(this.#calBase, '.cal-title')!;
    this.#calPrev = query(this.#calBase, '.cal-prev')!;
    this.#calNext = query(this.#calBase, '.cal-next')!;
    this.#calSheet = query(this.#calBase, '.cal-sheet')!;
    this.#calTimeSelector = query(this.#calBase, '.cal-time-selector')!;
    this.#calTime = query(this.#calBase, '.cal-time')!;
    this.#calHourSlider = query(this.#calBase, '.cal-hour-slider')!;
    this.#calMinuteSlider = query(this.#calBase, '.cal-minute-slider')!;
    this.#calOk = query(this.#calBase, '.cal-ok')!;
    this.#calCancel = query(this.#calBase, '.cal-cancel')!;
    this.#calClear = query(this.#calBase, '.cal-clear')!;

    this.#focusables = [
      this.#calHourSlider,
      this.#calMinuteSlider,
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
    this.#calHourSlider.addEventListener('input', this.#onHourInput);
    this.#calMinuteSlider.addEventListener('input', this.#onMinuteInput);

    this.#update();
  }

  getElement(): HTMLElement {
    return this.#cal;
  }

  setOptions(options: Partial<Calendar.Options>) {
    this.#options = { ...this.#options, ...options };

    if (options.localization) {
      this.#options.localization = {
        ...defaultLocalization,
        ...options.localization
      };
    }
  }

  #renderPicker = (styles: string = '') => {
    if (Calendar.#template === null) {
      Calendar.#template = document.createElement('template');
      Calendar.#template.innerHTML = baseTemplate;
    }

    const content = Calendar.#template.content.cloneNode(true) as HTMLElement;
    const ret = h('div');
    ret.attachShadow({ mode: 'open' });
    ret.shadowRoot!.append(content);
    query(ret.shadowRoot!, 'style')!.innerText = `${baseStyles}\n${styles}`;
    return ret;
  };

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
        // TODO!!!
        const cellYear = parseInt(target.getAttribute('data-year')!, 10);
        const cellMonth = parseInt(target.getAttribute('data-month')!, 10);
        const cellDay = parseInt(target.getAttribute('data-day')!, 10);
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
        const title = `${this.#options.localization.months[month]} ${year}`;
        this.#calTitle.innerText = title;
        this.#calSheet.innerHTML = '';

        this.#calSheet.append(
          this.#renderMonthView(this.#currYear, this.#currMonth)
        );

        break;
      }

      case 'year':
        this.#calTitle.innerText = String(this.#currYear);
        this.#calSheet.innerHTML = '';
        this.#calSheet.append(this.#renderYearView(this.#currYear));
        break;

      case 'decade':
        this.#calTitle.innerText =
          this.#currDecade + ' - ' + (this.#currDecade + 11);

        this.#calSheet.innerHTML = '';
        this.#calSheet.append(this.#renderDecadeView(this.#currDecade));
    }

    if (this.#currView === 'decade') {
      this.#calTitle.classList.add('cal--disabled');
    } else {
      this.#calTitle.classList.remove('cal--disabled');
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
    const options = this.#options;
    const localization = options.localization;

    const firstDayOfWeek = localization.firstDayOfWeek;
    const firstWeekdayOfMonth = new Date(year, month, 1).getDay();
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

    ret.append(h('div'));

    for (let i = 0; i < 7; ++i) {
      ret.append(h('div', { class: 'cal-weekday' }, localization.daysShort[i]));
    }

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

      if (i % 7 === 0) {
        const weekElem = h(
          'div',
          { className: 'cal-week-number' },
          localization.getCalendarWeek(
            new Date(cellYear, cellMonth, cellDay),
            localization.firstDayOfWeek
          )
        );

        ret.append(weekElem);
      }

      const elem = h(
        'div',
        {
          'className':
            'cal-cell' + (inOtherMonth ? ' cal-cell--other-month' : ''),
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
        this.#options.localization.monthsShort[i]
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

// === base template =================================================

const baseTemplate = /*html*/ `
  <style></style>
  <div class="cal-base">
    <input class="cal-input" />
    <div class="cal-header">
      <a class="cal-prev" data-action="movePrev">&#x1F860;</a>
      <div class="cal-title-container">
        <a class="cal-title" data-action="switchView"></a>
      </div>
      <a class="cal-next" data-action="moveNext">&#x1F862;</a>
    </div>
    <div class="cal-sheet"></div>
    <div class="cal-time-selector">
      <div class="cal-time"></div>
      <input class="cal-hour-slider" value="0" type="range" min="0" max="23"/>
      <input class="cal-minute-slider" value="0" type="range" min="0" max="59"/>
    </div>
    <div class="cal-footer">
      <button class="cal-button cal-clear" data-action="clear">Clear</button>
      <button class="cal-button cal-cancel" data-action="cancel">Cancel</button>
      <button class="cal-button cal-ok" data-action="ok">OK</button>
    </div>
  </div>
`;

// === base styles ===================================================

const baseStyles = /*css*/ `
  :host {
    --cal-font: 15px Helvetica, Arial, sans-serif;
    --cal-min-height: none;
    --cal-min-width: none;
    --cal-border-color: #e0e0e0;
    --cal-border-width: 1px;
    --cal-border-radius: 3px;
    --cal-header-color: #444;
    --cal-header-background-color: #fff;
    --cal-header-hover-background-color: #ddd;
    --cal-header-active-background-color: #ccc;
    --cal-header-border-color: #eee;
    --cal-header-border-width: 0 0 1px 0;
    --cal-sheet-min-width: 20em;
    --cal-sheet-min-height: 16em;
    --cal-sheet-padding: 4px;
    --cal-cell-hover-background-color: #ddd;
    --cal-cell-active-background-color: #ccc;
    --cal-cell-other-month-color: #ccc;
    --cal-button-margin: 0;
    --cal-button-padding: 0.5em;
    --cal-button-border-color: #ccc;
    --cal-button-background-color: white;
    --cal-button-focus-background-color: #d8d8d8;
    --cal-button-hover-background-color: #e8e8e8;
    --cal-button-active-background-color: #dadada; 

    --cal-slider-track-color: #ccc;
    
    display: inline-block;
  }

  .cal-base {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: var(--cal-min-width);
    min-height: var(--cal-min-height);
    font: var(--cal-font);
    border-style: solid;
    border-color: var(--cal-border-color);
    border-width: var(--cal-border-width);
    border-radius: var(--cal-border-radius);
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

  .cal-header {
    display: flex;
    color: var(--cal-header-color);
    background-color: var(--cal-header-background-color);
    border-style: solid;
    border-color: var(--cal-header-border-color);
    border-width: var(--cal-header-border-width);
    border-radius: var(--cal-border-radius) var(--cal-border-radius) 0 0;
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
    margin: 0.125rem 0.125rem;
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
    background-color: var(--cal-header-hover-background-color);
  }

  .cal-title:not(.cal--disabled):active,
  .cal-prev:not(.cal--disabled):active,
  .cal-next:not(.cal--disabled):active {
    background-color: var(--cal-header-active-background-color);
    background-color: red;
  }

  .cal-title.cal--disabled {
    background-color: inherit;
    cursor: default;
  }

  .cal-sheet {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex-grow: 1;
    min-width: var(--cal-sheet-min-width);
    min-height: var(--cal-sheet-min-height);
    padding: var(--cal-sheet-padding);
  }

  .cal-view-month {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    flex-grow: 1;
  }

  .cal-view-year {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    flex-grow: 1;
  }

  .cal-view-decade {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    flex-grow: 1;
  }

  .cal-weekday {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cal-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;
    padding: 0.5em;
  }

  .cal-cell:hover {
    background-color: var(--cal-cell-hover-background-color);
  }


  .cal-cell--other-month:not(:hover) {
    color: var(--cal-cell-other-month-color) 
  }
  
  .cal-cell--other-month:hover {
    color: var(--cal-cell-color) 
  }

  .cal-week-number {
    display: flex;
    align-items: center;
    justify-content: center;
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

  .cal-hour-slider,
  .cal-minute-slider {
    appearance: none;
    background: linear-gradient(to right, var(--cal-slider-track-color),var(--cal-slider-track-color)) left 50%/100% px no-repeat;
  }

  .cal-footer {
    display: flex;
  }

  .cal-button {
    flex-grow: 1;
    outline: none;
    padding: var(--cal-button-padding);
    margin: var(--cal-button-margin);
    background-color: var(--cal-button-background-color);
    border-style: solid;
    border-color: var(--cal-button-border-color);
    border-width: 1px 1px 0 0; 
    cursor: pointer;
  }

  .cal-button:first-child {
    border-bottom-left-radius: var(--cal-border-radius);
  }

  .cal-button:last-child {
    border-bottom-right-radius: var(--cal-border-radius);
    border-right-width: 0;
  }
  
  .cal-button:focus {
    background-color: var(--cal-button-focus-background-color);
  }

  .cal-button:hover {
    background-color: var(--cal-button-hover-background-color);
  }

  .cal-button:active {
    background-color: var(--cal-button-active-background-color);
  }
`;

// cSpell:ignore focusables
