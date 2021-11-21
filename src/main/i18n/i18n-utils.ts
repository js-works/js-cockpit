// === exports =======================================================

export {
  formatDate,
  formatNumber,
  formatRelativeTime,
  getCalendarWeek,
  getFirstDayOfWeek,
  getLocaleInfo,
  getWeekendDays,
  parseDate,
  parseNumber
}

// === constants =====================================================

const defaultFirstDayOfWeek = 1
const defaultWeekendDays = Object.freeze([0, 6]) // Sunday and Saturday

const DefaultDateFormat: Intl.DateTimeFormatOptions = Object.freeze({
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
})

// === getLocaleInfo =================================================

type LocaleInfo = Readonly<{
  baseName: string
  language: string
  region: string | undefined
}>

const localeInfoMap = new Map<string, LocaleInfo>()

function getLocaleInfo(locale: string): LocaleInfo {
  let info = localeInfoMap.get(locale)

  if (!info) {
    info = new (Intl as any).Locale(locale) // TODO
    localeInfoMap.set(locale, info!)
  }

  return info!
}

// --- getFirstDayOfWeek ---------------------------------------------

// Source: https://github.com/unicode-cldr/cldr-core/blob/master/supplemental/weekData.json
// Day of week is represented by number (0 = sunday, ..., 6 = saturday).
const firstDayOfWeekData: Record<number, string> = {
  0:
    'AG,AS,AU,BD,BR,BS,BT,BW,BZ,CA,CN,CO,DM,DO,ET,GT,GU,HK,HN,ID,IL,IN,' +
    'JM,JP,KE,KH,KR,LA,MH,MM,MO,MT,MX,MZ,NI,NP,PA,PE,PH,PK,PR,PT,PY,SA,' +
    'SG,SV,TH,TT,TW,UM,US,VE,VI,WS,YE,ZA,ZW',
  1:
    'AD,AI,AL,AM,AN,AR,AT,AX,AZ,BA,BE,BG,BM,BN,BY,CH,CL,CM,CR,CY,CZ,DE,' +
    'DK,EC,EE,ES,FI,FJ,FO,FR,GB,GE,GF,GP,GR,HR,HU,IE,IS,IT,KG,KZ,LB,LI,' +
    'LK,LT,LU,LV,MC,MD,ME,MK,MN,MQ,MY,NL,NO,NZ,PL,RE,RO,RS,RU,SE,SI,SK,' +
    'SM,TJ,TM,TR,UA,UY,UZ,VA,VN,XK',
  5: 'MV',
  6: 'AE,AF,BH,DJ,DZ,EG,IQ,IR,JO,KW,LY,OM,QA,SD,SY'
}

let firstDayOfWeekByCountryCode: Map<string, number>

function getFirstDayOfWeek(locale: string): number {
  if (!firstDayOfWeekByCountryCode) {
    firstDayOfWeekByCountryCode = new Map()

    for (const firstDayOfWeek of Object.keys(firstDayOfWeekData)) {
      const firstDay = (firstDayOfWeek as any) as number
      const countryCodes = firstDayOfWeekData[firstDay].split(',')

      countryCodes.forEach((countryCode) => {
        firstDayOfWeekByCountryCode.set(countryCode, firstDay)
      })
    }
  }

  const region = getLocaleInfo(locale).region

  return region
    ? firstDayOfWeekByCountryCode.get(region) || defaultFirstDayOfWeek
    : defaultFirstDayOfWeek
}

// --- getWeekendDays ------------------------------------------------

// Source: https://github.com/unicode-cldr/cldr-core/blob/master/supplemental/weekData.json
const weekendData: Record<string, string> = {
  // Friday and Saturday
  '5+6': 'AE,BH,DZ,EG,IL,IQ,JO,KW,LY,OM,QA,SA,SD,SY,YE',

  // Thursday and Friday
  '4+5': 'AF',

  // Sunday
  '6': 'IN,UG',

  // Friday
  '5': 'IR'
}

let weekendDaysByCountryCode: Map<string, Readonly<number[]>>

function getWeekendDays(locale: string): Readonly<number[]> {
  if (!weekendDaysByCountryCode) {
    weekendDaysByCountryCode = new Map()

    for (const [key, value] of Object.entries(weekendData)) {
      const days = Object.freeze(key.split('+').map((it) => parseInt(it)))
      const countryCodes = value.split(',')

      countryCodes.forEach((countryCode) => {
        weekendDaysByCountryCode.set(countryCode, days)
      })
    }
  }

  const region = getLocaleInfo(locale).region

  return region
    ? weekendDaysByCountryCode.get(region) || defaultWeekendDays
    : defaultWeekendDays
}

