import { Calendar } from './calendar';
import { DatePickerController } from './date-picker-controller';
import { CalendarLocalizer } from './calendar-localizer';
import { h } from './vdom';

type VElement = HTMLElement;
type VNode = null | number | string | VElement | VNode[];
type Attrs = Record<string, string | number | null>;

const [a, div, input, span] = ['a', 'div', 'input', 'span'].map((tag) =>
  h.bind(null, tag)
);

/*
function h(
  type: string,
  attrs: Attrs | null = null,
  ...children: VNode[]
): VElement {
  const ret = document.createElement(type);

  if (attrs) {
    for (const key of Object.keys(attrs)) {
      const value = attrs[key];

      if (value !== null) {
        ret.setAttribute(key, String(attrs[key]));
      }
    }
  }

  for (const child of children.flat()) {
    if (typeof child === 'number' || typeof child === 'string') {
      ret.append(document.createTextNode(String(child)));
    } else if (child instanceof Element) {
      ret.append(child);
    }
  }

  return ret;
}
*/

function classMap(classes: Record<string, unknown>): string {
  const arr: string[] = [];

  for (const key of Object.keys(classes)) {
    if (classes[key]) {
      arr.push(key);
    }
  }

  return arr.join(' ');
}

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

    return div(
      { class: `cal-base cal-base--type-${typeSnakeCase}` },
      props.selectionMode === 'time'
        ? null
        : div(
            {
              class: classMap({
                'cal-nav': true,
                'cal-nav--elevated': props.elevateNavigation
              })
            },
            a(
              { 'class': 'cal-prev', 'data-subject': 'prev' },
              i18n.getDirection() === 'ltr' ? '\u{1F860}' : '\u{1F862}'
            ),
            renderTitle(),
            a(
              { 'class': 'cal-next', 'data-subject': 'next' },
              i18n.getDirection() === 'ltr' ? '\u{1F862}' : '\u{1F860}'
            )
          ),
      props.selectionMode === 'time' ? null : sheet,
      props.selectionMode !== 'dateTime' && props.selectionMode !== 'time'
        ? null
        : div(
            { class: 'cal-time-selector' },
            div({ class: 'cal-time' }, renderTime()),
            input({
              'type': 'range',
              'class': 'cal-hour-slider',
              'value': datePicker.getActiveHour(),
              'min': '0',
              'max': '23',
              'data-subject': 'hours'
            }),
            input({
              'type': 'range',
              'class': 'cal-minute-slider',
              'value': datePicker.getActiveMinute(),
              'min': 0,
              'max': 59,
              'data-subject': 'minutes'
            })
          )
    );
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

    return div(
      {
        'class': classMap({
          'cal-title': true,
          'cal-title--disabled': disabled
        }),
        'data-subject': disabled ? null : 'title'
      },
      title
    );
  }

  function renderMonthSheet() {
    const view = calendar.getMonthView(
      datePicker.getActiveYear(),
      datePicker.getActiveMonth()
    );

    return div(
      {
        class: classMap({
          'cal-sheet': true,
          'cal-sheet--month': true,
          'cal-sheet--month-with-week-numbers': props.showWeekNumbers
        })
      },

      props.showWeekNumbers ? div() : null,
      view.weekdays.map((idx) =>
        div({ class: 'cal-weekday' }, i18n.getWeekdayName(idx, 'short'))
      ),
      view.days.flatMap((dayData, idx) => {
        const cell = renderDayCell(dayData);
        return !props.showWeekNumbers || idx % 7 > 0
          ? cell
          : [
              div(
                { class: 'cal-week-number' },
                i18n.formatWeekNumber(dayData.weekNumber)
              ),
              cell
            ];
      })
    );
  }

  function renderDayCell(dayData: Calendar.DayData) {
    const currentHighlighted = props.highlightToday && dayData.current;
    const highlighted = props.highlightWeekends && dayData.weekend;

    if (!props.showAdjacentDays && dayData.adjacent) {
      return div({
        class: classMap({
          'cal-cell--highlighted': highlighted
        })
      });
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

    return div(
      {
        'class': classMap({
          'cal-cell': true,
          'cal-cell--disabled': dayData.disabled,
          'cal-cell--adjacent': dayData.adjacent,
          'cal-cell--current': dayData.current,
          'cal-cell--current-highlighted': currentHighlighted,
          'cal-cell--highlighted': highlighted,
          'cal-cell--selected': selected
        }),
        'data-date': getYearMonthDayString(
          dayData.year,
          dayData.month,
          dayData.day
        ),
        'data-week': weekString,
        'data-subject': 'day'
      },
      i18n.formatDay(dayData.day)
    );
  }

  function renderYearSheet() {
    const view = calendar.getYearView(datePicker.getActiveYear());

    return div(
      { class: 'cal-sheet cal-sheet--year' },
      view.months.map((monthData) => renderMonthCell(monthData))
    );
  }

  function renderMonthCell(monthData: Calendar.MonthData) {
    const selected = datePicker.hasSelectedMonth(
      monthData.year,
      monthData.month
    );

    const currentHighlighted = monthData.current && props.highlightToday;

    return div(
      {
        'class': classMap({
          'cal-cell': true,
          'cal-cell--disabled': monthData.disabled,
          'cal-cell--current': monthData.current,
          'cal-cell--current-highlighted': currentHighlighted,
          'cal-cell--selected': selected
        }),
        'data-month': getYearMonthString(monthData.year, monthData.month),
        'data-subject': 'month'
      },
      i18n.getMonthName(monthData.month, 'short')
    );
  }

  function renderDecadeSheet() {
    const view = calendar.getDecadeView(datePicker.getActiveYear());

    return div(
      { class: 'cal-sheet cal-sheet--decade' },
      view.years.map((monthData, idx) => renderYearCell(monthData))
    );
  }

  function renderYearCell(yearData: Calendar.YearData) {
    const selected = datePicker.hasSelectedYear(yearData.year);
    const currentHighlighted = props.highlightToday && yearData.current;

    return div(
      {
        'class': classMap({
          'cal-cell': true,
          'cal-cell--disabled': yearData.disabled,
          'cal-cell--current': yearData.current,
          'cal-cell--current-highlighted': currentHighlighted,
          'cal-cell--selected': selected
        }),
        'data-year': getYearString(yearData.year),
        'data-subject': 'year'
      },
      i18n.formatYear(yearData.year)
    );
  }

  function renderCenturySheet() {
    const view = calendar.getCenturyView(datePicker.getActiveYear());

    return div(
      { class: 'cal-sheet cal-sheet--century' },
      view.decades.map((decadeData, idx) => renderDecadeCell(decadeData))
    );
  }

  function renderDecadeCell(decadeData: Calendar.DecadeData) {
    const currentHighlighted = props.highlightToday && decadeData.current;

    return div(
      {
        'class': classMap({
          'cal-cell': true,
          'cal-cell--disabled': decadeData.disabled,
          'cal-cell--current': decadeData.current,
          'cal-cell--current-highlighted': currentHighlighted
        }),
        'data-year': getYearString(decadeData.firstYear),
        'data-subject': 'decade'
      },
      i18n.getDecadeTitle(decadeData.firstYear, 10)
    );
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

    return div(
      { class: 'cal-time' },
      time,
      !dayPeriod ? null : span({ class: 'cal-day-period' }, dayPeriod)
    );
  }

  return render();
}
