import { elem, prop, state, Attrs, Component } from '../../utils/components';
import { classMap, html, repeat, TemplateResult, when } from '../../utils/lit';
import { Calendar } from './calendar';
import { I18nController, I18nFacade } from '../../i18n/i18n';

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
  @prop(Attrs.boolean)
  showWeekNumbers = false;

  @prop(Attrs.boolean)
  highlightWeekend = false;

  @prop(Attrs.boolean)
  disableWeekend = true;

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
  private _calendar = new Calendar(this._getInitialCalendarOptions());

  private _onPrevOrNextClick = (ev: MouseEvent) => {
    const signum = (ev.target! as HTMLElement).classList.contains('prev')
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

  _onDayClick = (ev: MouseEvent) => {
    const elem = ev.target as HTMLElement;
    const year = parseInt(elem.getAttribute('data-year')!, 10);
    const month = parseInt(elem.getAttribute('data-month')!, 10);
  };

  _onMonthClick = (ev: MouseEvent) => {
    const elem = ev.target as HTMLElement;
    const year = parseInt(elem.getAttribute('data-year')!, 10);
    const month = parseInt(elem.getAttribute('data-month')!, 10);

    this._activeYear = year;
    this._activeMonth = month;
    this._view = 'month';
  };

  _onYearClick = (ev: MouseEvent) => {
    const elem = ev.target as HTMLElement;
    const year = parseInt(elem.getAttribute('data-year')!, 10);

    this._activeYear = year;
    this._view = 'year';
  };

  _getCalendarLocalization(): Calendar.Localization {
    return {
      firstDayOfWeek: this._i18n.getFirstDayOfWeek(),
      getCalendarWeek: this._i18n.getCalendarWeek,
      weekendDays: this._i18n.getWeekendDays()
    };
  }

  _getInitialCalendarOptions(): Calendar.Options {
    return {
      localization: this._getCalendarLocalization(),
      disableWeekend: false,
      alwaysShow42Days: true,
      maxDate: null,
      minDate: null
    };
  }

  render() {
    let sheet: TemplateResult;

    switch (this._view) {
      case 'month':
        sheet = this._renderMonthSheet();
        break;

      case 'year':
        sheet = this._renderYearSheet();
        break;

      case 'decade':
        sheet = this._renderDecadeSheet();
        break;
    }

    return html`
      <style></style>
      <div class="base">
        <input class="input" />
        <div class="header">
          <a class="prev" @click=${this._onPrevOrNextClick}>&#x1F860;</a>
          <div class="title-container">${this._renderTitle()}</div>
          <a class="next" @click=${this._onPrevOrNextClick}>&#x1F862;</a>
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
    const view = this._calendar.getMonthView(
      this._activeYear,
      this._activeMonth
    );

    return html`
      <div
        class=${classMap({
          'view-month': true,
          'view-month--with-week-numbers': this.showWeekNumbers
        })}
      >
        ${when(this.showWeekNumbers, () => html` <div></div>`)}
        ${repeat(
          view.weekdays,
          (idx) => idx,
          (idx) =>
            html`<div class="weekday">
              ${this._i18n.getDayName(idx, 'short')}
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
    return html`
      <div
        class=${classMap({
          'cell': true,
          'cell--adjacent': dayData.adjacent,
          'cell--current': dayData.current,
          'cell--highlighted': this.highlightWeekend && dayData.weekend
        })}
        data-year=${dayData.year}
        data-month=${dayData.month}
        @click=${this._onDayClick}
      >
        ${dayData.day}
      </div>
    `;
  }

  private _renderYearSheet() {
    const view = this._calendar.getYearView(this._activeYear);

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
        cell: true,
        current: monthData.current
      })}
      data-year=${monthData.year}
      data-month=${monthData.year}
      @click=${this._onMonthClick}
    >
      ${this._i18n.getMonthName(monthData.month, 'short')}
    </div>`;
  }

  private _renderDecadeSheet() {
    const view = this._calendar.getDecadeView(this._activeYear);

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
          cell: true,
          current: yearData.current
        })}
        data-year=${yearData.year}
        @click=${this._onYearClick}
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
