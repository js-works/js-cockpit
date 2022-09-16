// ***********************************************************************
// ** Locale information for "first day of week", or "weekend days", or
// ** "week number" is mostly neither available in @sholace-style/localize
// ** nor currently (September 2022) in Intl
// ** (see https://github.com/tc39/proposal-intl-locale-info)
// ** so we have to take care of that on our own
// ***********************************************************************

import { ComplexAttributeConverter } from 'lit';

export {
  dateAttributeConverter,
  getCalendarWeek,
  getFirstDayOfWeek,
  getMonthName,
  getWeekendDays,
  getWeekdayName
};

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

type LocaleInfo = Readonly<{
  baseName: string;
  language: string;
  region: string | undefined;
}>;

function getLocaleInfo(locale: string): LocaleInfo {
  let info = localeInfoMap.get(locale);

  if (!info) {
    info = new (Intl as any).Locale(locale); // TODO
    localeInfoMap.set(locale, info!);
  }

  return info!;
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

function getWeekdayName(
  locale: string,
  day: number,
  format: 'long' | 'short' | 'narrow' = 'long'
) {
  const date = new Date(1970, 0, 4 + (day % 7));
  return new Intl.DateTimeFormat(locale, { weekday: format }).format(date);
}

function getMonthName(
  locale: string,
  month: number,
  format: 'long' | 'short' | 'narrow' = 'long'
) {
  const date = new Date(1970, month, 1);

  return new Intl.DateTimeFormat(locale, { month: format }).format(date);
}

const dateAttributeConverter: ComplexAttributeConverter<Date | null, Date> = {
  fromAttribute(value) {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return null;
    }

    return new Date(value);
  },

  toAttribute(date) {
    if (!date) {
      return '';
    }

    return (
      String(date.getFullYear()).padStart(4, '0') +
      '-' +
      String(date.getMonth()).padStart(2, '0') +
      '-' +
      String(date.getDate()).padStart(2, '0')
    );
  }
};
