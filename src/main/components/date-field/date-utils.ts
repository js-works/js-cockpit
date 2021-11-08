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
  pickerContainer: HTMLElement
  getLocale: () => string
}): DatepickerInstance {
  const { slInput, pickerContainer: container, getLocale } = params
  const input = (slInput as any).shadowRoot!.querySelector('input')!
  let datepicker: any
  let popper: PopperInstance

  container.addEventListener('mousedown', (ev) => ev.preventDefault())

  setTimeout(() => {
    const locale = getLocale()
    const localization = getLocalization(getLocale())
    // this is an ugly workaround because of some
    // strange positioning issues with popper
    input.addEventListener('show', () => {
      const pickerElem = datepicker.picker.element

      pickerElem.style.visibility = 'hidden'
      pickerElem.style.overflow = 'hidden'

      requestAnimationFrame(() => {
        popper.update()

        requestAnimationFrame(() => {
          popper.update()
          pickerElem.style.visibility = ''
          pickerElem.style.overflow = ''
        })
      })
    })

    input.addEventListener('hide', () => {
      slInput.value = input!.value
    })

    datepicker = new Datepicker(input, {
      calendarWeeks: true,
      daysOfWeekHighlighted: [0, 6],
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

    popper = createPopper(slInput as any, datepicker.picker.element, {
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
  }, 0)
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
  let datepicker: any
  let popper: PopperInstance

  container.addEventListener('mousedown', (ev) => ev.preventDefault())

  setTimeout(() => {
    const locale = getLocale()
    const localization = getLocalization(getLocale())
    /*
    // this is an ugly workaround because of some
    // strange positioning issues with popper
    ;[input1, input2].forEach((input) => input.addEventListener('show', () => {
      const pickerElem = datepicker.picker.element

      pickerElem.style.visibility = 'hidden'
      pickerElem.style.overflow = 'hidden'

      requestAnimationFrame(() => {
        popper.update()

        requestAnimationFrame(() => {
          popper.update()
          pickerElem.style.visibility = ''
          pickerElem.style.overflow = ''
        })
      })
    })

    input.addEventListener('hide', () => {
      slInput.value = input!.value
    })
  */

    datepicker = new DateRangePicker(range, {
      inputs: [input1, input2],
      calendarWeeks: true,
      daysOfWeekHighlighted: [0, 6],
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

    /*
    popper = createPopper(slInput as any, datepicker.picker.element, {
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
*/
  }, 0)
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
    titleFormat: 'MM y',

    format: {
      toValue(s: string) {
        return localizer.parseDate(s)
      },

      toDisplay(date: Date) {
        return localizer.formatDate(date, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      }
    }
  }
}
