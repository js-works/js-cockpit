import {
  hook,
  useBeforeMount,
  useBeforeUnmount,
  useHost,
  useInternals,
  useRefresher
} from 'js-element/hooks'

import { observeLocale } from '../i18n/locale-detection'
import { I18n } from '../i18n/i18n'

// === types =========================================================

declare global {
  namespace I18n {
    interface TranslationsMap {}
  }
}

// === useI18n =======================================================

function useI18nFn<C extends keyof I18n.TranslationsMap>(
  category: C
): {
  i18n: I18n.Localizer
  t(key: keyof I18n.TranslationsMap[C], params?: Record<string, any>): string
} {
  const element = useHost()
  const refresh = useRefresher()

  const { connect, disconnect, getLocale } = observeLocale(element, refresh)
  const localizer = I18n.localize(getLocale)

  useBeforeMount(connect)
  useBeforeUnmount(disconnect)

  let ret: any = {
    i18n: localizer,
    t: localizer.translate.bind(null, category)
  }

  return ret
}

export const useI18n = hook('useI18n', useI18nFn)

export const useFormField = hook('useFormField', function <
  T extends string // TODO: File + FormData
>(initialValue: T) {
  /* 
  setInterval(() => {
    console.log('...')
    refresh()
  }, 1000)
  */

  let value = initialValue
  let error = ''
  let showError = false
  const host = useHost()
  const internals = useInternals()
  const refresh = useRefresher()

  host.addEventListener('invalid', (ev) => {
    ev.stopPropagation()
    console.log('invalid!!!')
    error = 'Please fill out this field properly'
    showError = true
    refresh()
  })

  return {
    // TODO: File + FormData
    setValue(newValue: T) {
      value = newValue
      // @ts-ignore // TODO!!!!!!!!!!!!
      internals.setFormValue(value)
      console.log('setValue', value)
    },

    getValue() {
      return value
    },

    setError(newError: string, anchor: Element) {
      const needsRefresh = showError && error !== newError
      error = newError

      if (error) {
        console.log('set error', error)
        // @ts-ignore // TODO!!!!!!!!!!!!
        internals.setValidity({ valueMissing: true }, error, anchor)
      } else {
        console.log('set valid')
        // @ts-ignore // TODO!!!!!!!!!!!!
        internals.setValidity({ valid: true })
      }

      refresh()
      needsRefresh && refresh()
      console.log('setError', newError)
    },

    getError() {
      return error + showError
    },
    getShownError(): string {
      const ret = showError && error ? error : ''
      //return `[${error}|${showError}] ${new Date().toLocaleTimeString()}`
      console.log('shownERror', showError, error, ' -> ', ret)

      return ret
    },

    hideError() {
      if (!showError) {
        return
      }

      showError = false
      error && refresh()
    },

    signalInput() {
      console.log('input signaled')
      this.hideError()
    },

    debug() {
      console.error(111, error, showError)
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
