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
  #showWeekNumbers = false;
  #onBlur: (() => void) | null = null;

  #i18n = new I18nFacade(() => this.#locale);

  constructor({
    className,
    styles: customStyles,
    onSelection,
    onBlur
  }: {
    className?: string;
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
      locale: getAirLocaleData(defaultLocale),
      weekends: noWeekends,

      onChangeViewDate: (params) => {
        this.#refresh();
      },

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

    this.#picker.$datepicker.addEventListener('mousedown', (ev: Event) => {
      if (ev.target instanceof HTMLInputElement) {
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
        header.prepend(document.createElement('span'));
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

            newCell.innerText = String(this.#i18n.getCalendarWeek(date));
            newCell.className = 'air-datepicker-cell -week-number-';
            cellsContainer.insertBefore(newCell, weekStartCell);
          }
        }
      });
    }
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


    .-show-week-numbers- .air-datepicker-body--day-names {
      grid-template-columns: repeat(8, var(--adp-day-cell-width));
    }

    .-show-week-numbers- .air-datepicker-body--cells.-days- {
      grid-template-columns: repeat(8, var(--adp-day-cell-width));
    }

    .air-datepicker-cell.-week-number- {
      padding-top: 0.1em;
      font-size: 80%;
      opacity: 70%;
      font-style: italic;
      background-color: #f4f4f4;
    }

  `;
}
