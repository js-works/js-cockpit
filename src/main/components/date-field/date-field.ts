import {
  elem,
  prop,
  afterInit,
  afterUpdate,
  Attrs,
  Component
} from '../../utils/components'

import { html, classMap } from '../../utils/lit'
import { createLocalizer } from '../../utils/i18n'

import {
  getLocalization,
  initPopup,
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
//import datePickerBaseStyles from '../../../../node_modules/vanillajs-datepicker/dist/css/datepicker-foundation.css'

//import datePickerCustomStyles from './date-picker-custom.css'
import controlStyles from '../../shared/css/control.css'
import datePickerStyles from './date-picker.scss'

// === exports ====================================================

export { DateField }

// === DateField ==================================================

@elem({
  tag: 'c-date-field',
  styles: [
    // datePickerBaseStyles,
    // datePickerCustomStyles,
    datePickerStyles,
    dateFieldStyles,
    controlStyles
  ],
  uses: [SlIcon, SlIconButton, SlInput]
})
class DateField extends Component {
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

  private _loc = createLocalizer(this)
  private _datepicker: DatepickerInstance | null = null

  constructor() {
    super()

    afterInit(this, () => {
      const shadowRoot = this.shadowRoot!

      setTimeout(() => {
        this._datepicker = createDatepicker({
          getLocale: this._loc.getLocale,
          slInput: shadowRoot.querySelector<SlInput>('sl-input')!,
          pickerContainer: shadowRoot.querySelector('.picker-container')!,
          namespace: this.localName
        })
      })
    })

    afterUpdate(this, () => {
      const locale = this._loc.getLocale()
      const localization = getLocalization(locale, this.localName)

      if (this._datepicker) {
        this._datepicker.setOptions({
          language: `${this.localName}::${locale}`,
          weekStart: localization.weekStart,
          format: localization.format
        })
      }
    })
  }

  render() {
    return html`
      <div class="base ${classMap({ required: this.required })}">
        <div class="field-wrapper">
          <div class="control">
            <sl-input>
              <sl-icon slot="suffix" class="calendar-icon" src=${calendarIcon}>
              </sl-icon>
              <div slot="label" class="label">${this.label}</div>
            </sl-input>
            <div class="error">${this.error}</div>
            <div class="picker-container"></div>
          </div>
        </div>
      </div>
    `
  }
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

  initPopup(slInput, datepicker)

  return datepicker
}
