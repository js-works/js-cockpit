import { component, elem, prop, Attrs } from 'js-element'
import { html, lit, createRef, ref } from 'js-element/lit'
import { useAfterMount } from 'js-element/hooks'

// @ts-ignore
import { Datepicker } from 'vanillajs-datepicker'

// custom elements
import SlInput from '@shoelace-style/shoelace/dist/components/input/input'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlIconButton from '@shoelace-style/shoelace/dist/components/icon-button/icon-button'

// icons
import calendarIcon from '../../icons/calendar3.svg'

// styles
import dateFieldStyles from './date-field.css'
import datepickerStyles from 'vanillajs-datepicker/dist/css/datepicker-foundation.css'
import controlStyles from '../../shared/css/control.css'

// === exports =======================================================

export { DateField }

// === Cockpit ===================================================

const datepickerStyles2 = `
  .datepicker {
    z-index: 32000;
  }
`

//const styleElem = document.createElement('style')
//styleElem.innerText = datepickerStyles + '\n' + datepickerStyles2
//document.head.append(styleElem)

document.addEventListener('mousedown', () => {
  //  console.log('mouse down')
})

@elem({
  tag: 'c-date-field',
  styles: [dateFieldStyles, controlStyles, datepickerStyles],
  impl: lit(dateFieldImpl),
  uses: [SlIcon, SlIconButton, SlInput]
})
class DateField extends component() {
  @prop({ attr: Attrs.string })
  label = ''

  @prop({ attr: Attrs.string })
  error = ''

  @prop({ attr: Attrs.boolean })
  disabled = false

  @prop({ attr: Attrs.boolean })
  required = false
}

function dateFieldImpl(self: DateField) {
  //const input = document.createElement('input')
  //input.className = 'date-input'

  let datepicker: any = null
  let input: HTMLInputElement | null = null

  const onDatepickerHide = () => {} //alert('wooohooo')

  useAfterMount(() => {
    setTimeout(() => {
      console.clear()

      input = self
        .shadowRoot!.querySelector('sl-input')!
        .shadowRoot!.querySelector('input')

      const container = self.shadowRoot!.querySelector(
          '.datepicker-container'
        )!,
        datepicker = new Datepicker(input, {
          calendarWeeks: true,
          daysOfWeekHighlighted: [0, 6],
          prevArrow: '&#x1F860;',
          nextArrow: '&#x1F862;',
          weekStart: 0,
          autohide: true,
          showOnFocus: true,
          updateOnBlur: false,
          todayHighlight: true,
          container,
          weeknumbers: true,
          format: {
            toValue(s: string) {
              return new Date(s)
            },

            toDisplay(date: Date) {
              return date.toISOString().substr(0, 10)
            }
          }

          //language: locale
        })

      container.addEventListener('mousedown', (ev) => {
        ev.preventDefault()
      })
    }, 0)
  })

  /*
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
  */

  function render() {
    return html`
      <div class="base">
        <div class="field-wrapper">
          <div class="label">${self.label}</div>
          <div class="control">
            <sl-input size="small">
              <sl-icon
                slot="suffix"
                class="calendar-icon"
                src=${calendarIcon}
              ></sl-icon>
            </sl-input>
            <div class="error">${self.error}</div>
            <div class="datepicker-container"></div>
          </div>
        </div>
      </div>
    `
  }

  return render
}
