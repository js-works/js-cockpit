import SlInput from '@shoelace-style/shoelace/dist/components/input/input'
import { I18n } from '../../misc/i18n'
import { createPopper, Instance as PopperInstance } from '@popperjs/core'

// @ts-ignore
import { Datepicker, DateRangePicker } from 'vanillajs-datepicker'

// === exports =======================================================

export {
  createDatepicker,
  createDateRangePicker,
  getLocalization,
  DatepickerInstance,
  DateRangePickerInstance
}

// === types =========================================================

type DatepickerInstance = any
type DateRangePickerInstance = any
type Localization = ReturnType<typeof createLocalization>

// === prepare date locales object ===============================

Object.defineProperty(Datepicker, 'locales', {
  value: {
    en: createLocalization('en-US')
  }
})

// === functions =====================================================

function getLocalization(locale: string): Localization {
  return (
    Datepicker.locales[locale] ||
    (Datepicker.locales[locale] = createLocalization(locale))
  )
}

function createDatepicker(params: {
  slInput: SlInput
  pickerContainer: Element
  getLocale: () => string
}): DatepickerInstance {
  let datepicker: any
  let popper: PopperInstance
  const { slInput, pickerContainer: container, getLocale } = params
  const input = (slInput as any).shadowRoot!.querySelector('input')!
  const locale = getLocale()
  const localization = getLocalization(getLocale())

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
    language: locale,
    weekStart: localization.weekStart,
    format: localization.format,

    getCalendarWeek(timestamp: number, weekStart: number) {
      return localization.getCalendarWeek(new Date(timestamp))
    }
  })

  popper = initPopper(slInput, datepicker)

  return datepicker
}

function createDateRangePicker(params: {
  range: HTMLElement
  slInput1: SlInput
  slInput2: SlInput
  pickerContainer: HTMLElement
  getLocale: () => string
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
    const localization = getLocalization(getLocale())

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
      language: locale,
      weekStart: localization.weekStart,
      format: localization.format
    })

    initPopper(slInput1, dateRangePicker.datepickers[0])
    initPopper(slInput2, dateRangePicker.datepickers[1])
  }, 0)
}

// === helpers =======================================================

function initPopper(slInput: SlInput, datepicker: DatepickerInstance) {
  const inputElem = (slInput as any).shadowRoot!.querySelector('input')
  const pickerElem = datepicker.picker.element

  const popper = createPopper(slInput as any, pickerElem, {
    placement: 'bottom-start',
    strategy: 'absolute',

    modifiers: [
      {
        name: 'offset',

        options: {
          offset({ placement }: { placement: string }) {
            return placement === 'top-start' ? [0, 4] : [0, 0]
          }
        }
      }
    ]
  })

  // ugly workaround due to some strange popper
  // positioning issues
  inputElem.addEventListener('show', () => {
    pickerElem.style.visibility = 'hidden'
    pickerElem.style.overflow = 'hidden'
    slInput.readonly = true

    requestAnimationFrame(() => {
      popper.update()

      requestAnimationFrame(() => {
        popper.update()
        pickerElem.style.visibility = ''
        pickerElem.style.overflow = ''
      })
    })
  })

  return popper
}

function createLocalization(locale: string) {
  const localizer = I18n.localizer(locale)
  let daysShort = localizer.getDayNames('short')

  if (daysShort.some((it) => it.length > 4)) {
    daysShort = localizer.getDayNames('narrow')
  }

  return {
    days: localizer.getDayNames('long'),
    daysShort,
    daysMin: daysShort,
    months: localizer.getMonthNames('long'),
    monthsShort: localizer.getMonthNames('short'),
    weekStart: localizer.getFirstDayOfWeek(),
    weekendDays: localizer.getWeekendDays(),
    titleFormat: 'MM y',

    format: {
      toValue(s: string) {
        return localizer.parseDate(s)
      },

      toDisplay(date: Date) {
        return localizer.formatDate(date)
      }
    },

    getCalendarWeek(date: Date) {
      return localizer.getCalendarWeek(date)
    }
  }
}