import { component, elem, prop, Attrs } from 'js-element'
import { html, lit } from 'js-element/lit'
import { useAfterMount, useBeforeRender } from 'js-element/hooks'
import { useI18n } from '../../utils/hooks'

import {
  createDateRangePicker,
  getLocalization,
  DatepickerInstance
} from '../date-field/date-utils'

// custom elements
import SlInput from '@shoelace-style/shoelace/dist/components/input/input'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlIconButton from '@shoelace-style/shoelace/dist/components/icon-button/icon-button'

// icons
import calendarIcon from '../../icons/calendar-range.svg'
import arrowRightIcon from '../../icons/arrow-right.svg'

// styles

import dateRangeStyles from './date-range.css'
import datePickerBaseStyles from 'vanillajs-datepicker/dist/css/datepicker-foundation.css'
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
        pickerContainer: shadowRoot.querySelector('.picker-container')!
      })
    }, 0)
  })

  function render() {
    return html`
      <div class="base">
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
