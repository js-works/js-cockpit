// === exports =======================================================

export { detectLocale, observeLocale }

// === constants / module data =======================================

const LOCALE_OBSERVATION = 'locale-observation'
const localeByElem = new Map<HTMLElement, string | null>()

// === types =========================================================

type LocaleObservationApi = {
  subscribe(subscriber: () => void): () => void
  notify(): void
}

type LocaleObservationEvent = {
  type: typeof LOCALE_OBSERVATION
  detail(api: LocaleObservationApi): void
}

declare global {
  interface DocumentEventMap {
    [LOCALE_OBSERVATION]: LocaleObservationEvent
  }
}

// === default api ===================================================

const defaultApi = ((): LocaleObservationApi => {
  let initialized = false
  const subscribers = new Set<() => void>()
  const notify = () => subscribers.forEach((it) => it())

  return {
    subscribe(subscriber) {
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
    },
    notify
  }
})()

// === locale observation functions ==================================

const { subscribe, notify } = ((): LocaleObservationApi => {
  let api: LocaleObservationApi | null = null

  document.dispatchEvent(
    new CustomEvent(LOCALE_OBSERVATION, {
      detail: (otherApi: LocaleObservationApi) => (api = otherApi)
    })
  )

  if (!api) {
    api = defaultApi
    document.addEventListener(LOCALE_OBSERVATION, (ev) => ev.detail(defaultApi))
  }

  return api
})()

// === getLocale =====================================================

function getLocale(elem: HTMLElement): string | null {
  let el: Element = elem

  while (el && !(el instanceof Window) && !(el instanceof Document)) {
    const next = el.closest<HTMLElement>('[lang]')

    if (next) {
      return next.lang || null
    }

    el = (el.getRootNode() as ShadowRoot).host
  }

  return null
}

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

    getLocale: () => locale
  }
}
