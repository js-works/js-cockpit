import SlInput from '@shoelace-style/shoelace/dist/components/input/input'
import { localize } from 'js-localize'
import { createPopper } from '@popperjs/core'

// @ts-ignore
import { Datepicker } from 'vanillajs-datepicker'

// === exports =======================================================

export {
  getLocalization,
  initPopper,
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
