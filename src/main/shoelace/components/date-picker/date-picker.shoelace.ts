import { attr, define, createRef, html, Attr } from 'js-element'
import { useEffect, useOnMount, useStyles } from 'js-element/hooks'
import { DatePickerCore } from '../../../core/date-picker/date-picker.core'
import defaultTheme from '../../../shoelace/themes/default-theme'
import { h } from '../../../utils/dom'

// @ts-ignore
import datePickerCustomStyles from './date-picker.shoelace.css'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const WEEKDAYS_SHORT = ['So', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

class DatePickerProps {
  date: Date = new Date(1970, 1, 1)

  @attr(Attr.number)
  firstDayInWeek: number = 0

  @attr(Attr.boolean)
  showWeekNumber: boolean = true

  @attr(Attr.boolean)
  disabled = false
}

const DatePicker = define('jsc-date-picker', DatePickerProps, (p) => {
  const core = new DatePickerCore({
    getNameOfMonth: (month) => MONTHS[month],
    getShortNameOfMonth: (month) => MONTHS[month].substr(0, 3),
    getShortNameOfWeekday: (weekday) => WEEKDAYS_SHORT[weekday],

    icons: {
      goToNext: createGoToNextIcon(),
      goToPrevious: createGoToPreviousIcon()
    }
  })

  const containerRef = createRef<Element>()

  useStyles(DatePickerCore.coreStyles, defaultTheme, datePickerCustomStyles)
  useOnMount(() => void containerRef.current!.appendChild(core.getElement()))
  useEffect(() => core.setParams(p))

  return () => html`<div ref=${containerRef}></div>`
})

function createGoToNextIcon() {
  const ret = h('div')

  ret.innerHTML = `
    <svg width="20px" height="20px" viewBox="0 0 64 64">
      <g fill="none" stroke="currentColor" stroke-width="2" stroke-miterlimit="10">
        <polyline stroke-linejoin="bevel" points="20,40 32,56 44,40 "/>
        <polyline stroke-miterlimit="10" points="32,16 32,56"/>
      </g>
    </svg>
  `

  return ret
}

function createGoToPreviousIcon() {
  const ret = h('div')

  ret.innerHTML = `
    <svg width="20px" height="20px" viewBox="0 0 64 64">
      <g fill="none" stroke="currentColor" stroke-width="2" stroke-miterlimit="10">
        <polyline stroke-linejoin="bevel" points="20,32 32,16 44,32 "/>
        <polyline stroke-miterlimit="10" points="32,16 32,56"/>
      </g>
    </svg> 
  `

  return ret
}
