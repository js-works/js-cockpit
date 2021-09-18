// === exports =======================================================

export { detectLocale, observeLocale }

// === constants =====================================================

const LOCALE_EVENT_NAME = 'locale-subscription'

// === global data ===================================================

const localeByElem = new Map<HTMLElement, string | null>()

// === types =========================================================

interface LocaleEvent extends Event {
  type: typeof LOCALE_EVENT_NAME
  detail(notifyChange: () => void, unsubscribe: () => void): () => void
}

declare global {
  interface DocumentEventMap {
    [LOCALE_EVENT_NAME]: LocaleEvent
  }
}

// === detectLocale ==================================================

function detectLocale(elem: HTMLElement) {
  const locale = localeByElem.get(elem)
  return locale !== undefined ? locale : getLocale(elem)
}

// === observeLocale =================================================

function observeLocale(
  elem: HTMLElement,
  callback: () => void
): {
  connect(): void
  disconnect(): void
  getLocale(): string | null
} {
  let locale: string | null = null
  let notify: (() => void) | null = null
  let cleanup1: (() => void) | null = () => {}
  let cleanup2: (() => void) | null = null

  return {
    connect() {
      locale = getLocale(elem)
      localeByElem.set(elem, locale)

      document.dispatchEvent(
        new CustomEvent(LOCALE_EVENT_NAME, {
          detail(notifyChange: () => void, unsubscribe: () => void) {
            notify = notifyChange
            cleanup1 = unsubscribe

            return () => {
              locale = getLocale(elem)
              localeByElem.set(elem, locale)
              callback()
            }
          },

          bubbles: false
        })
      )

      if (!notify) {
        const callbacks = new Set<() => void>()

        callbacks.add(() => {
          locale = getLocale(elem)
          localeByElem.set(elem, locale)
          callback()
        })

        notify = () => callbacks.forEach((it) => it())

        new MutationObserver(notify).observe(document, {
          attributes: true,
          attributeFilter: ['lang'],
          subtree: true
        })

        document.addEventListener(LOCALE_EVENT_NAME, (ev: LocaleEvent) => {
          const cb = ev.detail(notify!, () => callbacks.delete(cb))
          callbacks.add(cb)
        })
      }

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

// === local functions ===============================================

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
