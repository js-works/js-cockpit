import { html, LitElement } from 'lit';
import type { ComplexAttributeConverter } from 'lit';
import { property } from 'lit/decorators';
import { classMap } from 'lit/directives/class-map';
import { createRef, ref } from 'lit/directives/ref';
import { repeat } from 'lit/directives/repeat';
import { when } from 'lit/directives/when';
import { Calendar } from './calendar';
import { DatePickerController } from './date-picker-controller';

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

  private _datePicker = new DatePickerController(this, {
    getLocale: () => this._getLocale(),
    getSelectionMode: () => this.selectionMode
  });

  private _getLocale: () => string;
  private _getDirection: () => 'ltr' | 'rtl';
  private _inputRef = createRef<HTMLInputElement>();
  private _calendar!: Calendar; // will be set on `willUpdate`

  constructor(params: {
    getLocale: () => string;
    getDirection: () => 'ltr' | 'rtl';
  }) {
    super();
    this._getLocale = params.getLocale;
    this._getDirection = params.getDirection;
  }

  willUpdate() {
    this._calendar = new Calendar({
      firstDayOfWeek: this._datePicker.getFirstDayOfWeek(),
      weekendDays: this._datePicker.getWeekendDays(),
      getCalendarWeek: (date: Date) => this._datePicker.getCalendarWeek(date),
      disableWeekends: this.disableWeekends,
      alwaysShow42Days: this.fixedDayCount && this.showAdjacentDays,
      minDate: this.minDate,
      maxDate: this.maxDate
    });
  }

  render() {
    const scene = this._datePicker.getScene();

    const sheet =
      scene === 'decade'
        ? this._renderDecadeSheet()
        : scene === 'year'
        ? this._renderYearSheet()
        : this._renderMonthSheet();

    const typeSnakeCase = this.selectionMode.replace(
      /[A-Z]/g,
      (it) => `-${it.toLowerCase()}`
    );

    return html`
      <div class="cal-base cal-base--type-${typeSnakeCase}">
        <input class="cal-input" ${ref(this._inputRef)} />
        ${when(
          this.selectionMode !== 'time',
          () => html`
            <div
              class=${classMap({
                'cal-nav': true,
                'cal-nav--elevated': this.elevateNavigation
              })}
              part="navigation"
            >
              <a class="cal-prev" data-subject="prev" part="prev-button">
                ${when(
                  this._getDirection() === 'ltr',
                  () => html`&#x1F860`,
                  () => html`&#x1F862`
                )}
              </a>
              ${this._renderTitle()}
              <a class="cal-next" data-subject="next" part="next-button">
                ${when(
                  this._getDirection() === 'ltr',
                  () => html`&#x1F862`,
                  () => html`&#x1F860`
                )}
              </a>
            </div>
            ${sheet}
          `
        )}${when(
          this.selectionMode === 'dateTime' || this.selectionMode === 'time',
          () => html`
            <div class="cal-time-selector">
              <div class="cal-time">${this._renderTime()}</div>
              <input
                type="range"
                class="cal-hour-slider"
                value=${this._datePicker.getActiveHour()}
                min="0"
                max="23"
                tooltip="none"
                data-subject="hours"
              />
              <input
                type="range"
                class="cal-minute-slider"
                value=${this._datePicker.getActiveMinute()}
                min="0"
                max="59"
                tooltip="none"
                data-subject="minutes"
              />
            </div>
          `
        )}
      </div>
    `;
  }

  private _renderTitle() {
    const scene = this._datePicker.getScene();

    const title =
      scene === 'decade'
        ? this._datePicker.getDecadeTitle()
        : scene === 'year'
        ? this._datePicker.getYearTitle()
        : this._datePicker.getMonthTitle();

    return html`<div
      part="title"
      class=${classMap({
        'cal-title': true,
        'cal-title--disabled': this._datePicker.getScene() === 'decade'
      })}
      data-subject="title"
    >
      ${title}
    </div>`;
  }

  private _renderMonthSheet() {
    const view = this._calendar.getMonthView(
      this._datePicker.getActiveYear(),
      this._datePicker.getActiveMonth()
    );

    return html`
      <div
        class=${classMap({
          'cal-sheet': true,
          'cal-sheet--month': true,
          'cal-sheet--month-with-week-numbers': this.showWeekNumbers
        })}
      >
        ${when(this.showWeekNumbers, () => html`<div></div>`)}
        ${repeat(
          view.weekdays,
          (idx) => idx,
          (idx) =>
            html`
              <div class="cal-weekday">
                ${this._datePicker.getWeekdayName(idx, 'short')}
              </div>
            `
        )}
        ${repeat(
          view.days,
          (dayData) => dayData.month * 100 + dayData.day,
          (dayData, idx) => {
            const cell = this._renderDayCell(dayData);
            return !this.showWeekNumbers || idx % 7 > 0
              ? cell
              : [
                  html`<div class="cal-week-number">
                    ${this._datePicker.formatWeekNumber(dayData.weekNumber)}
                  </div>`,
                  cell
                ];
          }
        )}
      </div>
    `;
  }

  private _renderDayCell(dayData: Calendar.DayData) {
    const currentHighlighted = this.highlightToday && dayData.current;
    const highlighted = this.highlightWeekends && dayData.weekend;

    if (!this.showAdjacentDays && dayData.adjacent) {
      return html`
        <div class=${classMap({ 'cal-cell--highlighted': highlighted })}></div>
      `;
    }

    const selected = this._datePicker.hasSelectedDay(
      dayData.year,
      dayData.month,
      dayData.day
    );

    return html`
      <div
        class=${classMap({
          'cal-cell': true,
          'cal-cell--disabled': dayData.disabled,
          'cal-cell--adjacent': dayData.adjacent,
          'cal-cell--current': dayData.current,
          'cal-cell--current-highlighted': currentHighlighted,
          'cal-cell--highlighted': highlighted,
          'cal-cell--selected': selected
        })}
        data-year=${dayData.year}
        data-month=${dayData.month}
        data-day=${dayData.day}
        data-subject="day"
      >
        ${this._datePicker.formatDay(dayData.day)}
      </div>
    `;
  }

  private _renderYearSheet() {
    const view = this._calendar.getYearView(this._datePicker.getActiveYear());

    return html`
      <div class="cal-sheet cal-sheet--year">
        ${repeat(
          view.months,
          (monthData) => monthData.month,
          (monthData, idx) => this._renderMonthCell(monthData)
        )}
      </div>
    `;
  }

  private _renderMonthCell(monthData: Calendar.MonthData) {
    const selected = this._datePicker.hasSelectedMonth(
      monthData.year,
      monthData.month
    );

    const currentHighlighted = monthData.current && this.highlightToday;

    return html`
      <div
        class=${classMap({
          'cal-cell': true,
          'cal-cell--disabled': monthData.disabled,
          'cal-cell--current': monthData.current,
          'cal-cell--current-highlighted': currentHighlighted,
          'cal-cell--selected': selected
        })}
        data-year=${monthData.year}
        data-month=${monthData.month}
        data-subject="month"
      >
        ${this._datePicker.getMonthName(monthData.month, 'short')}
      </div>
    `;
  }

  private _renderDecadeSheet() {
    const view = this._calendar.getDecadeView(this._datePicker.getActiveYear());

    return html`
      <div class="cal-sheet cal-sheet--decade">
        ${repeat(
          view.years,
          (monthData) => monthData.year,
          (monthData, idx) => this._renderYearCell(monthData)
        )}
      </div>
    `;
  }

  private _renderYearCell(yearData: Calendar.YearData) {
    const selected = this._datePicker.hasSelectedYear(yearData.year);
    const currentHighlighted = this.highlightToday && yearData.current;

    return html`
      <div
        class=${classMap({
          'cal-cell': true,
          'cal-cell--disabled': yearData.disabled,
          'cal-cell--current': yearData.current,
          'cal-cell--current-highlighted': currentHighlighted,
          'cal-cell--selected': selected
        })}
        data-year=${yearData.year}
        data-subject="year"
      >
        ${this._datePicker.formatYear(yearData.year)}
      </div>
    `;
  }

  private _renderTime() {
    const date = new Date(
      1970,
      0,
      1,
      this._datePicker.getActiveHour(),
      this._datePicker.getActiveMinute()
    );
    let time = '';
    let dayPeriod = '';

    const parts = new Intl.DateTimeFormat(this._getLocale(), {
      hour: '2-digit',
      minute: '2-digit'
    }).formatToParts(date);

    if (
      parts.length > 4 &&
      parts[parts.length - 1].type === 'dayPeriod' &&
      parts[parts.length - 2].type === 'literal' &&
      parts[parts.length - 2].value === ' '
    ) {
      time = parts
        .slice(0, -2)
        .map((it) => it.value)
        .join('');

      dayPeriod = parts[parts.length - 1].value;
    } else {
      time = parts.map((it) => it.value).join('');
    }

    return html`
      <div class="cal-time">
        ${time}
        ${!dayPeriod
          ? null
          : html`<span class="cal-day-period">${dayPeriod}</span>`}
      </div>
    `;
  }
}
