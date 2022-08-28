import AirDatepicker, {
  AirDatepickerLocale,
  AirDatepickerOptions
} from 'air-datepicker';

import datepickerStyles from 'air-datepicker/air-datepicker.css';

// === exports =======================================================

export { Calendar };

// === exported types ================================================

namespace Calendar {
  export type SelectionMode =
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
    getCalendarWeek: (date: Date) => number;
  };
}

// === local types ===================================================

// === local data ====================================================

const defaultLocale = 'en-US';
const noop = () => {};
const noWeekends: [number, number] = [-1, -1];
const localeSettingsCache = new Map<string, Calendar.LocaleSettings>();
const airLocaleDataCache = new Map<string, AirDatepickerLocale>();

// === class Calendar ================================================

class Calendar {
  #elem = document.createElement('div');
  #input: HTMLInputElement;
  #picker!: AirDatepicker;
  #hourSlider: HTMLElement | null = null;
  #minuteSlider: HTMLElement | null = null;

  #options: Partial<AirDatepickerOptions> = {};
  #locale = defaultLocale;
  #getLocaleSettings: (locale: string) => Calendar.LocaleSettings;
  #localeSettings: Calendar.LocaleSettings;
  #selectionMode: Calendar.SelectionMode = 'date';
  #highlightWeekends = false;
  #showWeekNumbers = false;
  #onBlur: (() => void) | null = null;

  constructor({
    getLocaleSettings,
    className,
    styles: customStyles,
    onSelection,
    onBlur
  }: {
    getLocaleSettings: (locale: string) => Calendar.LocaleSettings;
    className?: string;
    styles?: string;
    onSelection?: (selection: Date[], mode: Calendar.SelectionMode) => void;
    onBlur?: () => void;
  }) {
    const datepickerStyleElem = document.createElement('style');
    const customStyleElem = document.createElement('style');
    const inputElem = document.createElement('input');
    const pickerContainerElem = document.createElement('div');

    this.#getLocaleSettings = getLocaleSettings;
    this.#localeSettings = getLocaleSettingsCached(
      defaultLocale,
      getLocaleSettings
    );

    this.#input = inputElem;
    this.#elem.attachShadow({ mode: 'open' });

