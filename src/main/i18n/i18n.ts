import {
  validateTranslations,
  AbstractLocalizer,
  Adapter,
  Locale,
  Localizer,
  PartialTranslationsOf,
  Translation
} from './localize/localize'

import { getDirection } from './localize/localize-utils'
import { CockpitTranslation } from './terms'

import {
  registerTranslation,
  LocalizeController
} from '@shoelace-style/localize'

import { ReactiveControllerHost } from 'lit'

// === exports =======================================================

export {
  registerTranslations,
  CockpitTranslations,
  I18nFacade,
  Localizer,
  PartialCockpitTranslations
}

// === constants =====================================================

const categoryTermSeparator = '/'

// === exported types ================================================

type CockpitTranslations = Record<Locale, CockpitTranslation>
type PartialCockpitTranslations = PartialTranslationsOf<CockpitTranslation>

// === adaption ======================================================

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
  T extends Translation = Localize.Translations
> extends AbstractLocalizer<T> {
  constructor(getLocale: () => string) {
    super(getLocale, adapter)
  }
}

function registerTranslations(
  ...translationsList: PartialTranslationsOf<Localize.Translations>[]
) {
  for (const translations of translationsList) {
    const error = validateTranslations(translations)

    if (error) {
      throw error
    }

    for (const locale of Object.keys(translations)) {
      const translation = translations[locale] as Translation

      const convertedTranslation: any = {
        $code: locale,
        $name: new Intl.DisplayNames(locale, { type: 'language' }).of(locale),
        $dir: getDirection(locale)
      }

      for (const category of Object.keys(translation)) {
        const terms = translation[category]

        for (const termKey of Object.keys(terms)) {
          convertedTranslation[
            `${category}${categoryTermSeparator}${termKey}`
          ] = terms[termKey]
        }
      }

      registerTranslation(convertedTranslation)
    }
  }
}
