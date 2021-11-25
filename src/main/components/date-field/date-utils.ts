import SlInput from '@shoelace-style/shoelace/dist/components/input/input'
import { localize } from 'js-localize'
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

// === functions =====================================================

function getLocalization(locale: string, namespace: string): Localization {
  const key = `${namespace}::${locale}`

  return (
    Datepicker.locales[key] ||
    (Datepicker.locales[key] = createLocalization(locale))
  )
}

function createDatepicker(params: {
  slInput: SlInput
  pickerContainer: Element
  getLocale: () => string
  namespace: string
}): DatepickerInstance {
  let datepicker: any
  let popper: PopperInstance
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

    getCalendarWeek(date: Date, weekStart: number) {
      return localization.getCalendarWeek(date)
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
  const localizer = localize(locale)
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
    getCalendarWeek: localizer.getCalendarWeek,

    format: {
      toValue: localizer.parseDate,
      toDisplay: localizer.formatDate
    }
  }
}
