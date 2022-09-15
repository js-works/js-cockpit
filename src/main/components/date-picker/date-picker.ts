import { LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators';
import { html } from 'lit';
import { classMap } from 'lit/directives/class-map';
import { repeat } from 'lit/directives/repeat';
import { when } from 'lit/directives/when';
import { LocalizeController } from '@shoelace-style/localize';
import { Calendar } from './calendar';

import {
  getCalendarWeek,
  getFirstDayOfWeek,
  getYearMonthDayString,
  getYearMonthString,
  getYearString,
  getYearWeekString,
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
  export type Type =
    | 'date'
    | 'dates'
    | 'time'
    | 'dateTime'
    | 'dateRange'
    | 'week'
    | 'weeks'
    | 'month'
    | 'months'
    | 'year'
    | 'years';
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
  type: DatePicker.Type = 'date';

  @property({ type: Boolean })
  showWeekNumbers = false;

  @property({ type: Boolean })
  highlightWeekend = false;

  @property({ type: Boolean })
  disableWeekend = false;

  @property({ type: Boolean })
  variableDayCellCount = false;

  @property(/* Attrs.date */) // TODO!!!
  minDate: Date | null = new Date(2022, 8, 11);

  @property(/* Attrs.date */) // TODO!!!
  maxDate: Date | null = new Date(2023, 7, 27);

  @state()
  private _view: View = 'month';

  @state()
  private _activeYear = new Date().getFullYear();

  @state()
  private _activeMonth = new Date().getMonth();

  @state()
  private _activeHour = new Date().getHours();

  @state()
  private _activeMinute = new Date().getMinutes();

  private _selectedDays = new Set<string>();
  private _selectedMonths = new Set<string>();
  private _selectedYears = new Set<string>();

  private _localize = new LocalizeController(this);
  private _calendar!: Calendar; // will be set on `willUpdate`

  private _getLocale() {
    return this._localize.lang();
  }

  private _getActiveMonthName() {
    const date = new Date(this._activeYear, this._activeMonth, 1);
    return this._localize.date(date, { year: 'numeric', month: 'long' });
  }

  private _getActiveYearName() {
    const date = new Date(this._activeYear, 0, 1);
    return this._localize.date(date, { year: 'numeric' });
  }

  private _getActiveDecadeName() {
    const startYear = Math.floor(this._activeYear / 10) * 10;

    return Intl.DateTimeFormat(this._getLocale(), {
      year: 'numeric'
    }).formatRange(new Date(startYear, 1, 1), new Date(startYear + 11, 1, 1));
  }

  private _getCalendar(): Calendar {
    return new Calendar({
      localization: {
        firstDayOfWeek: getFirstDayOfWeek(this._getLocale()),
        weekendDays: getWeekendDays(this._getLocale()),

        getCalendarWeek: (date: Date) =>
          getCalendarWeek(this._getLocale(), date)
      },

      disableWeekend: this.disableWeekend,
      alwaysShow42Days: !this.variableDayCellCount,
      minDate: this.minDate,
      maxDate: this.maxDate
    });
  }

  private _onPrevOrNextClick = (ev: MouseEvent) => {
    const signum = (ev.target as HTMLElement).classList.contains('prev')
      ? -1
      : 1;

    switch (this._view) {
      case 'month': {
        let n = this._activeYear * 12 + this._activeMonth + signum;
        this._activeYear = Math.floor(n / 12);
        this._activeMonth = n % 12;
        return;
      }

      case 'year':
        this._activeYear += signum;
        return;

      case 'decade':
        this._activeYear += signum * 11;
        return;
    }
  };

  private _onHourChange = (ev: Event) => {
    this._activeHour = (ev.target as SlRange).value;
  };

  private _onMinuteChange = (ev: Event) => {
    this._activeMinute = (ev.target as SlRange).value;
  };

  private _onDayClick = (ev: Event) => {
    const elem = ev.target as HTMLElement;
    const year = parseInt(elem.getAttribute('data-year')!, 10);
    const month = parseInt(elem.getAttribute('data-month')!, 10);
    const day = parseInt(elem.getAttribute('data-day')!, 10);
    const dateString = getYearMonthDayString(year, month, day);

    switch (this.type) {
      case 'date':
      case 'dateTime':
        toggleSetEntry(this._selectedDays, dateString, true);
        break;

      case 'dates':
        toggleSetEntry(this._selectedDays, dateString);
        break;
    }

    this.requestUpdate();
  };

  private _onMonthClick = (ev: Event) => {
    const elem = ev.target as HTMLElement;
    const year = parseInt(elem.getAttribute('data-year')!, 10);
    const month = parseInt(elem.getAttribute('data-month')!, 10);

    this._activeYear = year;
    this._activeMonth = month;
    this._view = 'month';

    const monthString = getYearMonthString(year, month);

    switch (this.type) {
      case 'month':
        toggleSetEntry(this._selectedMonths, monthString, true);
        break;

      case 'months':
        toggleSetEntry(this._selectedMonths, monthString);
        break;
    }

    this.requestUpdate();
  };

  private _onYearClick = (ev: Event) => {
    const elem = ev.target as HTMLElement;
    const year = parseInt(elem.getAttribute('data-year')!, 10);

    this._activeYear = year;
    this._view = 'year';

    const yearString = getYearString(year);

    switch (this.type) {
      case 'year':
        toggleSetEntry(this._selectedYears, yearString, true);
        break;

      case 'years':
        toggleSetEntry(this._selectedYears, yearString);
        break;
    }

    this.requestUpdate();
  };

  willUpdate() {
    this._calendar = this._getCalendar();

    // TODO!
    if (
      (this.type === 'month' || this.type === 'months') &&
      this._view === 'month'
    ) {
      this._view = 'year';
    } else if (this.type === 'year' || this.type === 'years') {
      this._view = 'decade';
    }
  }

  render() {
    const sheet = {
      month: this._renderMonthSheet,
      year: this._renderYearSheet,
      decade: this._renderDecadeSheet
    }[this._view].call(this);

    const typeSnakeCase = this.type.replace(
      /[A-Z]/g,
      (it) => `-${it.toLowerCase()}`
    );

    return html`
      <style></style>
      <div class="base base--type-${typeSnakeCase}">
        <input class="input" />
        ${when(
          this.type !== 'time',
          () => html`
            <div class="header">
              <a class="prev" @click=${this._onPrevOrNextClick}>&#x1F860;</a>
              <div class="title-container">${this._renderTitle()}</div>
              <a class="next" @click=${this._onPrevOrNextClick}>&#x1F862;</a>
            </div>
            ${sheet}
          `
        )}${when(
          this.type === 'dateTime' || this.type === 'time',
          () => html`
            <div class="time-selector">
              <div class="time">${this._renderTime()}</div>
              <sl-range
                class="hour-slider"
                value=${this._activeHour}
                min="0"
                max="23"
                tooltip="none"
                @sl-change=${this._onHourChange}
              ></sl-range>
              <sl-range
                class="minute-slider"
                value=${this._activeMinute}
                min="0"
                max="59"
                tooltip="none"
                @sl-change=${this._onMinuteChange}
              ></sl-range>
            </div>
          `
        )}
      </div>
    `;
  }

  private _renderTitle() {
    const title = {
      month: this._getActiveMonthName,
      year: this._getActiveYearName,
      decade: this._getActiveDecadeName
    }[this._view].call(this);

    const onClick =
      this._view === 'decade'
        ? null
        : () => (this._view = this._view === 'year' ? 'decade' : 'year');

    return html`<div class="title" @click=${onClick}>${title}</div>`;
  }

  private _renderMonthSheet() {
    const view = this._calendar.getMonthView(
      this._activeYear,
      this._activeMonth
    );

    return html`
      <div
        class=${classMap({
          'sheet': true,
          'sheet--month': true,
          'sheet--month-with-week-numbers': this.showWeekNumbers
        })}
      >
        ${when(this.showWeekNumbers, () => html`<div></div>`)}
        ${repeat(
          view.weekdays,
          (idx) => idx,
          (idx) =>
            html`<div class="weekday">
              ${getWeekdayName(this._getLocale(), idx, 'short')}
            </div>`
        )}
        ${repeat(
          view.days,
          (dayData) => dayData.month * 100 + dayData.day,
          (dayData, idx) => {
            const cell = this._renderDayCell(dayData);
            return !this.showWeekNumbers || idx % 7 > 0
              ? cell
              : [
                  html`<div class="week-number">${dayData.weekNumber}</div>`,
                  cell
                ];
          }
        )}
      </div>
    `;
  }

  private _renderDayCell(dayData: Calendar.DayData) {
    const selected = this._selectedDays.has(
      getYearMonthDayString(dayData.year, dayData.month, dayData.day)
    );

    return html`
      <div
        class=${classMap({
          'cell': true,
          'cell--disabled': dayData.disabled,
          'cell--adjacent': dayData.adjacent,
          'cell--current': dayData.current,
          'cell--highlighted': this.highlightWeekend && dayData.weekend,
          'cell--selected': selected
        })}
        data-year=${dayData.year}
        data-month=${dayData.month}
        data-day=${dayData.day}
        @click=${dayData.disabled ? null : this._onDayClick}
      >
        ${dayData.day}
      </div>
    `;
  }

  private _renderYearSheet() {
    const view = this._calendar.getYearView(this._activeYear);

    return html`
      <div class="sheet sheet--year">
        ${repeat(
          view.months,
          (monthData) => monthData.month,
          (monthData, idx) => this._renderMonthCell(monthData)
        )}
      </div>
    `;
  }

  private _renderMonthCell(monthData: Calendar.MonthData) {
    const selected = this._selectedMonths.has(
      getYearMonthString(monthData.year, monthData.month)
    );

    return html`
      <div
        class=${classMap({
          'cell': true,
          'cell--disabled': monthData.disabled,
          'cell--current': monthData.current,
          'cell--selected': selected
        })}
        data-year=${monthData.year}
        data-month=${monthData.month}
        @click=${monthData.disabled ? null : this._onMonthClick}
      >
        ${getMonthName(this._getLocale(), monthData.month, 'short')}
      </div>
    `;
  }

  private _renderDecadeSheet() {
    const view = this._calendar.getDecadeView(this._activeYear);

    return html`
      <div class="sheet sheet--decade">
        ${repeat(
          view.years,
          (monthData) => monthData.year,
          (monthData, idx) => this._renderYearCell(monthData)
        )}
      </div>
    `;
  }

  private _renderYearCell(yearData: Calendar.YearData) {
    const selected = this._selectedYears.has(getYearString(yearData.year));

    return html`
      <div
        class=${classMap({
          'cell': true,
          'cell--disabled': yearData.disabled,
          'cell--current': yearData.current,
          'cell--selected': selected
        })}
        data-year=${yearData.year}
        @click=${yearData.disabled ? null : this._onYearClick}
      >
        ${yearData.year}
      </div>
    `;
  }

  private _renderTime() {
    const date = new Date(1970, 0, 1, this._activeHour, this._activeMinute);
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
      <div class="time">
        ${time}
        ${!dayPeriod
          ? null
          : html`<span class="day-period">${dayPeriod}</span>`}
      </div>
    `;
  }
}

// === helpers =======================================================

function toggleSetEntry<T>(values: Set<T>, value: T, clear = false) {
  const hasValue = values.has(value);

  if (clear) {
    values.clear();
  }

  if (!hasValue) {
    values.add(value);
  } else if (!clear) {
    values.delete(value);
  }
}
