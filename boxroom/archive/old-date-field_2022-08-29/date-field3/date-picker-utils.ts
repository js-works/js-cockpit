import SlInput from '@shoelace-style/shoelace/dist/components/input/input'
import { I18nFacade } from '../../i18n/i18n'
import { autoUpdate, computePosition, flip } from '@floating-ui/dom'

// @ts-ignore
import { Datepicker } from 'vanillajs-datepicker'

// === exports =======================================================

export {
  getLocalization,
  initPopup,
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

function initPopup(slInput: SlInput, datepicker: DatepickerInstance) {
  const input = slInput.shadowRoot?.querySelector('input')!
  const datepickerElem = datepicker.picker.element
  datepickerElem.style.position = 'absolute !important'

  const update = () => {
    computePosition(slInput, datepickerElem, {
      placement: 'bottom-start',
      middleware: [flip()]
    }).then(({ x, y }) => {
      Object.assign(datepickerElem.style, {
        left: `${x}px`,
        top: `${y}px`
      })
    })
  }

  update()

  let cleanup: (() => void) | null = null

  input.addEventListener('show', () => {
    update()
    cleanup = autoUpdate(slInput, datepickerElem, update)
  })

  input.addEventListener('hide', () => {
    cleanup && cleanup()
    cleanup = null
  })
}

function createLocalization(locale: string) {
  const i18n = new I18nFacade(() => locale)
  let daysShort = i18n.getDayNames('short')

  if (daysShort.some((it) => it.length > 4)) {
    daysShort = i18n.getDayNames('narrow')
  }

  return {
    days: i18n.getDayNames('long'),
    daysShort,
    daysMin: daysShort,
    months: i18n.getMonthNames('long'),
    monthsShort: i18n.getMonthNames('short'),
    weekStart: i18n.getFirstDayOfWeek(),
    weekendDays: i18n.getWeekendDays(),
    titleFormat: 'MM y',
    getCalendarWeek: i18n.getCalendarWeek.bind(i18n),

    format: {
      toValue: i18n.parseDate.bind(i18n),
      toDisplay: i18n.formatDate.bind(i18n)
    }
  }
}
