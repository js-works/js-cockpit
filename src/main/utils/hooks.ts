import {
  hook,
  useBeforeMount,
  useBeforeUnmount,
  useHost,
  useInternals,
  useRefresher
} from 'js-element/hooks'

import { observeLocale } from '../misc/locales'
import { I18n } from '../misc/i18n'

// === useI18n =======================================================

function useI18nFn(): {
  i18n: I18n.Localizer
  g(key: string, replacements?: any): string
}

function useI18nFn(
  namespace: string
): {
  i18n: I18n.Localizer
  t(key: string, replacements?: any): string
  g(key: string, replacements?: any): string
}

function useI18nFn(namespace?: string) {
  const element = useHost()
  const refresh = useRefresher()

  const { connect, disconnect, getLocale } = observeLocale(element, refresh)
  const localizer = I18n.localizer(getLocale)

  useBeforeMount(connect)
  useBeforeUnmount(disconnect)

  let ret: any = {
    i18n: localizer,

    g(key: string, replacements?: any) {
      const repl =
        arguments.length > 1
          ? Array.isArray(replacements)
            ? replacements
            : [replacements]
          : null

      return localizer.translate(key as string, repl)
    }
  }

  if (arguments.length > 0) {
    ret.t = function (key: string, replacements?: any) {
      return localizer.translate(`${namespace}.${key}`, replacements)
    }
  }

  return ret
}

export const useI18n = hook('useI18n', useI18nFn)

export const useFormField = hook('useFormField', function <
  T extends string // TODO: File + FormData
>(initialValue: T) {
  setInterval(() => {
    console.log('...')
    refresh()
  }, 1000)

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
        internals.setValidity({ valueMissing: true }, error, anchor)
      } else {
        console.log('set valid')
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
