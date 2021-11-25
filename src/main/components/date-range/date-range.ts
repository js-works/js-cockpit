import { component, elem, prop, Attrs } from 'js-element'
import { classMap, html, lit } from 'js-element/lit'
import { useAfterMount } from 'js-element/hooks'
import { useI18n } from '../../utils/hooks'

// @ts-ignore
import { DateRangePicker } from 'vanillajs-datepicker'

import {
  getLocalization,
  initPopper,
  DatepickerInstance
} from '../date-field/date-picker-utils'

// custom elements
import SlInput from '@shoelace-style/shoelace/dist/components/input/input'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlIconButton from '@shoelace-style/shoelace/dist/components/icon-button/icon-button'

// icons
import calendarIcon from '../../icons/calendar-range.svg'
import arrowRightIcon from '../../icons/arrow-right.svg'

// styles

import dateRangeStyles from './date-range.css'
import datePickerBaseStyles from '../../../../node_modules/vanillajs-datepicker/dist/css/datepicker-foundation.css'
import datePickerCustomStyles from '../date-field/date-picker-custom.css'
import controlStyles from '../../shared/css/control.css'

// === exports =======================================================

export { DateRange }

// === Cockpit ===================================================

@elem({
  tag: 'c-date-range',
  styles: [
    datePickerBaseStyles,
    datePickerCustomStyles,
    dateRangeStyles,
    controlStyles
  ],
  impl: lit(dateRangeImpl),
  uses: [SlIcon, SlIconButton, SlInput]
})
class DateRange extends component() {
  @prop({ attr: Attrs.string })
  label = ''

  @prop({ attr: Attrs.string })
  error = ''

  @prop({ attr: Attrs.boolean })
  disabled = false

  @prop({ attr: Attrs.boolean })
  required = false
}

function dateRangeImpl(self: DateRange) {
  const { i18n } = useI18n()
  const getLocale = () => i18n.getLocale()
  const shadowRoot = self.shadowRoot!
  let datepicker: DatepickerInstance

  useAfterMount(() => {
    setTimeout(() => {
      datepicker = createDateRangePicker({
        getLocale,
        range: shadowRoot.querySelector('.fields')!,
        slInput1: (shadowRoot.querySelector('.input1')! as any) as SlInput,
        slInput2: (shadowRoot.querySelector('.input2')! as any) as SlInput,
        pickerContainer: shadowRoot.querySelector('.picker-container')!,
        namespace: self.localName
      })
    }, 0)
  })

  function render() {
    return html`
      <div class="base ${classMap({ required: self.required })}">
        <div class="field-wrapper">
          <div class="label">${self.label}</div>
          <div class="control">
            <div class="fields">
              <sl-input size="small" class="input1"></sl-input>
              <div class="separator">
                <sl-icon src=${arrowRightIcon}></sl-icon>
              </div>
              <sl-input size="small" class="input2"> </sl-input>
              <sl-icon
                slot="suffix"
                class="calendar-icon"
                src=${calendarIcon}
              ></sl-icon>
            </div>
            <div class="error">${self.error}</div>
            <div class="picker-container"></div>
          </div>
        </div>
      </div>
    `
  }

  return render
}

function createDateRangePicker(params: {
  range: HTMLElement
  slInput1: SlInput
  slInput2: SlInput
  pickerContainer: HTMLElement
  getLocale: () => string
  namespace: string
}): DatepickerInstance {
  const {
    range,
    slInput1,
    slInput2,
    pickerContainer: container,
    getLocale
  } = params

  const input1 = (slInput1 as any).shadowRoot!.querySelector('input')!
  const input2 = (slInput2 as any).shadowRoot!.querySelector('input')!
  let dateRangePicker: any

  container.addEventListener('mousedown', (ev) => ev.preventDefault())

  setTimeout(() => {
    const locale = getLocale()
    const localization = getLocalization(getLocale(), params.namespace)

    input1.addEventListener('hide', () => {
      slInput1.value = input1!.value
    })

    input2.addEventListener('hide', () => {
      slInput2.value = input2.value
    })

    dateRangePicker = new DateRangePicker(range, {
      inputs: [input1, input2],
      calendarWeeks: true,
      daysOfWeekHighlighted: localization.weekendDays,
      prevArrow: '&#x1F860;',
      nextArrow: '&#x1F862;',
      autohide: true,
      showOnFocus: false,
      updateOnBlur: false,
      todayHighlight: true,
      container: container,
      weeknumbers: true,
      language: `${params.namespace}::${locale}`,
      weekStart: localization.weekStart,
      format: localization.format
    })

    initPopper(slInput1, dateRangePicker.datepickers[0])
    initPopper(slInput2, dateRangePicker.datepickers[1])
  }, 0)
}
