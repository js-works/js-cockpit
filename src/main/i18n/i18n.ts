import {
  Adapter,
  Category,
  ComponentLocalizer,
  Locale,
  Localizer,
  PartialTranslation,
  PartialTranslations,
  Translation,
  Translations,
  TermKey,
  TermValue
} from './localize/localize'

import { getDirection } from './localize/localize-utils'

import {
  registerTranslation,
  LocalizeController
} from '@shoelace-style/localize'

import { CockpitTranslation } from './terms'

// always bundle the English translations
import './translations/en'
import { ReactiveControllerHost } from 'lit'

// === exports =======================================================

export {
  addToDict,
  localizeAdapter,
  CockpitTranslation,
  CockpitTranslations,
  ComponentLocalizer,
  Localizer,
  PartialCockpitTranslations,
  PartialTranslation,
  PartialTranslations,
  Translation
}

// === constants =====================================================

const regexCategory = /^[a-z][a-zA-Z0-9\.]*$/
const regexTermKey = /^[a-z][a-zA-Z0-9]*$/
const categoryTermSeparator = '/'

// === exported values ===============================================

const localizeAdapter = createLocalizeAdapter()

// === exported types ================================================

type CockpitTranslations = Translations<CockpitTranslation>

type PartialCockpitTranslations = PartialTranslations<CockpitTranslation>

// === exported functions ============================================

function addToDict(translationsByLocale: Record<Locale, any>) {
  for (const locale of Object.keys(translationsByLocale)) {
    const translations: any = translationsByLocale[locale]

    const convertedTranslations: any = {
      $code: locale,
      $name: new Intl.DisplayNames(locale, { type: 'language' }).of(locale),
      $dir: getDirection(locale)
    }

    for (const category of Object.keys(translations)) {
      if (!category.match(regexCategory)) {
        throw Error(`Illegal translations category name "${category}"`)
      }

      for (const termKey of Object.keys(translations[category])) {
        if (!termKey.match(regexTermKey)) {
          throw Error(`Illegal translation key "${termKey}"`)
        }

        convertedTranslations[`${category}${categoryTermSeparator}${termKey}`] =
          translations[category][termKey]
      }
    }

    registerTranslation(convertedTranslations)
  }
}

// === local functions ===============================================

function createLocalizeAdapter(): Adapter {
  const fakeElem: HTMLElement & ReactiveControllerHost = Object.assign(
    document.createElement('div'),
    {
      addController() {},
      removeController() {},
      requestUpdate() {},
      updateComplete: Promise.resolve(true)
    }
  )

  const localizeController = new LocalizeController(fakeElem)

  return {
    translate(locale, category, termKey, params, i18n) {
      const key = `${category}${categoryTermSeparator}${termKey}`
      fakeElem.lang = locale

      return localizeController.term(key, params, i18n)
    },

    observeComponent(element) {
      const ctrl = new LocalizeController(element)

      return {
        getLocale: () => ctrl.lang(),
        getDirection: () => (ctrl.dir() === 'rtl' ? 'rtl' : 'ltr')
      }
    }
  }
}
