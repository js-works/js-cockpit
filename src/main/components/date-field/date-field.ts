import { component, elem, prop, Attrs } from 'js-element'
import { html, lit, createRef, ref } from 'js-element/lit'
import { useAfterMount, useBeforeRender } from 'js-element/hooks'
import { I18n } from '../../misc/i18n'
import { useI18n } from '../../utils/hooks'

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

// === prepare date locales object ===============================

Object.defineProperty(Datepicker, 'locales', {
  value: {
    en: createLocalization('en-US')
  }
})

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
  const { i18n } = useI18n()
  let input: HTMLInputElement | null = null
  let datepicker: any

  useAfterMount(() => {
    setTimeout(() => {
      const shadowRoot = self.shadowRoot!
      const slInput: HTMLElement = shadowRoot.querySelector('sl-input') as any
      const container: HTMLElement = shadowRoot.querySelector(
        '.datepicker-container'
      )!

      input = slInput.shadowRoot!.querySelector('input')!

      datepicker = new Datepicker(input, {
        calendarWeeks: true,
        daysOfWeekHighlighted: [0, 6],
        prevArrow: '&#x1F860;',
        nextArrow: '&#x1F862;',
        autohide: true,
        showOnFocus: true,
        updateOnBlur: false,
        todayHighlight: true,
        container,
        weeknumbers: true,
        language: i18n.getLocale(),
        weekStart: i18n.getFirstDayOfWeek(),
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

  useBeforeRender(() => {
    const locale = i18n.getLocale()

    if (!Datepicker.locales[locale]) {
      Datepicker.locales[locale] = createLocalization(locale)
    }

    if (datepicker) {
      datepicker.setOptions({
        language: i18n.getLocale(),
        weekStart: i18n.getFirstDayOfWeek()
      })
    }
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

// === helpers =======================================================

function createLocalization(locale: string) {
  const localizer = I18n.localizer(locale)

  return {
    days: localizer.getDayNames('long'),
    daysShort: localizer.getDayNames('short'),
    daysMin: localizer.getDayNames('short'),
    months: localizer.getMonthNames('long'),
    monthsShort: localizer.getMonthNames('short'),
    weekStart: localizer.getFirstDayOfWeek(),

    today: 'Today', // not needed here
    clear: 'Clear', // not needed here
    titleFormat: 'MM y', // not neded here
    format: 'mm/dd/yyyy' // not needed here
  }
}
