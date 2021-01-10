import { attr, define, h } from 'js-elements'
import { useEffect, useOnMount, useStyles } from 'js-elements/hooks'
import { createRef } from 'js-elements/utils'
import { DatePickerCore } from '../../../core/date-picker/date-picker.core'

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
  const core = new DatePickerCore()
  const containerRef = createRef<Element>()

  useStyles(DatePickerCore.coreStyles)
  useOnMount(() => void containerRef.current!.appendChild(core.getElement()))
  useEffect(() => core.setParams(p))

  return () => h('div', { ref: containerRef })
})
