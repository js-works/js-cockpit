import { html, LitElement } from 'lit';
import type { ComplexAttributeConverter } from 'lit';
import { property } from 'lit/decorators';
import { DatePickerController } from './date-picker-controller';
import { renderDatePicker } from './date-picker-render';

// === exports =======================================================

export { LitDatePicker };

// === exported types ==========================================

namespace LitDatePicker {
  export type SelectionMode = DatePickerController.SelectionMode;
}

// === converters ====================================================

const dateAttributeConverter: ComplexAttributeConverter<Date | null, Date> = {
  fromAttribute(value) {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return null;
    }

    return new Date(value);
  },

  toAttribute(date) {
    if (!date) {
      return '';
    }

    return (
      String(date.getFullYear()).padStart(4, '0') +
      '-' +
      String(date.getMonth()).padStart(2, '0') +
      '-' +
      String(date.getDate()).padStart(2, '0')
    );
  }
};

// === Calendar ======================================================

abstract class LitDatePicker extends LitElement {
  @property({ type: String })
  get value() {
    return this._datePicker.getValue();
  }

  set value(value: string) {
    this._datePicker.setValue(value);
  }

  @property({ type: String, attribute: 'selection-mode' })
  selectionMode: LitDatePicker.SelectionMode = 'date';

  @property({ type: Boolean, attribute: 'elevate-navigation' })
  elevateNavigation = false;

  @property({ type: Boolean, attribute: 'show-week-numbers' })
  showWeekNumbers = false;

  @property({ type: Boolean, attribute: 'show-adjacent-days' })
  showAdjacentDays = false;

  @property({ type: Boolean, attribute: 'highlight-today' })
  highlightToday = false;

  @property({ type: Boolean, attribute: 'highlight-weekends' })
  highlightWeekends = false;

  @property({ type: Boolean, attribute: 'disable-weekends' })
  disableWeekends = false;

  @property({ type: Boolean, attribute: 'enable-century-view' })
  enableCenturyView = false;

  @property({ type: Boolean, attribute: 'fixed-day-count' })
  fixedDayCount = false; // will be ignored if showAdjacentDays is false

  @property({ converter: dateAttributeConverter, attribute: 'min-date' })
  minDate: Date | null = null;

  @property({ converter: dateAttributeConverter, attribute: 'max-date' })
  maxDate: Date | null = null;

  @property({ type: String, reflect: true })
  lang = '';

  @property({ type: String, reflect: true })
  dir = '';

  private _getLocale: () => string;
  private _getDirection: () => 'ltr' | 'rtl';
  private _datePicker: DatePickerController;

  constructor(params: {
    getLocale: () => string;
    getDirection: () => 'ltr' | 'rtl';
  }) {
    super();

    this._getLocale = params.getLocale;
    this._getDirection = params.getDirection;

    this._datePicker = new DatePickerController(this, {
      getSelectionMode: () => this.selectionMode
    });
  }

  render() {
    return renderDatePicker(
      this._getLocale(),
      this._getDirection(),
      this,
      this._datePicker
    );
  }
}
