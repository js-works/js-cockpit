import { attr, define, h } from 'js-elements'
import { useEffect, useOnMount, useStyles } from 'js-elements/hooks'
import { createRef } from 'js-elements/utils'
import { DatePickerCore } from '../../../core/date-picker/date-picker.core'
import defaultTheme from '../../../shoelace/themes/default-theme'

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
  'December',
]

const WEEKDAYS_SHORT = ['So', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

class DatePickerProps {
  date: Date = new Date(1970, 1, 1)

  @attr(Number)
  firstDayInWeek: number = 0

  @attr(Boolean)
  showWeekNumber: boolean = true

  @attr(Boolean)
  disabled = false
}

define('sx-date-picker', DatePickerProps, (p) => {
  const core = new DatePickerCore({
    getNameOfMonth: (month) => MONTHS[month],
    getShortNameOfMonth: (month) => MONTHS[month].substr(0, 2),
    getShortNameOfWeekday: (weekday) => WEEKDAYS_SHORT[weekday],
  })

  const containerRef = createRef<Element>()

  useStyles([DatePickerCore.coreStyles, defaultTheme, datePickerCustomStyles])
  useOnMount(() => void containerRef.current!.appendChild(core.getElement()))
  useEffect(() => core.setParams(p))

  return () => h('div', { ref: containerRef })
})