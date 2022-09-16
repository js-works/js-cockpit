import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators';
import { html } from 'lit';
import { classMap } from 'lit/directives/class-map';
import { repeat } from 'lit/directives/repeat';
import { when } from 'lit/directives/when';
import { LocalizeController } from '@shoelace-style/localize';
import { Calendar } from './calendar';
import { DatePickerController } from './date-picker-controller';

import {
  dateAttributeConverter,
  getCalendarWeek,
  getFirstDayOfWeek,
  getMonthName,
  getWeekdayName,
  getWeekendDays
} from './date-utils';

// custom elements
import SlRange from '@shoelace-style/shoelace/dist/components/range/range';

// styles
import calendarStyles from './date-picker.styles';

// === exports =======================================================

export { DatePicker };

// === exported types ==========================================

namespace DatePicker {
  export type SelectionMode = DatePickerController.SelectionMode;
}

// === local types ===================================================

type View = 'month' | 'year' | 'decade';

// === Calendar ======================================================

// dependencies of date picker component (to prevent too much tree shaking)
void SlRange;

@customElement('cp-date-picker')
class DatePicker extends LitElement {
  static styles = calendarStyles;

  @property({ type: String })
  get value() {
    return this._datePicker.getValue();
  }

  set value(value: string) {
    throw 'TODO'; // TODO!!!
  }

  @property({ type: String })
  selectionMode: DatePicker.SelectionMode = 'date';

  @property({ type: Boolean, attribute: 'show-week-number' })
  showWeekNumbers = false;

  @property({ type: Boolean, attribute: 'show-adjacent-days' })
  showAdjacentDays = false;

  @property({ type: Boolean, attribute: 'highlight-weekend' })
  highlightWeekend = false;

  @property({ type: Boolean, attribute: 'disable-weekend' })
  disableWeekend = false;

  @property({ type: Boolean, attribute: 'fixed-day-count' })
  fixedDayCount = false; // will be ignored if showAdjacentDays is false

  @property({ converter: dateAttributeConverter, attribute: 'min-date' }) // TODO!!!
  minDate: Date | null = null; //new Date(2022, 8, 11);

  @property({ converter: dateAttributeConverter, attribute: 'max-date' }) // TODO!!!
  maxDate: Date | null = null; //new Date(2023, 6, 27);

  private _localize = new LocalizeController(this);

  private _datePicker = new DatePickerController(
    this,
    () => this.selectionMode,
    () => this._localize.lang()
  );

  private _calendar!: Calendar; // will be set on `willUpdate`

  private _getLocale() {
    return this._localize.lang();
  }

  willUpdate() {
    this._calendar = new Calendar({
      localization: {
        firstDayOfWeek: getFirstDayOfWeek(this._getLocale()),
        weekendDays: getWeekendDays(this._getLocale()),

        getCalendarWeek: (date: Date) =>
          getCalendarWeek(this._getLocale(), date)
      },

      disableWeekend: this.disableWeekend,
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
      <style></style>
      ${Date.now()}
      <div class="cal-base cal-base--type-${typeSnakeCase}">
        <input class="cal-input" />
        ${when(
          this.selectionMode !== 'time',
          () => html`
            <div class="cal-header">
              <a class="cal-prev" data-action="prevClick">&#x1F860;</a>
              <div class="cal-title-container">${this._renderTitle()}</div>
              <a class="cal-next" data-action="nextClick">&#x1F862;</a>
            </div>
            ${sheet}
          `
        )}${when(
          this.selectionMode === 'dateTime' || this.selectionMode === 'time',
          () => html`
            <div class="cal-time-selector">
              <div class="cal-time">${this._renderTime()}</div>
              <sl-range
                class="cal-hour-slider"
                value=${this._datePicker.getActiveHour()}
                min="0"
                max="23"
                tooltip="none"
                @sl-change=${null /* TODO!!! */}
              ></sl-range>
              <sl-range
                class="cal-minute-slider"
                value=${this._datePicker.getActiveMinute()}
                min="0"
                max="59"
                tooltip="none"
                @sl-change=${null /* TODO!!! */}
              ></sl-range>
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
        ? this._datePicker.getActiveDecadeName()
        : scene === 'year'
        ? this._datePicker.getActiveYearName()
        : this._datePicker.getActiveMonthName();

    return html`<div class="cal-title" data-action="titleClick">${title}</div>`;
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
                ${getWeekdayName(this._getLocale(), idx, 'short')}
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
                    ${dayData.weekNumber}
                  </div>`,
                  cell
                ];
          }
        )}
      </div>
    `;
  }

  private _renderDayCell(dayData: Calendar.DayData) {
    const highlighted = this.highlightWeekend && dayData.weekend;

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
          'cal-cell--highlighted': highlighted,
          'cal-cell--selected': selected
        })}
        data-year=${dayData.year}
        data-month=${dayData.month}
        data-day=${dayData.day}
        data-action="dayClick"
      >
        ${dayData.day}
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

    return html`
      <div
        class=${classMap({
          'cal-cell': true,
          'cal-cell--disabled': monthData.disabled,
          'cal-cell--current': monthData.current,
          'cal-cell--selected': selected
        })}
        data-year=${monthData.year}
        data-month=${monthData.month}
        data-action="monthClick"
      >
        ${getMonthName(this._getLocale(), monthData.month, 'short')}
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

    return html`
      <div
        class=${classMap({
          'cal-cell': true,
          'cal-cell--disabled': yearData.disabled,
          'cal-cell--current': yearData.current,
          'cal-cell--selected': selected
        })}
        data-year=${yearData.year}
        data-action="yearClick"
      >
        ${yearData.year}
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
