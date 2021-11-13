import { component, elem, prop, Attrs } from 'js-element'
import { html, lit } from 'js-element/lit'
import {
  useAfterMount,
  useBeforeRender,
  useAfterUpdate
} from 'js-element/hooks'
import { useI18n } from '../../utils/hooks'

import {
  createDatepicker,
  getLocalization,
  DatepickerInstance
} from './date-utils'

// custom elements
import SlInput from '@shoelace-style/shoelace/dist/components/input/input'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlIconButton from '@shoelace-style/shoelace/dist/components/icon-button/icon-button'

// icons
import calendarIcon from '../../icons/calendar3.svg'

// styles
import dateFieldStyles from './date-field.css'
import datePickerBaseStyles from '../../../../node_modules/vanillajs-datepicker/dist/css/datepicker-foundation.css'
import datePickerCustomStyles from './date-picker-custom.css'
import controlStyles from '../../shared/css/control.css'

// === exports =======================================================

export { DateField }

// === Cockpit ===================================================

@elem({
  tag: 'c-date-field',
  styles: [
    datePickerBaseStyles,
    datePickerCustomStyles,
    dateFieldStyles,
    controlStyles
  ],
  impl: lit(dateFieldImpl),
  uses: [SlIcon, SlIconButton, SlInput]
})
class DateField extends component() {
  @prop({ attr: Attrs.string })
  label = ''

  @prop()
  value: Date | null = null

  @prop({ attr: Attrs.string })
  error = ''

  @prop({ attr: Attrs.boolean })
  disabled = false

  @prop({ attr: Attrs.boolean })
  required = false
}

function dateFieldImpl(self: DateField) {
  const { i18n } = useI18n()
  const getLocale = () => i18n.getLocale()
  const shadowRoot = self.shadowRoot!
  let datepicker: DatepickerInstance

  useAfterMount(() => {
    setTimeout(() => {
      datepicker = createDatepicker({
        getLocale,
        slInput: shadowRoot.querySelector('sl-input')!,
        pickerContainer: shadowRoot.querySelector('.picker-container')!
      })
    })
  })

  useBeforeRender(() => {
    const locale = getLocale()
    const localization = getLocalization(locale)

    if (datepicker) {
      datepicker.setOptions({
        language: locale,
        weekStart: localization.weekStart,
        format: localization.format
      })
    }
  })

  useAfterMount(() => {
    setTimeout(() => {
      const value = new Date('2017-01-01')
      datepicker.setDate(value)
    }, 1000)
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
            <div class="picker-container"></div>
          </div>
        </div>
      </div>
    `
  }

  return render
}
