import type { ReactiveControllerHost } from 'lit';

export {
  formatDay,
  formatWeekNumber,
  formatYear,
  getCalendarWeek,
  getDecadeTitle,
  getFirstDayOfWeek,
  getHourMinuteString,
  getMonthName,
  getMonthTitle,
  getWeekdayName,
  getWeekendDays,
  getYearMonthDayString,
  getYearMonthString,
  getYearString,
  getYearTitle,
  getYearWeekString
};

// === local types ===================================================

type LocaleInfo = Readonly<{
  baseName: string;
  language: string;
  region: string | undefined;
}>;

// === local data ====================================================

// ***********************************************************************
// ** Locale information for "first day of week", or "weekend days", or
// ** "week number" is currently (September 2022) not available in Intl
// ** (see https://github.com/tc39/proposal-intl-locale-info)
// ** so we have to take care of that on our own
// ***********************************************************************

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
};

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
};

const localeInfoMap = new Map<string, LocaleInfo>();
let firstDayOfWeekByCountryCode: Map<string, number>;
let weekendDaysByCountryCode: Map<string, Readonly<number[]>>;

function getMonthTitle(locale: string, year: number, month: number) {
  const date = new Date(year, month, 1);

  return ucFirst(
    new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long'
    }).format(date)
  );
}

function getYearTitle(locale: string, year: number) {
  const date = new Date(year, 0, 1);

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric'
  }).format(date);
}

function getDecadeTitle(
  locale: string,
  year: number,
  yearCount = 10,
  offset = 0
) {
  const startYear = Math.floor(year / 10) * 10;

  return Intl.DateTimeFormat(locale, {
    year: 'numeric'
    /* @ts-ignore */ // TODO!!!
  }).formatRange(
    new Date(startYear + offset, 1, 1),
    new Date(startYear + offset + yearCount - 1, 1, 1)
  );
}

function getLocaleInfo(locale: string): LocaleInfo {
  let info = localeInfoMap.get(locale);

  if (!info) {
    info = new (Intl as any).Locale(locale); // TODO
    localeInfoMap.set(locale, info!);
  }

  return info!;
}

function getCalendarWeek(locale: string, date: Date) {
  // Code is based on this solution here:
  // https://stackoverflow.com/questions/23781366/date-get-week-number-for-custom-week-start-day
  // TODO - check algorithm

  const weekstart = getFirstDayOfWeek(locale);
  const target = new Date(date);

  // Replaced offset of (6) with (7 - weekstart)
  const dayNum = (date.getDay() + 7 - weekstart) % 7;
  target.setDate(target.getDate() - dayNum + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);

  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }

  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

function getFirstDayOfWeek(locale: string): number {
  if (!firstDayOfWeekByCountryCode) {
    firstDayOfWeekByCountryCode = new Map();

    for (const firstDayOfWeek of Object.keys(firstDayOfWeekData)) {
      const firstDay = Number.parseInt(firstDayOfWeek, 10);
      const countryCodes = firstDayOfWeekData[firstDay].split(',');

      countryCodes.forEach((countryCode) => {
        firstDayOfWeekByCountryCode.set(countryCode, firstDay);
      });
    }
  }

  const region = getLocaleInfo(locale).region!;

  return region ? firstDayOfWeekByCountryCode.get(region) ?? 1 : 1;
}

function formatDay(locale: string, day: number) {
  return Intl.DateTimeFormat(locale, { day: 'numeric' }).format(
    new Date(1970, 0, day)
  );
}

function formatWeekNumber(locale: string, weekNumber: number) {
  return Intl.NumberFormat(locale).format(weekNumber);
}

function formatYear(locale: string, year: number) {
  return Intl.DateTimeFormat(locale, { year: 'numeric' }).format(
    new Date(year, 0, 1)
  );
}

function getMonthName(
  locale: string,
  month: number,
  format: 'long' | 'short' | 'narrow' = 'long'
) {
  const date = new Date(1970, month, 1);

  return new Intl.DateTimeFormat(locale, { month: format }).format(date);
}

function getWeekendDays(locale: string): Readonly<number[]> {
  if (!weekendDaysByCountryCode) {
    weekendDaysByCountryCode = new Map();

    for (const [key, value] of Object.entries(weekendData)) {
      const days = Object.freeze(key.split('+').map((it) => parseInt(it)));
      const countryCodes = value.split(',');

      countryCodes.forEach((countryCode) => {
        weekendDaysByCountryCode.set(countryCode, days);
      });
    }
  }

  const region = getLocaleInfo(locale).region;

  return region ? weekendDaysByCountryCode.get(region) || [0, 6] : [0, 6];
}

function getWeekdayName(
  locale: string,
  day: number,
  format: 'long' | 'short' | 'narrow' = 'long'
) {
  const date = new Date(1970, 0, 4 + (day % 7));
  return new Intl.DateTimeFormat(locale, {
    weekday: format
  }).format(date);
}

// === helpers =======================================================

function ucFirst(s: string): string {
  const length = s.length;

  if (length === 0) {
    return s;
  } else if (length === 1) {
    return s.toUpperCase();
  } else {
    return s[0].toUpperCase() + s.slice(1);
  }
}

function getYearMonthDayString(year: number, month: number, day: number) {
  const y = year.toString().padStart(4, '0');
  const m = (month + 1).toString().padStart(2, '0');
  const d = day.toString().padStart(2, '0');

  return `${y}-${m}-${d}`;
}

function getYearMonthString(year: number, month: number) {
  const y = year.toString().padStart(4, '0');
  const m = (month + 1).toString().padStart(2, '0');

  return `${y}-${m}`;
}

function getYearWeekString(year: number, week: number) {
  const y = year.toString().padStart(4, '0');
  const w = week.toString().padStart(2, '0');

  return `${y}-W${w}`;
}

function getYearString(year: number) {
  return year.toString();
}

function getHourMinuteString(hour: number, minute: number) {
  const h = hour.toString().padStart(2, '0');
  const m = minute.toString().padStart(2, '0');

  return `${h}:${m}`;
}
