import {
  Dictionary,
  FullTranslations,
  Localizer,
  LocalizeAdapter,
  PartialTranslations,
  Translation
} from './localize/localize'

import { getDirection } from './localize/localize-utils'

import {
  registerTranslation,
  LocalizeController
} from '@shoelace-style/localize'

import { ReactiveControllerHost } from 'lit'

// === exports =======================================================

export {
  registerTranslations,
  FullTranslations,
  I18nFacade,
  Localizer,
  PartialTranslations
}

// === constants =====================================================

const categoryTermSeparator = '/'

// === adaption ======================================================

const adapter: LocalizeAdapter = (() => {
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
    registerTranslations: (translations) => {
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
    },

    translate(locale, category, termKey, params, i18n) {
      const key = `${category}${categoryTermSeparator}${termKey}` // TODO!!!
      fakeElem.lang = locale

      return fakeLocalizeController.term(key, params, i18n)
    }
  }
})()

class I18nFacade extends Localizer {
  constructor(getLocale: () => string) {
    super(getLocale, adapter)
  }
}

const dictionary = new Dictionary(adapter)
const registerTranslations = dictionary.registerTranslations.bind(dictionary)
