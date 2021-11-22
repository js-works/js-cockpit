import { getLocaleInfo } from './i18n-utils'

// === exports =======================================================

export { Dictionary }

// === constants =====================================================

const SEP = '|@:_:_:_:@|' // TODO

// === Dictionary ====================================================

class Dictionary {
  // --- private -----------------------------------------------------

  #translations = new Map<string, string | Function>()

  // --- public ------------------------------------------------------

  addTranslation(
    locale: string,
    category: string,
    key: string,
    translation: string | ((params: Record<string, any>) => string)
  ): void {
    this.#translations.set(
      `${locale}${SEP}${category}${SEP}${key}`,
      translation
    )
  }

  translate(
    locale: string,
    category: string,
    key: string,
    params?: Record<string, any>
  ): string | null {
    const { baseName, language } = getLocaleInfo(locale)

    let ret =
      this.#translations.get(`${locale}${SEP}${category}${SEP}${key}`) || null

    if (ret === null && locale) {
      if (baseName !== locale) {
        ret =
          this.#translations.get(`${baseName}${SEP}${category}${SEP}${key}`) ||
          null
      }

      if (ret === null) {
        if (language !== baseName) {
          ret =
            this.#translations.get(
              `${language}${SEP}${category}${SEP}${key}`
            ) || null
        }
      }
    }

    if (ret !== null && params) {
      if (typeof ret !== 'function') {
        console.log(ret) // TODO

        throw new Error(
          `Invalid translation parameters for category ${category} key "${key}" in locale "${locale}"`
        )
      }

      ret = String(ret(params))
    }

    console.log('--->', locale, category, key, ':::', ret)
    return ret === null ? ret : String(ret)
  }
}
