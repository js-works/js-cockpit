import { elem, prop, state, Attrs, Component } from '../../utils/components';
import { classMap, html, repeat } from '../../utils/lit';
import { Calendar } from './calendar';
import { I18nController } from '../../i18n/i18n';

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
    | 'month'
    | 'year';
}

// === local types ===================================================

type View = 'month' | 'year' | 'decade';

// === Calendar ======================================================

@elem({
  tag: 'cp-date-picker',
  styles: calendarStyles,
  uses: [SlRange]
})
class DatePicker extends Component {
  @state
  private _view: View = 'month';

  @state
  private _activeYear = new Date().getFullYear();

  @state
  private _activeMonth = new Date().getMonth();

  @state
  private _activeHour = new Date().getHours();

  @state
  private _activeMinute = new Date().getMinutes();

  private _i18n = new I18nController(this);
  private _headlessCalendar = new Calendar();

  constructor() {
    super();
  }

  private _onMovePrevClick = () => {
    this._move(-1);
  };

  private _onMoveNextClick = () => {
    this._move(1);
  };

  private _move(signum: 1 | -1) {
    switch (this._view) {
      case 'month': {
        const n = this._activeYear * 100 + this._activeMonth + signum;
        this._activeYear = Math.floor(n / 100);
        this._activeMonth = n % 100;
        return;
      }

      case 'year':
        this._activeYear += signum;
        return;

      case 'decade':
        this._activeYear += signum * 11;
        return;
    }
  }

  private _onHourChange = (ev: Event) => {
    this._activeHour = (ev.target as SlRange).value;
  };

  private _onMinuteChange = (ev: Event) => {
    this._activeMinute = (ev.target as SlRange).value;
  };

  render() {
    const sheet =
      this._view === 'month'
        ? this._renderMonthSheet()
        : this._view === 'year'
        ? this._renderYearSheet()
        : this._view === 'decade'
        ? this._renderDecadeSheet()
        : null;

    return html`
      <style></style>
      <div class="base">
        <input class="input" />
        <div class="header">
          <a class="prev" data-action="movePrev" @click=${this._onMovePrevClick}
            >&#x1F860;</a
          >
          <div class="title-container">${this._renderTitle()}</div>
          <a class="next" data-action="moveNext" @click=${this._onMoveNextClick}
            >&#x1F862;</a
          >
        </div>
        <div class="sheet">${sheet}</div>
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
      </div>
    `;
  }

  private _renderTitle() {
    const view = this._view;

    const onClick =
      view === 'decade'
        ? null
        : () => (this._view = view === 'year' ? 'decade' : 'year');

    let title = '';

    switch (this._view) {
      case 'month': {
        const monthName = this._i18n.getMonthName(this._activeMonth);
        title = `${monthName} ${this._activeYear}`;
        break;
      }

      case 'year':
        title = this._activeYear.toString();
        break;

      case 'decade': {
        const startYear = Math.floor(this._activeYear / 10) * 10;
        title = `${startYear} - ${startYear + 11}`;
        break;
      }
    }

    return html`<div class="title" @click=${onClick}>${title}</div>`;
  }

  private _renderMonthSheet() {
    const view = this._headlessCalendar.getMonthView(
      this._activeYear,
      this._activeMonth
    );

    return html`
      <div class="view-month">
        ${repeat(
          view.days,
          (dayData) => dayData.month * 100 + dayData.day,
          (dayData, idx) => {
            const cell = this._renderDayCell(dayData);
            return idx % 7 > 0
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
    return html`
      <div
        class=${classMap({
          cell: true
        })}
        data-year=${dayData.year}
        data-month=${dayData.month}
        data-day=${dayData.day}
      >
        ${dayData.day}
      </div>
    `;
  }

  private _renderYearSheet() {
    const view = this._headlessCalendar.getYearView(this._activeYear);

    return html`
      <div class="view-year">
        ${repeat(
          view.months,
          (monthData) => monthData.month,
          (monthData, idx) => this._renderMonthCell(monthData)
        )}
      </div>
    `;
  }

  private _renderMonthCell(monthData: Calendar.MonthData) {
    return html`<div
      class=${classMap({
        cell: true
      })}
      data-year=${monthData.year}
      data-month=${monthData.month}
    >
      ${this._i18n.getMonthName(monthData.month)}
    </div>`;
  }

  private _renderDecadeSheet() {
    const view = this._headlessCalendar.getDecadeView(this._activeYear);

    return html`
      <div class="view-decade">
        ${repeat(
          view.years,
          (monthData) => monthData.year,
          (monthData, idx) => this._renderYearCell(monthData)
        )}
      </div>
    `;
  }

  private _renderYearCell(yearData: Calendar.YearData) {
    return html`
      <div
        class=${classMap({
          cell: true
        })}
        data-year=${yearData.year}
      >
        ${yearData.year}
      </div>
    `;
  }

  private _renderTime() {
    const date = new Date(1970, 0, 1, this._activeHour, this._activeMinute);
    let time = '';
    let dayPeriod = '';

    const parts = new Intl.DateTimeFormat(this._i18n.getLocale(), {
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

    return html`<div class="cp-time">
      ${time}
      ${!dayPeriod ? null : html`<span class="day-period">${dayPeriod}</span>`}
    </div>`;
  }
}
