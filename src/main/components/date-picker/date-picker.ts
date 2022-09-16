import { LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators';
import { html } from 'lit';
import { classMap } from 'lit/directives/class-map';
import { repeat } from 'lit/directives/repeat';
import { when } from 'lit/directives/when';
import { LocalizeController } from '@shoelace-style/localize';
import { Calendar } from './calendar';
import { DatePickerStore } from './date-picker-store';

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
  export type Type =
    | 'date'
    | 'dates'
    | 'time'
    | 'dateTime'
    // | 'dateRange'
    // | 'week'
    // | 'weeks'
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
  get value() {
    return this._store.getValue();
  }

  set value(value: string) {
    throw 'TODO'; // TODO!!!
  }

  @property({ type: String })
  type: DatePicker.Type = 'date';

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

  private _store = new DatePickerStore(() => this.requestUpdate());
  private _localize = new LocalizeController(this);
  private _calendar!: Calendar; // will be set on `willUpdate`

  private _getLocale() {
    return this._localize.lang();
  }

  private _getActiveMonthName() {
    const date = new Date(
      this._store.getActiveYear(),
      this._store.getActiveMonth(),
      1
    );
    return this._localize.date(date, { year: 'numeric', month: 'long' });
  }

  private _getActiveYearName() {
    const date = new Date(this._store.getActiveYear(), 0, 1);
    return this._localize.date(date, { year: 'numeric' });
  }

  private _getActiveDecadeName() {
    const startYear = Math.floor(this._store.getActiveYear() / 10) * 10;

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
      alwaysShow42Days: this.fixedDayCount && this.showAdjacentDays,
      minDate: this.minDate,
      maxDate: this.maxDate
    });
  }

  private _onPrevOrNextClick = (ev: MouseEvent) => {
    if ((ev.target as HTMLElement).classList.contains('prev')) {
      this._store.clickPrev();
    } else {
      this._store.clickNext();
    }
  };

  private _onHourChange = (ev: Event) => {
    this._store.setActiveHour((ev.target as SlRange).value);
  };

  private _onMinuteChange = (ev: Event) => {
    this._store.setActiveMinute((ev.target as SlRange).value);
  };

  private _onDayClick = (ev: Event) => {
    const elem = ev.target as HTMLElement;
    const year = parseInt(elem.getAttribute('data-year')!, 10);
    const month = parseInt(elem.getAttribute('data-month')!, 10);
    const day = parseInt(elem.getAttribute('data-day')!, 10);

    this._store.clickDay(year, month, day);
  };

  private _onMonthClick = (ev: Event) => {
    const elem = ev.target as HTMLElement;
    const year = parseInt(elem.getAttribute('data-year')!, 10);
    const month = parseInt(elem.getAttribute('data-month')!, 10);

    this._store.clickMonth(year, month);
  };

  private _onYearClick = (ev: Event) => {
    const elem = ev.target as HTMLElement;
    const year = parseInt(elem.getAttribute('data-year')!, 10);

    this._store.clickYear(year);
  };

  override update(changedProperties: PropertyValues) {
    //if (changedProperties.get('type')) {
    this._store.setSelectionMode(this.type);
    //}

    super.update(changedProperties);
  }

  override willUpdate() {
    this._calendar = this._getCalendar();
  }

  render() {
    const sheet = {
      time: this._renderMonthSheet, // TODO!!!
      month: this._renderMonthSheet,
      year: this._renderYearSheet,
      decade: this._renderDecadeSheet
    }[this._store.getScene()].call(this);

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
                value=${this._store.getActiveHour()}
                min="0"
                max="23"
                tooltip="none"
                @sl-change=${this._onHourChange}
              ></sl-range>
              <sl-range
                class="minute-slider"
                value=${this._store.getActiveMinute()}
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
      time: () => '', // TODO!!!
      month: this._getActiveMonthName,
      year: this._getActiveYearName,
      decade: this._getActiveDecadeName
    }[this._store.getScene()].call(this);

    const onClick = () => this._store.clickSceneSwitch();

    return html`<div class="title" @click=${onClick}>${title}</div>`;
  }

  private _renderMonthSheet() {
    const view = this._calendar.getMonthView(
      this._store.getActiveYear(),
      this._store.getActiveMonth()
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
    const highlighted = this.highlightWeekend && dayData.weekend;

    if (!this.showAdjacentDays && dayData.adjacent) {
      return html`
        <div class=${classMap({ 'cell--highlighted': highlighted })}></div>
      `;
    }

    const selected = this._store.hasSelectedDay(
      dayData.year,
      dayData.month,
      dayData.day
    );

    return html`
      <div
        class=${classMap({
          'cell': true,
          'cell--disabled': dayData.disabled,
          'cell--adjacent': dayData.adjacent,
          'cell--current': dayData.current,
          'cell--highlighted': highlighted,
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
    const view = this._calendar.getYearView(this._store.getActiveYear());

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
    const selected = this._store.hasSelectedMonth(
      monthData.year,
      monthData.month
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
    const view = this._calendar.getDecadeView(this._store.getActiveYear());

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
    const selected = this._store.hasSelectedYear(yearData.year);

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
    const date = new Date(
      1970,
      0,
      1,
      this._store.getActiveHour(),
      this._store.getActiveMinute()
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
      <div class="time">
        ${time}
        ${!dayPeriod
          ? null
          : html`<span class="day-period">${dayPeriod}</span>`}
      </div>
    `;
  }
}
