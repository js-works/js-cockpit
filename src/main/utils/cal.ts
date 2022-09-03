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

type Renderable = Node | string | number | null | undefined | Renderable[];
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

  getCalendarWeek: (date, firstDayOfWeek) => {
    return 42;
  }, // TODO!!!

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
  #currView: View = 'decade';
  #currMonth: number;
  #currYear: number;
  #currDecade: number;

  constructor(params: {
    getLocaleSettings: (locale: string) => Partial<Calendar.LocaleSettings>;
    theme?: Calendar.Theme;
  }) {
    this.#getLocaleSettings = params.getLocaleSettings;
    this.#theme = params.theme || defaultTheme;
    this.#cal = renderRoot(this.#theme);
    this.#calBase = query(this.#cal, '.cal-base');
    this.#calInput = query(this.#cal, '.cal-input');
    this.#calTitle = query(this.#cal, '.cal-title');
    this.#calPrev = query(this.#cal, '.cal-prev');
    this.#calNext = query(this.#cal, '.cal-next');
    this.#calMain = query(this.#cal, '.cal-main');
    this.#calTimeSelector = query(this.#cal, '.cal-time-selector');
    this.#calTime = query(this.#cal, '.cal-time');
    this.#calHour = query(this.#cal, '.cal-hour');
    this.#calMinute = query(this.#cal, '.cal-minute');
    this.#calOk = query(this.#cal, '.cal-ok');
    this.#calCancel = query(this.#cal, '.cal-cancel');
    this.#calClear = query(this.#cal, '.cal-clear');

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

    this.#cal.addEventListener('mousedown', this.#onMouseDown);
    this.#cal.addEventListener('click', this.#onClick);

    this.#refresh();
  }

  getElement() {
    return this.#cal;
  }

  #onMouseDown = (ev: MouseEvent) => {
    if (!this.#focusables.includes(ev.target as HTMLElement)) {
      ev.preventDefault();
      ev.stopPropagation();
    }
  };

  #onClick = (ev: MouseEvent) => {
    const target = ev.target;

    const action =
      target instanceof HTMLElement
        ? target.getAttribute('data-action') || null
        : null;

    if (action) {
      switch (action) {
        case 'cancel':
          this.#cancel();
          break;

        case 'clear':
          this.#clear();
          break;

        case 'ok':
          this.#ok();
          break;
      }
    }
  };

  #refresh = () => {
    switch (this.#currView) {
      case 'year':
        this.#calTitle.innerText = String(this.#currYear);
        this.#calMain.innerHTML = '';
        this.#calMain.append(this.#renderYearView());
        break;

      case 'decade':
        this.#calTitle.innerText =
          this.#currDecade + ' - ' + (this.#currDecade + 12);

        this.#calMain.innerHTML = '';
        this.#calMain.append(this.#renderDecadeView());
    }
  };

  #clear = () => {};

  #cancel = () => {};

  #ok = () => {};

  #renderYearView = () => {
    const ret = h('div', { className: 'cal-view-year' });

    for (let i = 0; i < 12; ++i) {
      const month = this.#localeSettings.monthsShort[i];

      const elem = h(
        'div',
        {
          'className': 'cal-cell',
          'data-month': month
        },
        month
      );

      ret.append(elem);
    }

    return ret;
  };

  #renderDecadeView = () => {
    const startYear = 2020;
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

function query<T extends HTMLElement>(root: HTMLElement, selector: string): T {
  return root.querySelector(selector)!;
}

function h(
  tagName: string,
  props?: Record<string, any> | null,
  ...children: (string | number | Node)[]
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

  for (const child of children) {
    const type = typeof child;

    if (typeof child === 'string' || typeof child === 'number') {
      ret.append(document.createTextNode(String(child)));
    } else if (child) {
      ret.append(child);
    }
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

function renderRoot(theme: Calendar.Theme): HTMLDivElement {
  const styles = getStyles(theme);

  const content = html`
    <style>
      ${styles}
    </style>
    <div class="cal-base">
      <input class="cal-input" />
      <div class="cal-nav">
        <a class="cal-prev" data-action="movePrev">&#x1F860;</a>
        <div class="cal-title-container">
          <a class="cal-title" data-action="switchView">[title]</a>
        </div>
        <a class="cal-next" data-action="moveNext">&#x1F862;</a>
      </div>
      <div class="cal-main">[main]</div>
      <div class="cal-time-selector">
        <div class="cal-time">--:--</div>
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
  ret.innerHTML = content;
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
