// === exports =======================================================

export { detectLocale, observeLocale }

// === module data ===================================================

const localeByElem = new Map<HTMLElement, string | null>()
const subscribers = new Set<() => void>()
let initialized = false

// === detectLocale ==================================================

function detectLocale(elem: HTMLElement) {
  const locale = localeByElem.get(elem)
  return locale !== undefined ? locale : getLocale(elem)
}

// === observeLocale =================================================

function observeLocale(elem: HTMLElement, callback: () => void) {
  let locale: string | null = null
  let cleanup1: (() => void) | null = null
  let cleanup2: (() => void) | null = null

  return {
    connect() {
      locale = getLocale(elem)

      cleanup1 = subscribe(() => {
        locale = getLocale(elem)
        localeByElem.set(elem, locale)
        callback()
      })

      if (elem.getRootNode() instanceof ShadowRoot) {
        const observer = new MutationObserver(notify)

        observer.observe(elem, {
          attributes: true,
          attributeFilter: ['lang']
        })

        cleanup2 = () => observer.disconnect()
      }
    },

    disconnect() {
      localeByElem.delete(elem)
      cleanup1 && cleanup1()
      cleanup2 && cleanup2()
      cleanup1 = cleanup2 = null
    },

    getLocale: () => {
      return locale
    }
  }
}

// === local functions ===============================================

function notify() {
  subscribers.forEach((it) => it())
}

function subscribe(subscriber: () => void) {
  if (!initialized) {
    new MutationObserver(notify).observe(document, {
      attributes: true,
      attributeFilter: ['lang'],
      subtree: true
    })
  }

  const sub = () => subscriber()
  subscribers.add(sub)
  initialized = true
  return () => subscribers.delete(sub)
}

function getLocale(elem: HTMLElement): string | null {
  let el: Element = elem

  while (el && !(el instanceof Window) && !(el instanceof Document)) {
    const foundElem = el.closest<HTMLElement>('[lang]')

    if (foundElem) {
      return foundElem.lang || null
    }

    el = (el.getRootNode() as ShadowRoot).host
  }

  return null
}