    this.#elem.shadowRoot!.append(
      datepickerStyleElem,
      customStyleElem,
      inputElem,
      pickerContainerElem
    );

    this.#elem.className = className || '';
    datepickerStyleElem.innerText = datepickerStyles + '\n' + getStyles();
    customStyleElem.innerText = customStyles || '';
    inputElem.className = 'adp-date-input';

    if (onBlur) {
      this.#onBlur = onBlur;

      this.#input.addEventListener('blur', this.#handleBlur);
    }

    this.#update({
      inline: true,
      container: pickerContainerElem,
      keyboardNav: true,
      locale: getAirLocaleData(this.#locale, this.#localeSettings),
      weekends: noWeekends,

      navTitles: {
        days: '<span>MMMM</span> &nbsp; <i>yyyy</i>',
        months: 'yyyy',
        years: 'yyyy1 - yyyy2'
      },

      onChangeViewDate: () => {
        this.#refresh();
      },

      onSelect: !onSelection
        ? noop
        : ({ date }) => {
            onSelection(
              Array.isArray(date) ? date : date === undefined ? [] : [date],
              this.#selectionMode
            );
          }
    });
  }

  getElement() {
    return this.#elem;
  }

  setLocale(locale: string) {
    if (this.#locale === locale) {
      return;
    }

    this.#locale = locale;

    this.#localeSettings = getLocaleSettingsCached(
      locale,
      this.#getLocaleSettings
    );

    const options = {
      locale: getAirLocaleData(locale, this.#localeSettings)
    };

    this.#update(options);
  }

  setSelection(selection: Date | Date[]) {
    this.#update({
      selectedDates: Array.isArray(selection) ? selection : [selection]
    });
  }

  setSelectionMode(selectionMode: Calendar.SelectionMode) {
    if (this.#selectionMode === selectionMode) {
      return;
    }

    const options: Partial<AirDatepickerOptions> = {
      multipleDates: false,
      timepicker: false,
      onlyTimepicker: false,
      view: 'days',
      minView: 'days'
    };

    switch (selectionMode) {
      case 'date':
        break;

      case 'dates':
        options.multipleDates = true;
        break;

      case 'time':
        options.timepicker = true;
        options.onlyTimepicker = true;
        break;

      case 'dateTime':
        options.timepicker = true;
        break;

      case 'dateRange':
        options.range = true;
        break;

      case 'month':
        options.minView = 'months';
        options.view = 'months';
        break;

      case 'year':
        options.view = 'years';
        options.minView = 'years';
        break;
    }

    this.#selectionMode = selectionMode;
    this.#update(options);
  }

  setShowWeekNumbers(value: boolean) {
    if (value === this.#showWeekNumbers) {
      return;
    }

    this.#showWeekNumbers = true;
    this.#refresh();
  }

  setHighlightWeekends(value: boolean) {
    if (value === this.#highlightWeekends) {
      return;
    }

    this.#highlightWeekends = value;

    this.#update({
      weekends: (value ? this.#localeSettings.weekendDays : noWeekends) as any
    });
  }

  setButtons(
    buttons: {
      text: string;
      onClick: (calendar: Calendar, selection: Date[]) => void;
    }[]
  ) {
    this.#update({
      buttons: buttons.map((it) => ({
        content: it.text,
        onClick: () => {
          it.onClick(this, this.#picker.selectedDates);
        }
      }))
    });
  }

  getSelection(): Date[] {
    return [...this.#picker.selectedDates];
  }

  clear() {
    this.#picker.clear();
  }

  focus() {
    setTimeout(() => {
      if (this.#selectionMode !== 'time') {
        this.#input.focus();
      } else if (!this.#minuteSlider!.matches(':focus')) {
        this.#hourSlider!.focus();
      }
    }, 0);
  }

  #handleBlur = () => {
    setTimeout(() => {
      if (
        this.#onBlur &&
        !this.#input.matches(':focus') &&
        !this.#hourSlider?.matches(':focus') &&
        !this.#minuteSlider?.matches(':focus')
      ) {
        this.#onBlur();
      }
    }, 0);
  };

  #update = (options: Partial<AirDatepickerOptions>) => {
    this.#options = { ...this.#options, ...options };

    if (this.#picker) {
      this.#hourSlider = null;
      this.#minuteSlider = null;
      this.#picker.destroy();
    }

    this.#picker = new AirDatepicker(this.#input, this.#options);

    if (this.#selectionMode === 'dateTime' || this.#selectionMode === 'time') {
      this.#hourSlider = this.#picker.$datepicker.querySelector(
        'input[type=range][name=hours]'
      );

      this.#minuteSlider = this.#picker.$datepicker.querySelector(
        'input[type=range][name=minutes]'
      );

      this.#hourSlider?.addEventListener('blur', this.#handleBlur);
      this.#minuteSlider?.addEventListener('blur', this.#handleBlur);
    }

    this.#picker.$datepicker.addEventListener('mousedown', (ev: MouseEvent) => {
      if (
        ev.target instanceof HTMLInputElement ||
        ev.target instanceof HTMLButtonElement ||
        (ev.target instanceof HTMLSpanElement &&
          ev.target.parentElement instanceof HTMLButtonElement)
      ) {
        return;
      }

      ev.preventDefault();
      this.#input.focus();
    });
  };

  #refresh = () => {
    const dp = this.#picker.$datepicker;

    if (!this.#showWeekNumbers) {
      dp.classList.remove('-show-week-numbers-');
    } else {
      dp.classList.add('-show-week-numbers-');

      const header = dp.querySelector('.air-datepicker-body--day-names');

      if (!header) {
        return;
      }

      if (header.firstElementChild!.localName !== 'span') {
        const newCell = document.createElement('span');
        newCell.className = 'air-datepicker-body--week-numbers';
        header.prepend(newCell);
      }

      requestAnimationFrame(() => {
        const cellsContainer = dp.querySelector('.air-datepicker-body--cells')!;
        const cellCount = cellsContainer.childElementCount;

        if (cellsContainer.firstElementChild!.localName !== 'span') {
          for (let i = 0; i < Math.floor(cellCount / 7); ++i) {
            const weekStartCell = cellsContainer.children[i * 8];
            const newCell = document.createElement('span');

            // very ugly workaround!!!
            (newCell as any).adpCell = { isDisabled: true };

            const day = parseInt(weekStartCell.getAttribute('data-date')!);
            const month = parseInt(weekStartCell.getAttribute('data-month')!);
            const year = parseInt(weekStartCell.getAttribute('data-year')!);
            const date = new Date(year, month, day);

            newCell.innerText = String(
              this.#localeSettings.getCalendarWeek(date)
            );
            newCell.className = 'air-datepicker-cell -week-number-';
            cellsContainer.insertBefore(newCell, weekStartCell);
          }
        }
      });
    }
  };
}

