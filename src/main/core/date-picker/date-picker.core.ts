import { h, defineElement } from '../../utils/dom'

// @ts-ignore
import datePickerCoreStyles from './date-picker.core.css'

// === exports =======================================================

export { DatePickerCore }

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

    for (let rowIdx = 0; rowIdx < 6; ++rowIdx) {
      const cols: Node[] = []
      for (let colIdx = 0; colIdx < 7 + Number(showWeekNumbers); ++colIdx) {
        cols.push(h('td', null, rowIdx + ':' + colIdx))
      }
      rows.push(h('tr', null, cols))
    }

    const table = h(
      'table',
      null,
      h('thead', null, headRow),
      h('tbody', null, rows)
    )

    this.calendar.innerHTML = '' // not really necessary here, anyway....
    this.calendar.appendChild(table)

    this.updateCalendar()
  }

  updateCalendar(): void {}
}
