import { h, defineElement } from '../../utils/dom'

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

// === types =========================================================

type DatePickerParams = {
  date: Date
  firstDayOfWeek: number
  showWeekNumbers: boolean
}

// === DatePickerCore ================================================

class DatePickerCore {
  static coreStyles: string = datePickerCoreStyles

  private params: DatePickerParams = {
    date: new Date(1970, 1, 1),
    firstDayOfWeek: 0,
    showWeekNumbers: true,
  }

  private calendar: Element = h('div')

  constructor() {
    this.initCalendar()
  }

  setParams(params: Partial<DatePickerParams>) {
    Object.assign(this.params, params)
  }

  getParams() {
    return Object.assign({}, this.params)
  }

  getElement() {
    return this.calendar
  }

  // --- private methods ---------------------------------------------

  initCalendar(): void {
    const { date, firstDayOfWeek, showWeekNumbers } = this.params
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

    this.calendar.innerHTML = '' // not really necessary here, anyway....
    this.calendar.appendChild(table)

    this.updateCalendar()
  }

  updateCalendar(): void {
    const date = new Date() //this.params.date // TODO
    const year = date.getFullYear()
    const month = date.getMonth() // 0 - 11
    const dayInMonth = date.getDate() // 1 - 31
    const dayInWeek = date.getDay() // 0 - 6, 0 means sunday
    const thead = this.getElement().firstChild!.childNodes[0]
    const theadRow = thead.firstChild!
    const tbody = this.getElement().firstChild!.childNodes[1]

    const firstDayOfMonth = getFirstDayOfMonth(date)
    const lengthOfPrevMonth = getLengthOfPrevMonth(date)

    let counter = lengthOfPrevMonth - firstDayOfMonth.getDay() + 1

    ;(theadRow.firstChild! as Element).innerHTML = 'CW'

    for (let colIdx = 1; colIdx < 8; ++colIdx) {
      ;(theadRow.childNodes[colIdx] as Element).innerHTML =
        DAYS_OF_THE_WEEK[colIdx - 1]
    }

    for (let rowIdx = 0; rowIdx < 6; ++rowIdx) {
      for (let colIdx = 0; colIdx < 8; ++colIdx) {
        if (colIdx === 0) {
          const weekCell = tbody.childNodes[rowIdx].firstChild! as Element
          weekCell.innerHTML = 'x'
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

// === helper functions ==============================================