// === helpers =======================================================

function getLocaleSettingsCached(
  locale: string,
  getLocaleSettings: (locale: string) => Calendar.LocaleSettings
): Calendar.LocaleSettings {
  let localeSettings = localeSettingsCache.get(locale);

  if (!localeSettings) {
    localeSettings = getLocaleSettings(locale);

    localeSettingsCache.set(locale, localeSettings);
  }

  return localeSettings;
}

function getAirLocaleData(
  locale: string,
  localeSettings: Calendar.LocaleSettings
): AirDatepickerLocale {
  let airLocaleData = airLocaleDataCache.get(locale);

  if (airLocaleData) {
    return airLocaleData;
  }

  airLocaleData = {
    days: localeSettings.daysShort,
    daysShort: localeSettings.daysShort,
    daysMin: localeSettings.daysShort,
    months: localeSettings.months,
    monthsShort: localeSettings.monthsShort,
    today: '', // not needed
    clear: '', // not needed
    dateFormat: 'yyyy-MM-dd',
    timeFormat: 'HH:mm',
    firstDay: localeSettings.firstDayOfWeek
  };

  airLocaleDataCache.set(locale, airLocaleData);

  return airLocaleData;
}

function getStyles() {
  return `
    :host {
      display: inline-block;
      position: relative;
      user-select: none;
    }

    .air-datepicker {
      --adp-padding: 0;
      --adp-border-radius: 0;
      --adp-cell-border-radius: 0;
      --adp-background-color-highlight: #fafafa;
    }

    .air-datepicker-nav--title i {
      color: var(--adp-nav-color);
    }

    .air-datepicker-body--day-names {
      margin: 0;
    }
    
    .air-datepicker-body--day-name {
      padding: 0.3rem 0;
    }

    .adp-date-input {
      position: absolute;
      opacity: 0;
      outline: none;
      max-width: 0;
      max-height: 0;
      overflow: hidden;
      border: none;
      z-index: -32000;
    }
    
    .air-datepicker-nav--title,
    .air-datepicker-body--day-name,
    .air-datepicker-cell.-month- {
      text-transform: capitalize;
    }

    .air-datepicker-time--current-hours.-focus-::after,
    .air-datepicker-time--current-minutes.-focus-::after {
      background-color: transparent;
    }
    
    .-weekend- {
      background-color: var(--adp-background-color-highlight);
    }

    .-show-week-numbers- .air-datepicker-body--day-names {
      grid-template-columns: repeat(8, var(--adp-day-cell-width));
    }

    .-show-week-numbers- .air-datepicker-body--cells.-days- {
      grid-template-columns: repeat(8, var(--adp-day-cell-width));
    }

    .air-datepicker-body--week-numbers,
    .air-datepicker-cell.-week-number- {
      padding-top: 0.1em;
      font-size: 80%;
      opacity: 70%;
      font-style: italic;
      border: 0 solid var(--adp-border-color-inner);
      border-right-width: 1px;
      border-style: solid;
      cursor: default;
    }
    
    .air-datepicker.-only-timepicker- .air-datepicker--time {
      padding: 1rem 0rem;
      border: none;
    }
  `;
}
