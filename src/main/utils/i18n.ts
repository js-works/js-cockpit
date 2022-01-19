import { localize, Category, Localizer } from 'js-localize'
import { Component } from './components'
import { observeLocale } from './locale-detection'

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
  const { connect, disconnect, getLocale } = observeLocale(component, () =>
    component.requestUpdate()
  )

  component.addController({
    hostConnected: connect,
    hostDisconnected: disconnect
  })

  const localizer = localize(getLocale())

  if (!category) {
    return localizer
  }

  Object.assign(localizer, {
    tr: (key: string, params?: any) =>
      localizer.translate(category as any, key, params)
  })

  return localizer
}
