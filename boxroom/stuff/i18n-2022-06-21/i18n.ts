import {
  validateTranslations,
  AbstractLocalizer,
  Adapter,
  Localizer,
  PartialTranslations,
  Translation,
  Translations
} from './localize/localize'

import { getDirection } from './localize/localize-utils'

import {
  registerTranslation,
  LocalizeController
} from '@shoelace-style/localize'

import { CockpitTranslation } from './terms'
import { ReactiveControllerHost } from 'lit'

// === exports =======================================================

export {
  registerTranslations,
  CockpitTranslation,
  CockpitTranslations,
  I18nFacade,
  Localizer,
  PartialCockpitTranslations,
  Translation,
  Translations
}

// === constants =====================================================

const categoryTermSeparator = '/'

// === exported types ================================================

type CockpitTranslations = Translations<CockpitTranslation>
type PartialCockpitTranslations = PartialTranslations<CockpitTranslation>

// === misc ==========================================================

const adapter: Adapter = (() => {
  const fakeElem: HTMLElement & ReactiveControllerHost = Object.assign(
    document.createElement('div'),
    {
      addController() {},
      removeController() {},
      requestUpdate() {},
      updateComplete: Promise.resolve(true)
    }
  )

  const fakeLocalizeController = new LocalizeController(fakeElem)

  return {
    translate(locale, category, termKey, params, i18n) {
      const key = `${category}${categoryTermSeparator}${termKey}`
      fakeElem.lang = locale

      return fakeLocalizeController.term(key, params, i18n)
    }
  }
})()

class I18nFacade<
  T extends Translations = CockpitTranslation
> extends AbstractLocalizer<T> {
  constructor(getLocale: () => string) {
    super(getLocale, adapter)
  }
}

function registerTranslations(translations: Translations) {
  const error = validateTranslations(translations)

  if (error) {
    throw error
  }

  for (const locale of Object.keys(translations)) {
    const translation = translations[locale]

    const convertedTranslation: any = {
      $code: locale,
      $name: new Intl.DisplayNames(locale, { type: 'language' }).of(locale),
      $dir: getDirection(locale)
    }

    for (const category of Object.keys(translation)) {
      const terms = translation[category]

      for (const termKey of Object.keys(terms)) {
        convertedTranslation[`${category}${categoryTermSeparator}${termKey}`] =
          terms[termKey]
      }
    }

    registerTranslation(convertedTranslation)
  }
}
