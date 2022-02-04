// === exports =======================================================

export { detectLocale, observeLocale }

function detectLocale(elem: HTMLElement): string | null {
  let locale = elem.getAttribute('lang')

  if (locale === '') {
    return null
  } else if (locale) {
    return locale
  }

  const docElem = document.documentElement
  locale = docElem.getAttribute('lang')

  if (locale === '') {
    return null
  }

  return locale ? locale : null
}

// === observeLocale =================================================

function observeLocale(
  elem: HTMLElement,
  callback: (locale: string | null) => void
) {
  let locale: string | null = detectLocale(elem)
  let cleanup: (() => void) | null = null

  const notify = () => {
    const newLocale = detectLocale(elem)
    console.log('new locale:', newLocale)
    if (newLocale !== locale) {
      locale = newLocale
      callback(locale)
    }
  }

  return {
    connect() {
      const observer1 = new MutationObserver(notify)
      const observer2 = new MutationObserver(notify)
      const observerConfig = { attributes: true, attributeFilter: ['lang'] }

      observer1.observe(document.documentElement, observerConfig)
      observer2.observe(elem, observerConfig)

      cleanup = () => {
        observer1.disconnect()
        observer2.disconnect()
      }
    },

    disconnect() {
      cleanup && cleanup()
      cleanup = null
    },

    getLocale: () => locale
  }
}
