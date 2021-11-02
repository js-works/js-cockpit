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

@elem({
  tag: 'c-date-field',
  styles: [datepickerStyles, dateFieldStyles, controlStyles],
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
  let datepicker: any = null
  let input: HTMLInputElement | null = null

  const onDatepickerHide = () => {} //alert('wooohooo')

  useAfterMount(() => {
    setTimeout(() => {
      const shadowRoot = self.shadowRoot!
      const slInput = shadowRoot.querySelector('sl-input')!
      const container: HTMLElement = shadowRoot.querySelector(
        '.datepicker-container'
      )!

      input = slInput.shadowRoot!.querySelector('input')
      const base = shadowRoot.querySelector('.base')!

      const datepicker = new Datepicker(input, {
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
      })

      container.addEventListener('mousedown', (ev) => {
        ev.preventDefault()
      })
    }, 0)
  })

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
