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

export const useValidation = hook(
  'useValidation',
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
