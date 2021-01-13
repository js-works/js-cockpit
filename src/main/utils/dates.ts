const MONTH_LENGHTS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const MONTH_LENGTHS_LEAP_YEAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export function isLeapYear(year: number) {
  if (year <= 0) {
    throw new TypeError('Expecting year greater than 0')
  }

  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function getToday(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

export function getYesterday(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, date.getDate() - 1)
}

export function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1)
}

export function getLengthOfMonth(year: number, month: number) {
  const monthLengths = isLeapYear(year)
    ? MONTH_LENGTHS_LEAP_YEAR
    : MONTH_LENGHTS

  return monthLengths[month]
}

export function getLengthOfPrevMonth(year: number, month: number) {
  const lastMonth = new Date(year, month - 1, 1)
  return getLengthOfMonth(lastMonth.getFullYear(), lastMonth.getMonth())
}

export function getWeekOfYear(date: Date, firstDayInWeek: number) {
  const firstDayInYear = new Date(date.getFullYear(), 0, 1)
  const diff = date.getTime() - firstDayInYear.getTime()

  return Math.ceil((diff / 7) * 24 * 60 * 60)
}
