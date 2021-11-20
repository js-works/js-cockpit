import { getLocaleInfo } from './i18n-utils'

export { Dictionary }

type Translations = {
  [key: string]: string | ((...args: any[]) => string) | Translations
}

class Dictionary {
  #translations = new Map<
    string,
    Map<string, string | ((params: Record<string, any>) => string)>
  >()

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

  addTranslation(
    locale: string,
    key: string,
    translation: string | ((...args: any[]) => string)
  ): void {
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
