import { getLocaleInfo } from './i18n-utils'

// === exports =======================================================

export { Dictionary, Translation, Translations }

// === types =========================================================

type Translation = string | ((params: Record<string, any>) => string)
type Translations = Record<string, Translation>

// === Dictionary ====================================================

class Dictionary {
  // --- private -----------------------------------------------------

  #translations = new Map<string, Map<string, Translation>>()

  #addTranslationsWithNamespace = (
    locale: string,
    namespace: string,
    translations: Translations
  ) => {
    Object.entries(translations).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'function') {
        const newKey = namespace === '' ? key : `${namespace}.${key}`

        this.addTranslation(locale, newKey, value)
      } else {
        const newNamespace = namespace === '' ? key : `${namespace}.${key}`

        this.#addTranslationsWithNamespace(locale, newNamespace, value)
      }
    })
  }

  // --- public ------------------------------------------------------

  addTranslation(locale: string, key: string, translation: Translation): void {
    let map = this.#translations.get(locale)

    if (!map) {
      map = new Map()
      this.#translations.set(locale, map)
    }

    map.set(key, translation)
  }

  addTranslations(locale: string, translations: Translations) {
    this.#addTranslationsWithNamespace(locale, '', translations)
  }

  translate(
    locale: string,
    key: string,
    params?: Record<string, any>
  ): string | null {
    const { baseName, language } = getLocaleInfo(locale)
    let ret = this.#translations.get(locale)?.get(key) || null

    if (ret === null && locale) {
      if (baseName !== locale) {
        ret = this.#translations.get(baseName)?.get(key) || null
      }

      if (ret === null) {
        if (language !== baseName) {
          ret = this.#translations.get(language)?.get(key) || null
        }
      }
    }

    if (ret !== null && params) {
      if (typeof ret !== 'function') {
        console.log(ret) // TODO

        throw new Error(
          `Invalid translation parameters for key "${key}" in locale "${locale}"`
        )
      }

      ret = ret(params)
    }

    return ret as string
  }
}
