import {
  addToDict,
  Category,
  ComponentLocalizer,
  Locale,
  Localizer,
  Translation,
  TermKey
} from './localize/localize'

import { CockpitTranslation } from './terms'

export {
  addToDict,
  Category,
  CockpitTranslation,
  CockpitTranslations,
  ComponentLocalizer,
  Locale,
  Localizer,
  PartialCockpitTranslations,
  TermKey,
  Translation
}

import './translations/en'

type CockpitTranslations = Record<Locale, CockpitTranslation>

type PartialCockpitTranslations = Partial<
  { [K in keyof CockpitTranslations]: Partial<CockpitTranslations[K]> }
>
