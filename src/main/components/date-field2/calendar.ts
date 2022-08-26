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
  export type Options = {
    locale: string;
    selectionMode: SelectionMode;
    onSelect: (selection: Date[]) => void;
  };

  export type SelectionMode =
    | 'date'
    | 'dates'
    | 'time'
    | 'dateTime'
    | 'dateRange'
    | 'month'
    | 'year';
}

// === local types ===================================================

// === local data ====================================================

const defaultLocale = 'en-US';

const defaultOptions: Calendar.Options = {
  locale: 'en',
  selectionMode: 'date',
  onSelect: () => {}
};

const airLocaleDataCache = new Map<string, AirDatepickerLocale>();

// === class Calendar ================================================

class Calendar {
  #options = defaultOptions;
  #elem = document.createElement('div');
  #input: HTMLInputElement;
  #picker!: AirDatepicker;
  #baseAirOptions: Partial<AirDatepickerOptions>;

  static #styles = `
    :host {
      display: inline-block;
      position: relative;
      user-select: none;
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
  `;

  constructor(options?: Partial<Calendar.Options>) {
    const datepickerStyleElem = document.createElement('style');
    const auxStyleElem = document.createElement('style');
    const inputElem = document.createElement('input');
    const pickerContainerElem = document.createElement('div');

    this.#input = inputElem;
    this.#elem.attachShadow({ mode: 'open' });

    this.#elem.shadowRoot!.append(
      datepickerStyleElem,
      auxStyleElem,
      inputElem,
      pickerContainerElem
    );

    this.#elem.className = 'adp-base';
    datepickerStyleElem.innerText = datepickerStyles;
    auxStyleElem.innerText = Calendar.#styles;
    inputElem.className = 'adp-date-input';
    pickerContainerElem.className = 'adp-picker-container';

    this.#baseAirOptions = {
      inline: true,
      container: pickerContainerElem,
      keyboardNav: true
    };

    //this.#picker = new AirDatepicker(inputElem, this.#baseAirOptions);

    this.setOptions(options || defaultOptions);
  }

  getElement() {
    return this.#elem;
  }

  mergeOptions(options: Partial<Calendar.Options>) {
    this.#options = { ...this.#options, ...options };
  }

  setOptions(options: Partial<Calendar.Options>) {
    this.#options = { ...defaultOptions, ...options };
    const airOptions = {
      ...convertOptions(this.#options),
      ...this.#baseAirOptions
    };

    if (this.#picker) {
      this.#picker.destroy();
    }

    this.#picker = new AirDatepicker(this.#input, airOptions);

    this.#picker.$datepicker.addEventListener('click', () => {
      this.#input.focus();
    });
  }
}

// === helpers =======================================================

function convertOptions(
  options: Calendar.Options
): Partial<AirDatepickerOptions> {
  const ret: Partial<AirDatepickerOptions> = {};

  ret.locale = getAirLocaleData(options.locale || defaultLocale);

  if (options.onSelect) {
    const onSelect = options.onSelect;
    ret.onSelect = ({ date }) => onSelect(Array.isArray(date) ? date : [date]);
  }

  switch (options.selectionMode) {
    case 'date':
      ret.multipleDates = false;
      ret.view = 'days';
      ret.timepicker = false;
      ret.onlyTimepicker = false;
      ret.minView = 'days';
      break;

    case 'dates':
      ret.multipleDates = true;
      ret.view = 'days';
      ret.timepicker = false;
      ret.onlyTimepicker = false;
      ret.minView = 'days';
      break;

    case 'time':
      ret.multipleDates = false;
      ret.timepicker = true;
      ret.onlyTimepicker = true;
      break;

    case 'dateTime':
      ret.multipleDates = false;
      ret.view = 'days';
      ret.timepicker = true;
      ret.onlyTimepicker = false;
      ret.minView = 'days';
      break;

    case 'dateRange':
      ret.multipleDates = false;
      ret.range = true;
      ret.view = 'days';
      ret.timepicker = false;
      ret.onlyTimepicker = false;
      ret.minView = 'days';
      break;

    case 'month':
      ret.timepicker = false;
      ret.onlyTimepicker = false;
      ret.minView = 'months';
      ret.view = 'months';
      break;

    case 'year':
      ret.timepicker = false;
      ret.onlyTimepicker = false;
      ret.view = 'years';
      ret.minView = 'years';
      break;
  }

  return ret;
}

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
