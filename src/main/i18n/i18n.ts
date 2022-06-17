import {
  Adapter,
  Category,
  ComponentLocalizer,
  Locale,
  Localizer,
  Translation,
  TermKey
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
  Translation
}

// === constants =====================================================

const regexCategory = /^[a-z][a-zA-Z0-9\.]*$/
const regexTermKey = /^[a-z][a-zA-Z0-9]*$/
const categoryTermSeparator = '/'

// === exported values ===============================================

const localizeAdapter = createLocalizeAdapter()

// === exported types ================================================

type CockpitTranslations = Record<Locale, CockpitTranslation>

type PartialCockpitTranslations = Partial<
  { [K in keyof CockpitTranslations]: Partial<CockpitTranslations[K]> }
>

// === exported functions ============================================

function addToDict<T extends Translation>(
  translationsByLocale: Record<Locale, T>
) {
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
  const elem: HTMLElement & ReactiveControllerHost = Object.assign(
    document.createElement('div'),
    {
      addController() {},
      removeController() {},
      requestUpdate() {},
      updateComplete: Promise.resolve(true)
    }
  )

  const localizeController = new LocalizeController(elem)

  return {
    translate(locale, category, termKey, params, i18n) {
      const key = `${category}${categoryTermSeparator}${termKey}`
      elem.lang = locale

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
