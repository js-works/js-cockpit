import { component, elem, prop, Attrs } from 'js-element'
import { classMap, html, lit } from 'js-element/lit'
import { useAfterMount, useBeforeRender } from 'js-element/hooks'
import { useI18n } from '../../utils/hooks'

import {
  getLocalization,
  initPopper,
  DatepickerInstance
} from './date-picker-utils'

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
import datePickerBaseStyles from '../../../../node_modules/vanillajs-datepicker/dist/css/datepicker-foundation.css'
import datePickerCustomStyles from './date-picker-custom.css'
import controlStyles from '../../shared/css/control.css'

// === exports ====================================================

export { DateField }

// === DateField ==================================================

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
        slInput: shadowRoot.querySelector<SlInput>('sl-input')!,
        pickerContainer: shadowRoot.querySelector('.picker-container')!,
        namespace: self.localName
      })
    })
  })

  useBeforeRender(() => {
    const locale = getLocale()
    const localization = getLocalization(locale, self.localName)

    if (datepicker) {
      datepicker.setOptions({
        language: `${self.localName}::${locale}`,
        weekStart: localization.weekStart,
        format: localization.format
      })
    }
  })

  function render() {
    return html`
      <div class="base ${classMap({ required: self.required })}">
        <div class="field-wrapper">
          <div class="label">${self.label}</div>
          <div class="control">
            <sl-input>
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

// === locals ========================================================

function createDatepicker(params: {
  slInput: SlInput
  pickerContainer: Element
  getLocale: () => string
  namespace: string
}): DatepickerInstance {
  let datepicker: any
  const { slInput, pickerContainer: container, getLocale } = params
  const input = (slInput as any).shadowRoot!.querySelector('input')!
  const locale = getLocale()
  const localization = getLocalization(getLocale(), params.namespace)

  container.addEventListener('mousedown', (ev) => ev.preventDefault())

  input.addEventListener('hide', () => {
    slInput.readonly = false
    slInput.value = input!.value
  })

  input.addEventListener('show', () => {
    slInput.readonly = true
  })

  datepicker = new Datepicker(input, {
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
    format: localization.format,
    getCalendarWeek: localization.getCalendarWeek
  })

  initPopper(slInput, datepicker)

  return datepicker
}
