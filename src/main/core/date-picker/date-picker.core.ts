import { h, registerElement } from '../../utils/dom'

import {
  getFirstDayOfMonth,
  getLengthOfPrevMonth,
  getWeekOfYear,
} from '../../utils/dates'

// @ts-ignore
import datePickerCoreStyles from './date-picker.core.css'

// === exports =======================================================

export { DatePickerCore }

// === constants =====================================================

const DAYS_OF_THE_WEEK = ['So', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Aug',
  'Sep',
  'Okt',
  'Nov',
  'Dez',
]

// === types =========================================================

type DatePickerParams = {
  value: Date
  firstDayOfWeek: number
  showWeekNumbers: boolean
  disabled: boolean
}

// === DatePickerCore ================================================

class DatePickerCore {
  static coreStyles: string = datePickerCoreStyles

  private params: DatePickerParams = {
    value: new Date(1970, 1, 1),
    firstDayOfWeek: 0,
    showWeekNumbers: true,
    disabled: false,
  }

  private monthView = new MonthView()
  private yearView = new YearView()
  private decadeView = new DecadeView()

  private container = h(
    'div',
    { className: 'x-datePicker' },
    this.monthView.getElement(),
    this.yearView.getElement(),
    this.decadeView.getElement()
  )

  constructor() {
    this.showMonthView()
  }

  setParams(params: Partial<DatePickerParams>) {
    Object.assign(this.params, params)
  }

  getParams() {
    return Object.assign({}, this.params)
  }

  getElement() {
    return this.container
  }

  // --- private methods ---------------------------------------------

  private showMonthView() {
    this.monthView.update({
      month: this.params.value.getMonth(),
      year: this.params.value.getFullYear(),
      firstDayOfWeek: this.params.firstDayOfWeek,
      selectedDate: this.params.value,
      showWeekNumbers: this.params.showWeekNumbers,
    })

    this.yearView.setVisible(false)
    this.decadeView.setVisible(false)
    this.monthView.setVisible(true)
  }

  private showYearView() {
    this.decadeView.setVisible(false)
    this.monthView.setVisible(false)
    this.yearView.setVisible(true)
  }

  private showDecadeView() {
    this.monthView.setVisible(false)
    this.yearView.setVisible(false)
    this.decadeView.setVisible(true)
  }
}

// === views =========================================================

abstract class View {
  private container = h('div')

  setVisible(value: boolean) {
    this.container.style.visibility = value ? 'visible' : 'hidden'
  }

  getElement() {
    return this.container
  }
}

class MonthView extends View {
  constructor() {
    super()

    const headRow: Node[] = []
    const rows: Node[] = []

    for (let colIdx = 0; colIdx < 8; ++colIdx) {
      headRow.push(h('th'))
    }

    for (let rowIdx = 0; rowIdx < 7; ++rowIdx) {
      const cols: Node[] = []
      const rowClass = rowIdx === 0 ? 'x-datePicker-weekDays' : null

      for (let colIdx = 0; colIdx < 8; ++colIdx) {
        const colClass = colIdx === 0 ? 'x-datePicker-weekNumber' : null

        cols.push(h('td', { className: colClass }))
      }

      rows.push(h('tr', { className: rowClass }, cols))
    }

    const table = h(
      'table',
      null,
      h('thead', null, h('tr', null, headRow)),
      h('tbody', null, rows)
    )

    const content = h(
      'div',
      { className: 'x-datePicker-monthView' },
      h('div', null, 'January 2021'),
      table
    )

    this.getElement().appendChild(content)
  }

  update({
    year,
    month,
    firstDayOfWeek,
    showWeekNumbers,
    selectedDate,
  }: {
    year: number
    month: number
    showWeekNumbers: boolean
    firstDayOfWeek: number
    selectedDate: Date | null
  }) {
    const table = this.getElement().firstChild!.childNodes[1]
    const thead = table.firstChild!
    const theadRow = thead.firstChild!
    const tbody = table!.childNodes[1]

    const firstDayOfMonth = getFirstDayOfMonth(year, month)
    const lengthOfPrevMonth = getLengthOfPrevMonth(year, month)

    let counter = lengthOfPrevMonth - firstDayOfMonth.getDay() + 1

    ;(theadRow.firstChild! as Element).innerHTML = '' // TODO?

    for (let colIdx = 1; colIdx < 8; ++colIdx) {
      ;(theadRow.childNodes[colIdx] as Element).innerHTML =
        DAYS_OF_THE_WEEK[colIdx - 1]
    }

    for (let rowIdx = 0; rowIdx < 6; ++rowIdx) {
      for (let colIdx = 0; colIdx < 8; ++colIdx) {
        if (colIdx === 0) {
          const weekCell = tbody.childNodes[rowIdx].firstChild! as Element
          weekCell.innerHTML = '12' // TODO!!!!!!!
        }

        if (colIdx > 0) {
          const cell = tbody.childNodes[rowIdx].childNodes[colIdx] as Element

          cell.innerHTML = String(counter++)

          if (counter > lengthOfPrevMonth) {
            counter = 1
          }
        }
      }
    }
  }
}

class YearView extends View {}

class DecadeView extends View {}
