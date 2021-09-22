import { component, elem, prop, Attrs } from 'js-element'
import { html, lit, createRef, ref } from 'js-element/lit'
import { useAfterMount } from 'js-element/hooks'

// @ts-ignore
import { Datepicker } from 'vanillajs-datepicker'

// styles
import dateFieldStyles from './date-field.css'
import datepickerStyles from 'vanillajs-datepicker/dist/css/datepicker-foundation.css'

// === exports =======================================================

export { DateField }

// === Cockpit ===================================================

const styleElem = document.createElement('style')
styleElem.innerText = datepickerStyles
document.head.append(styleElem)

@elem({
  tag: 'c-date-field',
  styles: dateFieldStyles,
  impl: lit(dateFieldImpl)
})
class DateField extends component() {}

function dateFieldImpl(self: DateField) {
  const input = document.createElement('input')

  const datepicker = new Datepicker(input, {
    calendarWeeks: true,
    daysOfWeekHighlighted: [0, 6],
    prevArrow: '&#x1F860;',
    nextArrow: '&#x1F862;',
    weekStart: 0,
    autohide: true,
    autoHide: true,
    showOnFocus: true,
    updateOnBlur: false,
    todayHighlight: true
    //language: locale
  })

  useAfterMount(() => {
    const onDocumentClick = (ev: MouseEvent) => {
      if (!datepicker.active) {
        return
      }

      const { pageX, pageY } = ev
      const x = input.offsetLeft
      const y = input.offsetTop
      const w = input.offsetWidth
      const h = input.offsetHeight

      if (pageX >= x && pageX < x + w && pageY >= y && pageY < y + h) {
        return
      }

      datepicker.hide()
    }

    document.addEventListener('click', onDocumentClick)
    return () => document.removeEventListener('click', onDocumentClick)
  })

  datepicker.pickerElement.onclick = (ev: Event) => {
    ev.stopPropagation()
  }

  return () => html` <div class="base">${input}</div> `
}
