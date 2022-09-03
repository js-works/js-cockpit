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
  };
}

const defaultTheme: Calendar.Theme = {
  font: '15px Helvetica,Arial,sans-serif',
  headerTextColor: 'black',
  headerBackgroundColor: 'orange',
  headerHoverBackgroundColor: 'darkorange',
  headerActiveBackgroundColor: 'red'
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
  #elem: HTMLElement;
  #theme: Calendar.Theme;
  #getLocaleSettings: (locale: string) => Partial<Calendar.LocaleSettings>;

  #currView: View = 'month';

  constructor(params: {
    getLocaleSettings: (locale: string) => Partial<Calendar.LocaleSettings>;
    theme?: Calendar.Theme;
  }) {
    this.#getLocaleSettings = params.getLocaleSettings;
    this.#theme = params.theme || defaultTheme;
    this.#elem = renderEmptyBase(this.#theme);
  }

  getElement() {
    return this.#elem;
  }
}

// === local =========================================================

function h(tagName: string, props?: Record<string, any> | null): HTMLElement {
  const ret = document.createElement(tagName);

  if (props) {
    Object.assign(ret, props);
  }

  return ret;
}

function renderEmptyBase(theme: Calendar.Theme) {
  const styles = getStyles(theme);

  const content = html`
    <style>
      ${styles}
    </style>
    <div class="cal-base">
      <div class="cal-header">
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
      <div class="cal-footer">
        <button class="cal-button cal-clear" data-action="clear">Clear</button>
        <button class="cal-button cal-cancel" data-action="cancel">
          Cancel
        </button>
        <button class="cal-button cal-ok" data-action="ok">OK</button>
      </div>
    </div>
  `;

  const ret = h('div');
  ret.innerHTML = content;
  return ret;
}

function getStyles(theme: Calendar.Theme) {
  return css`
    .cal-base {
      display: flow;
      width: 300px;
      border: 1px solid red;
      font: ${theme.font};
    }

    .cal-header {
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

    .cal-title:hover,
    .cal-prev:not(.cal--disabled):hover,
    .cal-next:not(.cal--disabled):hover {
      background-color: ${theme.headerHoverBackgroundColor};
    }

    .cal-title:active,
    .cal-prev:not(.cal--disabled):active,
    .cal-next:not(.cal--disabled):active {
      background-color: ${theme.headerActiveBackgroundColor};
    }

    .cal-time-selector {
      display: grid;
      grid-template-columns: auto 1fr;
      grid-template-rows: auto auto;
    }

    .cal-time {
      grid-column: 1;
      grid-row: 1 / span 2;
    }

    .cal-footer {
      background-color: yellow;
      display: flex;
      justify-items: stretch;
      align-items: stretch;
      justify-content: center;
    }
  `;
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