// --- parseNumber ---------------------------------------------------

const numberParserByLocale = new Map<string, (s: string) => number | null>()

function parseNumber(locale: string, numberString: string): number | null {
  let numberParser = numberParserByLocale.get(locale)

  if (!numberParser) {
    const example = Intl.NumberFormat(locale).format(3.4)

    if (
      example.indexOf('3') !== 0 ||
      example.indexOf('4') !== 2 ||
      example.length !== 3
    ) {
      throw new Error('Unsupported locale for automatic number parser')
    }

    const separators = new Set(
      Intl.NumberFormat(locale).format(123456789).replace(/\d/g, '').split('')
    )

    if (separators.size > 1) {
      throw new Error('Unsupported locale for automatic number parser')
    }

    const decimalSeparator = example[1]
    const digitGroupSeparator = [...separators.values()][0] || ''

    const regExp = new RegExp(
      `^\\d(\\d|${escapeRegExp(digitGroupSeparator)})*(${escapeRegExp(
        decimalSeparator
      )}\\d+)?$`
    )

    numberParser = (s: string) => {
      if (!s.match(regExp)) {
        return null
      }

      let numberString = s

      if (digitGroupSeparator) {
        numberString = numberString.replaceAll(digitGroupSeparator, '')
      }

      numberString = numberString.replace(decimalSeparator, '.')

      let number = parseFloat(numberString)

      if (numberString !== number.toString()) {
        return null
      }

      return number
    }

    numberParserByLocale.set(locale, numberParser)
  }

  return numberParser(numberString)
}

// --- parseDate -----------------------------------------------------

function parseDate(locale: string, dateString: string): Date | null {
  return getDateParser(locale)(dateString)
}

// --- getDateParser -------------------------------------------------

const dateParserByLocale = new Map<string, (date: string) => Date | null>()

function getDateParser(locale: string): (s: string) => Date | null {
  let dateParser = dateParserByLocale.get(locale)

  if (!dateParser) {
    const example = Intl.DateTimeFormat(locale).format(new Date('2100-11-23'))

    if (
      example.indexOf('2100') === -1 ||
      example.indexOf('11') === -1 ||
      example.indexOf('23') === -1
    ) {
      // too complex date format - use ISO format as fallback
      dateParserByLocale.set(locale, parseIsoDateString)
      return parseIsoDateString
    }

    const regExp = new RegExp(
      '^' +
        escapeRegExp(example)
          .replace('2100', '\\s*(?<year>\\d{1,4})\\s*')
          .replace('11', '\\s*(?<month>\\d{1,2})\\s*')
          .replace('23', '\\s*(?<day>\\d{1,2})\\s*') +
        '$'
    )

    dateParser = (s: string) => {
      const match = regExp.exec(s)

      if (!match) {
        return null
      }

      const { year, month, day } = match.groups!

      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    }

    dateParserByLocale.set(locale, dateParser)
  }

  return dateParser
}

// --- formatNumber --------------------------------------------------

function formatNumber(
  locale: string,
  value: number,
  format: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, format).format(value)
}

// --- formatDate ----------------------------------------------------

function formatDate(
  locale: string,
  value: Date,
  format?: Intl.DateTimeFormatOptions | null
): string {
  if (!format) {
    if (getDateParser(locale) === parseIsoDateString) {
      return value.toISOString().substr(0, 10)
    }

    format = DefaultDateFormat
  }

  return new Intl.DateTimeFormat(locale, format).format(value)
}

// --- parseIsoDateString --------------------------------------------

function parseIsoDateString(s: string): Date | null {
  // TODO!!!!!
  return new Date(s)
}

// === getCalendarWeek ===============================================

function getCalendarWeek(locale: string, date: Date) {
  // Code is based on this solution here:
  // https://stackoverflow.com/questions/23781366/date-get-week-number-for-custom-week-start-day
  // TODO - check algorithm

  const weekstart = getFirstDayOfWeek(locale)
  const target = new Date(date)

  // Replaced offset of (6) with (7 - weekstart)
  const dayNum = (date.getDay() + 7 - weekstart) % 7
  target.setDate(target.getDate() - dayNum + 3)
  const firstThursday = target.valueOf()
  target.setMonth(0, 1)

  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7))
  }

  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000)
}

function formatRelativeTime(
  locale: string,
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  format: Intl.RelativeTimeFormatOptions
): string {
  return new Intl.RelativeTimeFormat(locale, format).format(value, unit)
}

// === utils =========================================================

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
