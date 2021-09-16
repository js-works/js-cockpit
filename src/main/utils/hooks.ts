import {
  hook,
  useAfterMount,
  useBeforeUnmount,
  useHost,
  useRefresher
} from 'js-element/hooks'

import { observeLocale } from '../misc/locales'
import { I18n } from '../misc/i18n'

// === useI18n =======================================================

function useI18nFn<T extends Record<string, string>>(): {
  i18n: I18n.Facade
  g(key: string, replacements?: any): string
}

function useI18nFn<T extends Record<string, string>>(
  namespace: string,
  defaultTexts: T
): {
  i18n: I18n.Facade
  t(key: keyof T, replacements?: any): string
  g(key: string, replacements?: any): string
}

function useI18nFn(namespace?: string, defaultTexts?: Record<string, string>) {
  const refresh = useRefresher()
  const element = useHost()

  const { connect, disconnect, getLocale } = observeLocale(element, refresh)
  const facade = I18n.getFacade(getLocale)

  useAfterMount(connect)
  useBeforeUnmount(disconnect)

  let ret: any = {
    i18n: facade,

    g(key: string, replacements?: any) {
      const repl =
        arguments.length > 1
          ? Array.isArray(replacements)
            ? replacements
            : [replacements]
          : null

      return facade.getText(key as string, null, repl)
    }
  }

  if (arguments.length > 0) {
    ret.t = function (key: string, replacements?: any) {
      const repl =
        arguments.length > 1
          ? Array.isArray(replacements)
            ? replacements
            : [replacements]
          : null

      return facade.getText(
        `${namespace}.${element.localName}.${key}`,
        defaultTexts![key],
        repl
      )
    }
  }

  return ret
}

export const useI18n = hook('useI18n', useI18nFn)
