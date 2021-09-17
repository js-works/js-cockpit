// === exports =======================================================

export { detectLocale, observeLocale }

// === constants =====================================================

const LOCALE_EVENT_NAME = 'locale-subscription'

// === types =========================================================

interface LocaleEvent extends Event {
  type: typeof LOCALE_EVENT_NAME
  detail(notifyChange: () => void, unsubscribe: () => void): () => void
}

// === detectLocale ==================================================

function detectLocale(elem: HTMLElement): string | null {
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

// === observeLocale =================================================

let version: number | null = null

function observeLocale(
  elem: HTMLElement,
  callback: () => void
): {
  connect(): void
  disconnect(): void
  getLocale(): string | null
} {
  let notify: (() => void) | null = null
  let locale: string | null = null
  let ownVersion = -1
  let cleanup1: (() => void) | null = () => {}
  let cleanup2: (() => void) | null = null

  const ret = {
    connect() {
      document.dispatchEvent(
        new CustomEvent(LOCALE_EVENT_NAME, {
          detail: (notifyChange: () => void, unsubscribe: () => void) => {
            notify = notifyChange

            if (version === null) {
              let cb: (() => void) | null = callback
              cleanup1 = () => (cb = null)
              version = 0

              return () => {
                ++version!
                cb && cb()
              }
            }

            cleanup1 = unsubscribe
            return callback
          }
        })
      )

      if (!notify) {
        const callbacks = new Set<() => void>([callback])

        notify = () => {
          ++version!
          callbacks.forEach((it) => it())
        }

        new MutationObserver(notify).observe(document, {
          attributes: true,
          attributeFilter: ['lang'],
          subtree: true
        })

        document.addEventListener(
          LOCALE_EVENT_NAME as any,
          (ev: LocaleEvent) => {
            const callback: () => void = ev.detail(notify!, () =>
              callbacks.delete(callback)
            )

            callbacks.add(callback)
          }
        )
      }

      const observer = new MutationObserver(notify)

      observer.observe(elem, {
        attributes: true,
        attributeFilter: ['lang']
      })

      cleanup2 = () => observer.disconnect()
    },

    disconnect() {
      cleanup1 && cleanup1()
      cleanup2 && cleanup2()
      cleanup1 = null
      cleanup2 = null
    },

    getLocale(): string | null {
      if (version === null) {
        ret.connect()
        ret.disconnect()
      }

      if (ownVersion !== version) {
        locale = detectLocale(elem)
        ownVersion = version!
      }

      return locale
    }
  }

  return ret
}
