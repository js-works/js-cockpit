import {
  hook,
  useAfterMount,
  useBeforeMount,
  useBeforeUnmount,
  useOnFormAssociated,
  useHost,
  useInternals,
  useRefresher
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
  let suppressErrors = false
  let showErrors = false
  const host = useHost()
  const internals = useInternals() as any // TODO
  const refresh = useRefresher()

  const setFormValue = (value: T, silently = false) => {
    internals.setFormValue(value)
    const result = params.validate()

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

    if (!silently) {
      refresh()
    }
  }

  useAfterMount(() => {
    setFormValue(params.getValue(), true)
  })

  host.addEventListener('invalid', (ev) => {
    showErrors = true
    ev.stopPropagation()
    console.log('invalid!!!')
    const h = host as any
    console.log(h.label)
    console.log('refreshing', host.localName, h.label)
    refresh()
    //alert('refreshing')
  })

  return {
    // TODO: File + FormData
    signalUpdate: () => {
      showErrors = true
      setFormValue(params.getValue())
    },

    hasError(): boolean {
      return showErrors && !suppressErrors && errorMsg !== null
    },

    getErrorMsg(): string | null {
      return this.hasError() ? errorMsg : null
    },

    signalInput() {
      if (!showErrors || errorMsg === null) {
        return
      }

      if (hasFocus) {
        suppressErrors = true
      }

      refresh()
    },

    signalFocus() {
      hasFocus = true
    },

    signalBlur() {
      hasFocus = false
      refresh()
    }
  }
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
