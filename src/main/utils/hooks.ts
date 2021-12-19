import {
  hook,
  useAfterMount,
  useBeforeMount,
  useBeforeUnmount,
  useHost,
  useInternals,
  useRefresher,
  useStatus
} from 'js-element/hooks'

import { observeLocale } from '../i18n/locale-detection'
import { localize, Localizer } from 'js-localize'

// === types =========================================================

declare global {
  namespace Localize {
    interface TranslationsMap {}
  }
}

// === useI18n =======================================================

function useI18nFn<C extends keyof Localize.TranslationsMap>(
  category?: C
): {
  i18n: Localizer
  t<K extends keyof Localize.TranslationsMap[C]>(
    key: K,
    params?: Localize.TranslationsMap[C][K] extends (a: infer A) => string
      ? A
      : void
  ): string
} {
  const element = useHost()
  const refresh = useRefresher()
  const { connect, disconnect, getLocale } = observeLocale(element, refresh)
  const i18n = localize(getLocale)

  useBeforeMount(connect)
  useBeforeUnmount(disconnect)

  return {
    i18n,
    t: (i18n.translate as any).bind(null, category)
  }
}

export const useI18n = hook('useI18n', useI18nFn)

export const useFormField = hook('useFormField', function <
  T extends string // TODO: File + FormData
>(params: { getValue(): T; validate(): { message: string; anchor: HTMLElement } | null }) {
  let errorMsg: string | null = null
  let anchor: HTMLElement | null = null
  let hasFocus = false
  let hadInput = false
  let showErrors = false
  const host = useHost()
  const internals = useInternals() as any // TODO
  const refresh = useRefresher()
  const status = useStatus()

  const setFormValue = (value: T) => {
    internals.setFormValue(value)
    const result = params.validate()
    const oldErrorMsg = errorMsg
    const oldAnchor = anchor

    if (!result) {
      errorMsg = null
      anchor = null
      internals.setValidity({})
    } else {
      errorMsg = result.message
      anchor = result.anchor

      internals.setValidity(
        {
          customError: true
        },
        errorMsg,
        anchor
      )
    }

    if (errorMsg !== oldErrorMsg || anchor !== oldAnchor) {
      refresh()
    }
  }

  useAfterMount(() => {
    hadInput = false
    setFormValue(params.getValue())

    setTimeout(() => {
      host.addEventListener('invalid', (ev) => {
        const oldShowErrors = showErrors
        console.log('invalid', status.isMounted())
        showErrors = true
        ev.stopPropagation()

        if (oldShowErrors !== showErrors) {
          refresh()
        }
      })
    }, 0)
  })

  const ret = {
    signalInput() {
      hadInput = true
      showErrors = !hasFocus

      if (!showErrors || errorMsg === null) {
        return
      }

      refresh()
    },

    // TODO: File + FormData
    signalUpdate: () => {
      showErrors = true
      setFormValue(params.getValue())
    },

    signalFocus() {
      hasFocus = true
    },

    signalBlur() {
      hasFocus = false
      showErrors = hadInput
      refresh()
    },

    hasError(): boolean {
      return showErrors && errorMsg !== null
    },

    getErrorMsg(): string | null {
      return this.hasError() ? errorMsg : null
    }
  }

  return ret
})

/*
export const useFormField = hook(
  'useFormField',
  (callback: (msg: string) => void) => {
    const host = useHost()
    const refresh = useRefresher()
    const internals: any = useInternals() // TODO

    host.addEventListener('invalid', (ev) => {
      ev.preventDefault()
      callback(internals.validationMessage)
    })

    const ret = {
      setFormValue(value: any) {
        internals.setFormValue(value)
      },

      setError(msg: string) {
        if (msg) {
          internals.setValidity({ valueMissing: true }, msg) // TODO
        } else {
          internals.setValidity(null)
        }

        refresh()
      },

      getMessage() {
        return internals.validationMessage || null
      },

      clearMessage() {
        internals.setValidity({})
        refresh()
      }
    }

    return ret
  }
)
*/
