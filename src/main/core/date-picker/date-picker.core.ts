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

type DatePickerConfig = {
  getNameOfMonth: (month: number) => string
  getShortNameOfMonth: (month: number) => string
  getShortNameOfWeekday: (day: number) => string

  icons: {
    goToNext: Element
    goToPrevious: Element
  }
}

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

  private monthView: MonthView
  private yearView: YearView
  private decadeView: DecadeView

  private container: HTMLElement

  constructor(private config: DatePickerConfig) {
    this.monthView = new MonthView(config)
    this.yearView = new YearView(config)
    this.decadeView = new DecadeView(config)

    this.container = h(
      'div',
      { className: 'x-datePicker' },
      this.monthView.getElement(),
      this.yearView.getElement(),
      this.decadeView.getElement()
    )

    this.showMonthView()
    //this.showDecadeView()
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
      datePickerConfig: this.config,
    })

    this.yearView.setVisible(false)
    this.decadeView.setVisible(false)
    this.monthView.setVisible(true)
  }

  private showYearView() {
    this.yearView.update({
      year: this.params.value.getFullYear(),
    })

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
  private config: DatePickerConfig
  private container: HTMLElement
  private navi: Element
  private isMain: boolean

  constructor(config: DatePickerConfig, isMain: boolean = false) {
    this.config = config
    this.isMain = isMain
    this.container = h('div', { className: 'x-datePicker-view' })

    if (isMain) {
      this.container.className += ' x-datePicker-view--main'
    }

    this.navi = h(
      'div',
      { className: 'x-datePicker-navi' },
      h('button'),
      h('button', null, config.icons.goToPrevious.cloneNode(true)),
      h('button', null, config.icons.goToNext.cloneNode(true))
    )

    this.container.appendChild(this.navi)
  }

  setTitle(value: string) {
    ;(this.navi.firstChild! as any).innerHTML = value
  }

  setVisible(value: boolean) {
    if (this.isMain) {
      this.container.style.visibility = value ? 'visible' : 'hidden'
    } else {
      this.container.style.display = value ? 'flex' : 'none'
    }
  }

  getConfig() {
    return this.config
  }

  getElement() {
    return this.container
  }
}

class MonthView extends View {
  constructor(config: DatePickerConfig) {
    super(config, true)

    const headRow: Node[] = []
    const rows: Node[] = []

    for (let colIdx = 0; colIdx < 8; ++colIdx) {
      headRow.push(h('th'))
    }

    for (let rowIdx = 0; rowIdx < 6; ++rowIdx) {
      const cols: Element[] = []
      const rowClass = rowIdx === 0 ? 'x-datePicker-weekDays' : null

      for (let colIdx = 0; colIdx < 8; ++colIdx) {
        const colClass = colIdx === 0 ? 'x-datePicker-weekNumber' : null

        cols.push(h('td', { className: colClass }))
      }

      rows.push(h('tr', { className: rowClass }, cols))
    }

    const table = h(
      'table',
      { className: 'x-datePicker-tableOfDays' },
      h('thead', null, h('tr', null, headRow)),
      h('tbody', null, rows)
    )

    const content = h('div', { className: 'x-datePicker-viewBody' }, table)

    this.getElement().appendChild(content)
  }

  update({
    year,
    month,
    firstDayOfWeek,
    showWeekNumbers,
    selectedDate,
    datePickerConfig,
  }: {
    year: number
    month: number
    showWeekNumbers: boolean
    firstDayOfWeek: number
    selectedDate: Date | null
    datePickerConfig: DatePickerConfig
  }) {
    const config = this.getConfig()
    const table = this.getElement().querySelector('.x-datePicker-tableOfDays')!
    const thead = table.firstChild!
    const theadRow = thead.firstChild!
    const tbody = table!.childNodes[1]
    const firstDayOfMonth = getFirstDayOfMonth(year, month)
    const lengthOfPrevMonth = getLengthOfPrevMonth(year, month)

    this.setTitle(config.getNameOfMonth(month) + ' ' + year)

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

class YearView extends View {
  constructor(config: DatePickerConfig) {
    super(config)

    const rows: Element[] = []

    for (let rowIdx = 0; rowIdx < 3; ++rowIdx) {
      const cells: Element[] = []

      for (let colIdx = 0; colIdx < 4; ++colIdx) {
        cells.push(h('td', null, ''))
      }

      rows.push(h('tr', null, cells))
    }

    const tbody = h('tbody', null, rows)
    const table = h('table', { className: 'x-datePicker-tableOfMonths' }, tbody)

    this.getElement().appendChild(table)
  }

  update({ year }: { year: number }) {
    const config = this.getConfig()
    const cells = this.getElement().querySelectorAll('table > tbody > tr > td')

    cells.forEach((cell, idx) => {
      cell.innerHTML = config.getShortNameOfMonth(idx)
    })
    console.log(cells)
    this.setTitle(year.toString())
  }
}

class DecadeView extends View {}
