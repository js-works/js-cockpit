import { html } from 'lit';
import { classMap } from 'lit/directives/class-map';
import { repeat } from 'lit/directives/repeat';
import { when } from 'lit/directives/when';
import { Calendar } from './calendar';
import { DatePickerController } from './date-picker-controller';
import { CalendarLocalizer } from './calendar-localizer';

import {
  getYearMonthDayString,
  getYearMonthString,
  getYearString,
  getYearWeekString
} from './calendar-utils';

// === exports =======================================================

export { renderDatePicker };

// === types ===================================================

type DatePickerProps = {
  selectionMode: DatePickerController.SelectionMode;
  elevateNavigation: boolean;
  showWeekNumbers: boolean;
  showAdjacentDays: boolean;
  highlightToday: boolean;
  highlightWeekends: boolean;
  disableWeekends: boolean;
  enableCenturyView: boolean;
  fixedDayCount: boolean;
  minDate: Date | null;
  maxDate: Date | null;
};

// === Calendar ======================================================

function renderDatePicker(
  locale: string,
  direction: 'ltr' | 'rtl',
  props: DatePickerProps,
  datePicker: DatePickerController
) {
  const i18n = new CalendarLocalizer({
    locale,
    direction
  });

  const calendar = new Calendar({
    firstDayOfWeek: i18n.getFirstDayOfWeek(),
    weekendDays: i18n.getWeekendDays(),
    getWeekNumber: (date: Date) => i18n.getWeekNumber(date),
    disableWeekends: props.disableWeekends,
    alwaysShow42Days: props.fixedDayCount && props.showAdjacentDays,
    minDate: props.minDate,
    maxDate: props.maxDate
  });

  function render() {
    const scene = datePicker.getScene();

    const sheet =
      scene === 'century'
        ? renderCenturySheet()
        : scene === 'decade'
        ? renderDecadeSheet()
        : scene === 'year'
        ? renderYearSheet()
        : renderMonthSheet();

    const typeSnakeCase = props.selectionMode.replace(
      /[A-Z]/g,
      (it) => `-${it.toLowerCase()}`
    );

    return html`
      <div class="cal-base cal-base--type-${typeSnakeCase}">
        ${when(
          props.selectionMode !== 'time',
          () => html`
            <div
              class=${classMap({
                'cal-nav': true,
                'cal-nav--elevated': props.elevateNavigation
              })}
              part="navigation"
            >
              <a class="cal-prev" data-subject="prev" part="prev-button">
                ${when(
                  i18n.getDirection() === 'ltr',
                  () => html`&#x1F860`,
                  () => html`&#x1F862`
                )}
              </a>
              ${renderTitle()}
              <a class="cal-next" data-subject="next" part="next-button">
                ${when(
                  i18n.getDirection() === 'ltr',
                  () => html`&#x1F862`,
                  () => html`&#x1F860`
                )}
              </a>
            </div>
            ${sheet}
          `
        )}${when(
          props.selectionMode === 'dateTime' || props.selectionMode === 'time',
          () => html`
            <div class="cal-time-selector">
              <div class="cal-time">${renderTime()}</div>
              <input
                type="range"
                class="cal-hour-slider"
                value=${datePicker.getActiveHour()}
                min="0"
                max="23"
                tooltip="none"
                data-subject="hours"
              />
              <input
                type="range"
                class="cal-minute-slider"
                value=${datePicker.getActiveMinute()}
                min="0"
                max="59"
                tooltip="none"
                data-subject="minutes"
              />
            </div>
          `
        )}
        <div>
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }

  function renderTitle() {
    const scene = datePicker.getScene();
    const activeYear = datePicker.getActiveYear();

    const title =
      scene === 'century'
        ? i18n.getCenturyTitle(activeYear, 12)
        : scene === 'decade'
        ? i18n.getDecadeTitle(activeYear, 12)
        : scene === 'year'
        ? i18n.getYearTitle(activeYear)
        : i18n.getMonthTitle(activeYear, datePicker.getActiveMonth());

    const disabled =
      datePicker.getScene() === 'century' ||
      (datePicker.getScene() === 'decade' && !props.enableCenturyView);

    return html`<div
      part="title"
      class=${classMap({
        'cal-title': true,
        'cal-title--disabled': disabled
      })}
      data-subject=${when(!disabled, () => 'title')}
    >
      ${title}
    </div>`;
  }

  function renderMonthSheet() {
    const view = calendar.getMonthView(
      datePicker.getActiveYear(),
      datePicker.getActiveMonth()
    );

    return html`
      <div
        class=${classMap({
          'cal-sheet': true,
          'cal-sheet--month': true,
          'cal-sheet--month-with-week-numbers': props.showWeekNumbers
        })}
      >
        ${when(props.showWeekNumbers, () => html`<div></div>`)}
        ${repeat(
          view.weekdays,
          (idx) => idx,
          (idx) =>
            html`
              <div class="cal-weekday">
                ${i18n.getWeekdayName(idx, 'short')}
              </div>
            `
        )}
        ${repeat(
          view.days,
          (dayData) => dayData.month * 100 + dayData.day,
          (dayData, idx) => {
            const cell = renderDayCell(dayData);
            return !props.showWeekNumbers || idx % 7 > 0
              ? cell
              : [
                  html`<div class="cal-week-number">
                    ${i18n.formatWeekNumber(dayData.weekNumber)}
                  </div>`,
                  cell
                ];
          }
        )}
      </div>
    `;
  }

  function renderDayCell(dayData: Calendar.DayData) {
    const currentHighlighted = props.highlightToday && dayData.current;
    const highlighted = props.highlightWeekends && dayData.weekend;

    if (!props.showAdjacentDays && dayData.adjacent) {
      return html`
        <div class=${classMap({ 'cal-cell--highlighted': highlighted })}></div>
      `;
    }

    const weekString = getYearWeekString(
      dayData.year, // TODO!!!!!!!!!!!!!
      dayData.weekNumber // TODO!!!!!!!
    );

    const selected = datePicker.hasSelectedDay(
      dayData.year,
      dayData.month,
      dayData.day,
      weekString
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
        data-date=${getYearMonthDayString(
          dayData.year,
          dayData.month,
          dayData.day
        )}
        data-week=${weekString}
        data-subject="day"
      >
        ${i18n.formatDay(dayData.day)}
      </div>
    `;
  }

  function renderYearSheet() {
    const view = calendar.getYearView(datePicker.getActiveYear());

    return html`
      <div class="cal-sheet cal-sheet--year">
        ${repeat(
          view.months,
          (monthData) => monthData.month,
          (monthData, idx) => renderMonthCell(monthData)
        )}
      </div>
    `;
  }

  function renderMonthCell(monthData: Calendar.MonthData) {
    const selected = datePicker.hasSelectedMonth(
      monthData.year,
      monthData.month
    );

    const currentHighlighted = monthData.current && props.highlightToday;

    return html`
      <div
        class=${classMap({
          'cal-cell': true,
          'cal-cell--disabled': monthData.disabled,
          'cal-cell--current': monthData.current,
          'cal-cell--current-highlighted': currentHighlighted,
          'cal-cell--selected': selected
        })}
        data-month=${getYearMonthString(monthData.year, monthData.month)}
        data-subject="month"
      >
        ${i18n.getMonthName(monthData.month, 'short')}
      </div>
    `;
  }

  function renderDecadeSheet() {
    const view = calendar.getDecadeView(datePicker.getActiveYear());

    return html`
      <div class="cal-sheet cal-sheet--decade">
        ${repeat(
          view.years,
          (monthData) => monthData.year,
          (monthData, idx) => renderYearCell(monthData)
        )}
      </div>
    `;
  }

  function renderYearCell(yearData: Calendar.YearData) {
    const selected = datePicker.hasSelectedYear(yearData.year);
    const currentHighlighted = props.highlightToday && yearData.current;

    return html`
      <div
        class=${classMap({
          'cal-cell': true,
          'cal-cell--disabled': yearData.disabled,
          'cal-cell--current': yearData.current,
          'cal-cell--current-highlighted': currentHighlighted,
          'cal-cell--selected': selected
        })}
        data-year=${getYearString(yearData.year)}
        data-subject="year"
      >
        ${i18n.formatYear(yearData.year)}
      </div>
    `;
  }

  function renderCenturySheet() {
    const view = calendar.getCenturyView(datePicker.getActiveYear());

    return html`
      <div class="cal-sheet cal-sheet--century">
        ${repeat(
          view.decades,
          (decadeData) => decadeData.firstYear,
          (decadeData, idx) => renderDecadeCell(decadeData)
        )}
      </div>
    `;
  }

  function renderDecadeCell(decadeData: Calendar.DecadeData) {
    const currentHighlighted = props.highlightToday && decadeData.current;

    return html`
      <div
        class=${classMap({
          'cal-cell': true,
          'cal-cell--disabled': decadeData.disabled,
          'cal-cell--current': decadeData.current,
          'cal-cell--current-highlighted': currentHighlighted
        })}
        data-year=${getYearString(decadeData.firstYear)}
        data-subject="decade"
      >
        ${i18n.getDecadeTitle(decadeData.firstYear, 10)}
      </div>
    `;
  }

  function renderTime() {
    const date = new Date(
      1970,
      0,
      1,
      datePicker.getActiveHour(),
      datePicker.getActiveMinute()
    );
    let time = '';
    let dayPeriod = '';

    const parts = new Intl.DateTimeFormat(i18n.getLocale(), {
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

  return render();
}
