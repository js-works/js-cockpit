import {
  Adapter,
  Category,
  ComponentLocalizer,
  Locale,
  Localizer,
  Translation,
  TermKey
} from './localize/localize'

import {
  registerTranslation,
  Translation as LocalizeTranslation,
  LocalizeController
} from '@shoelace-style/localize'

import { CockpitTranslation } from './terms'

export {
  addToDict,
  Category,
  CockpitTranslation,
  CockpitTranslations,
  ComponentLocalizer,
  Locale,
  Localizer,
  LocalizeAdapter,
  PartialCockpitTranslations,
  TermKey,
  Translation
}

import './translations/en'

const regexCategory = /^[a-z][a-zA-Z0-9\.]*$/
const regexTermKey = /^[a-z][a-zA-Z0-9]*$/
const categoryTermSeparator = '/'

type CockpitTranslations = Record<Locale, CockpitTranslation>

type PartialCockpitTranslations = Partial<
  { [K in keyof CockpitTranslations]: Partial<CockpitTranslations[K]> }
>

function addToDict<T extends Translation>(
  translationsByLocale: Record<Locale, T>
) {
  for (const [locale, translations] of <any>(
    Object.entries(translationsByLocale)
  )) {
    const convertedTranslations: LocalizeTranslation = {
      $code: locale,
      $name: '???', // TODO
      $dir: 'ltr' // TODO
    }

    for (const category of Object.keys(translations)) {
      if (!category.match(regexCategory)) {
        throw Error(`Illegal translations category name "${category}"`)
      }

      for (const termKey of Object.keys(translations[category])) {
        if (!termKey.match(regexTermKey)) {
          throw Error(`Illegal translation key "${termKey}"`)
        }

        const key = `${category}${categoryTermSeparator}${termKey}`

        ;(convertedTranslations as any)[key] = translations[category][termKey]
      }
    }

    registerTranslation(convertedTranslations)
  }
}

const translate: (
  locale: Locale,
  category: Category,
  termKey: TermKey,
  params?: Record<string, any>,
  i18n?: Localizer<any>
) => string = (() => {
  const element = Object.assign(document.createElement('div'), {
    addController() {},
    removeController() {},
    requestUpdate() {},
    updateComplete: Promise.resolve(true)
  })

  const localizeController = new LocalizeController(element)

  return (locale, category, termKey, params, i18n) => {
    const key = `${category}/${termKey}`
    element.lang = locale

    return localizeController.term(key, params, i18n)
  }
})()

const LocalizeAdapter: Adapter = {
  translate,

  observeComponent(element) {
    const ctrl = new LocalizeController(element)

    return {
      getLocale: () => ctrl.lang(),
      getDirection: () => (ctrl.dir() === 'rtl' ? 'rtl' : 'ltr')
    }
  }
}

const origTermFunc = LocalizeController.prototype.term

LocalizeController.prototype.term = function () {
  // TODO!!!!!!
  return origTermFunc.apply(this, arguments as any)
}
