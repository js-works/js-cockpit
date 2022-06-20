import {
  adaptLocalization,
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

const { registerTranslations, localizerClass } = adaptLocalization({
  addTranslations(translations) {
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
          convertedTranslation[
            `${category}${categoryTermSeparator}${termKey}`
          ] = terms[termKey]
        }
      }

      registerTranslation(convertedTranslation)
    }
  },

  translate(locale, category, termKey, params, i18n) {
    const key = `${category}${categoryTermSeparator}${termKey}`
    fakeElem.lang = locale

    return fakeLocalizeController.term(key, params, i18n)
  }
})

class I18nFacade<
  T extends Translation = CockpitTranslation
> extends localizerClass<T> {}
