import { I18nFacade } from '../../i18n/i18n';

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
    | 'time'
    | 'dateTime'
    | 'dateRange'
    | 'month'
    | 'year';
}

// === local types ===================================================

// === local data ====================================================

const defaultLocale = 'en-US';
const noop = () => {};
const noWeekends: [number, number] = [-1, -1];
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
  #selectionMode: Calendar.SelectionMode = 'date';
  #highlightWeekends = false;
  #onBlur: (() => void) | null = null;

  #i18n = new I18nFacade(() => this.#locale);

  constructor({
    styles: customStyles,
    onSelection,
    onBlur
  }: {
    styles?: string;
    onSelection?: (selection: Date[]) => void;
    onBlur?: () => void;
  }) {
    const datepickerStyleElem = document.createElement('style');
    const customStyleElem = document.createElement('style');
    const inputElem = document.createElement('input');
    const pickerContainerElem = document.createElement('div');

    this.#input = inputElem;
    this.#elem.attachShadow({ mode: 'open' });

    this.#elem.shadowRoot!.append(
      datepickerStyleElem,
      customStyleElem,
      inputElem,
      pickerContainerElem
    );

    this.#elem.className = 'adp-base';
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
      locale: getAirLocaleData(defaultLocale),
      weekends: noWeekends,

      onSelect: !onSelection
        ? noop
        : ({ date }) => {
            onSelection(
              Array.isArray(date) ? date : date === undefined ? [] : [date]
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

    const options = {
      locale: getAirLocaleData(locale)
    };

    this.#locale = locale;
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

    const options: Partial<AirDatepickerOptions> = {};

    switch (selectionMode) {
      case 'date':
        options.multipleDates = false;
        options.view = 'days';
        options.timepicker = false;
        options.onlyTimepicker = false;
        options.minView = 'days';
        break;

      case 'time':
        options.multipleDates = false;
        options.timepicker = true;
        options.onlyTimepicker = true;
        break;

      case 'dateTime':
        options.multipleDates = false;
        options.view = 'days';
        options.timepicker = true;
        options.onlyTimepicker = false;
        options.minView = 'days';
        break;

      case 'dateRange':
        options.multipleDates = false;
        options.range = true;
        options.view = 'days';
        options.timepicker = false;
        options.onlyTimepicker = false;
        options.minView = 'days';
        break;

      case 'month':
        options.timepicker = false;
        options.onlyTimepicker = false;
        options.minView = 'months';
        options.view = 'months';
        break;

      case 'year':
        options.timepicker = false;
        options.onlyTimepicker = false;
        options.view = 'years';
        options.minView = 'years';
        break;
    }

    this.#selectionMode = selectionMode;
    this.#update(options);
  }

  setHighlightWeekends(value: boolean) {
    if (value === this.#highlightWeekends) {
      return;
    }

    this.#highlightWeekends = value;

    this.#update({
      weekends: (value ? this.#i18n.getWeekendDays() : noWeekends) as any
    });
  }

  focus() {
    setTimeout(() => void this.#input.focus(), 0);
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

    const preventInputBlur = (ev: Event) => {
      if (ev.target instanceof HTMLInputElement) {
        return;
      }

      ev.preventDefault();
      this.#input.focus();
    };

    this.#picker.$datepicker
      .querySelectorAll(
        '.air-datepicker-nav, .air-datepicker--content, .air-datepicker-time'
      )
      .forEach((elem) => elem.addEventListener('mousedown', preventInputBlur));
  };
}

// === helpers =======================================================

function getAirLocaleData(locale: string): AirDatepickerLocale {
  let airLocaleData = airLocaleDataCache.get(locale);

  if (airLocaleData) {
    return airLocaleData;
  }

  const i18n = new I18nFacade(() => locale);

  airLocaleData = {
    days: i18n.getDayNames('long'),
    daysShort: i18n.getDayNames('short'),
    daysMin: i18n.getDayNames('short'),
    months: i18n.getMonthNames('long'),
    monthsShort: i18n.getMonthNames('short'),
    today: '', // not needed
    clear: '', // not needed
    dateFormat: 'yyyy-MM-dd',
    timeFormat: 'HH:mm',
    firstDay: i18n.getFirstDayOfWeek() as 0 | 1 | 2 | 3 | 4 | 5 | 6
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
  `;
}
