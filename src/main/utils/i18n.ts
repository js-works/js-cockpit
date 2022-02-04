import { localize, Category, Localizer } from 'js-localize'
import { Component } from './components'

// === exports =======================================================

export { createLocalizer }

// === types =========================================================

declare global {
  namespace Localize {
    interface TranslationsMap {}
  }
}

declare type FirstArg<T> = T extends (arg: infer A) => any ? A : never

// === functions =====================================================

function createLocalizer(component: Component): Localizer

function createLocalizer<C extends keyof Localize.TranslationsMap>(
  component: Component,
  category: C
): {
  tr<K extends keyof Localize.TranslationsMap[C] & string>(
    key: K,
    params?: FirstArg<Localize.TranslationsMap[C][K]>
  ): string | null
} & Localizer

function createLocalizer(component: Component, category?: Category): any {
  const localizer = localize({
    element: component,

    onChange() {
      component.requestUpdate()
    },

    init(getLocale, connect, disconnect) {
      component.addController({
        hostConnected: connect,
        hostDisconnected: disconnect
      })
    }
  })

  Object.assign(localizer, {
    tr: (key: string, params?: any) =>
      localizer.translate(category as any, key, params)
  })

  return localizer
}
