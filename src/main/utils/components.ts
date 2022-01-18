import {
  unsafeCSS,
  ComplexAttributeConverter,
  CSSResult,
  LitElement,
  PropertyDeclaration,
  PropertyValues
} from 'lit'

import { customElement, property, state as litState } from 'lit/decorators'

// === exports =======================================================

export {
  bind,
  createEmitter,
  elem,
  prop,
  state,
  afterInit,
  afterConnect,
  afterDisconnect,
  afterUpdate,
  beforeUpdate,
  Attrs,
  Listener,
  Component
}

// === local data ====================================================

const properlyDecoratedComponentClasses = new WeakSet<Function>()

// === types =========================================================

type Listener<T> = (v: T) => void
type Cleanup = (() => void) | undefined | null | void

// === public ========================================================

abstract class Component extends LitElement {
  constructor() {
    super()

    if (!properlyDecoratedComponentClasses.has(this.constructor)) {
      throw new Error(
        `Class "${this.constructor.name}" has not been decorated by @elem`
      )
    }

    const self: any = this
    self.__isInitialized = false
    self.__afterInitActions = [] as (() => void)[]
  }

  protected abstract render(): void
}

const Attrs = {
  string: {
    toAttribute: (it: string | null) => it,
    fromAttribute: (it: string | null) => it
  },

  number: {
    toAttribute: (it: number | null) => (it === null ? null : String(it)),
    fromAttribute: (it: string | null) =>
      it === null ? null : Number.parseFloat(it)
  },

  boolean: {
    toAttribute: (it: boolean | null) => (!it ? null : ''),
    fromAttribute: (it: string | null) => (it === null ? false : true)
  }
}

function bind<T extends Function>(
  target: object,
  propertyKey: string,
  descriptor?: TypedPropertyDescriptor<T>
): any {
  if (!descriptor || typeof descriptor.value !== 'function') {
    throw new TypeError(
      `Only methods can be decorated with @bind. <${propertyKey}> is not a method!`
    )
  }

  return {
    configurable: true,

    get(this: T): T {
      const bound: T = descriptor.value!.bind(this)

      Object.defineProperty(this, propertyKey, {
        value: bound
      })

      return bound
    }
  }
}

function elem<E extends Component>(params: {
  tag: string
  styles?: string | string[] | (() => string | string[])
  uses?: any[]
}): (clazz: new () => E) => any {
  return (clazz) => {
    const newClass: any = class extends (clazz as any) {
      static get styles(): CSSResult {
        let styles =
          typeof params.styles === 'function' ? params.styles() : params.styles

        if (Array.isArray(styles)) {
          styles = styles.map((it) => it.trim()).join('\n\n/*******/\n\n')
        }

        if (!styles) {
          styles = ''
        }

        const cssResult = unsafeCSS(styles)

        Object.defineProperty(newClass, 'styles', {
          value: cssResult
        })

        return cssResult
      }

      constructor() {
        super()
      }

      protected shouldUpdate(changedProperties: PropertyValues): boolean {
        if (!this.__initialized) {
          this.__isInitialized = true
          this.__afterInitActions.forEach((it: () => void) => it())
          this.__afterInitActions.length = 0
        }

        return super.shouldUpdate(changedProperties)
      }
    }

    properlyDecoratedComponentClasses.add(newClass)
    registerElement(params.tag, newClass)

    return newClass
  }
}

function prop<T>(proto: HTMLElement, propName: string): void

function prop<T>(params?: {
  attr: {
    toAttribute(value: T): string | null
    fromAttribute(value: string | null): T
  }
  refl?: boolean
}): (proto: Component, propName: string) => void

function prop(arg1?: any, arg2?: any): any {
  if (typeof arg2 === 'string') {
    return prop()(arg1, arg2)
  }

  const params = arg1

  const {
    attr,
    refl: reflect
  }: {
    attr?: ComplexAttributeConverter
    refl?: boolean
  } = params || {}

  return (proto: Component, propName: string) => {
    const options: PropertyDeclaration = attr
      ? {
          converter: attr,
          reflect: reflect === true ? true : false,
          attribute: propNameToAttrName(propName)
        }
      : {
          attribute: false
        }

    return property(options)(proto, propName)
  }
}

function state<T>(proto: Component, propName: string): void {
  return litState()(proto, propName)
}

// === helpers =======================================================

function propNameToAttrName(propName: string) {
  return propName.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
}

// TODO!!!!
function registerElement(
  tagName: string,
  elementClass: CustomElementConstructor
): void {
  if (customElements.get(tagName)) {
    console.clear()
    console.log(`Custom element ${tagName} already defined -> reloading...`)

    setTimeout(() => {
      console.clear()
      location.reload()
    }, 1000)
  } else {
    customElements.define(tagName, elementClass)
  }
}

function afterInit(component: Component, action: () => void): void {
  const compo = component as any

  if (!compo.__isInitialized) {
    compo.__afterInitActions.push(action)
  }
}

function afterConnect(component: Component, action: () => Cleanup): void {
  let cleanup: Cleanup

  component.addController({
    hostConnected() {
      if (typeof cleanup === 'function') {
        cleanup()
      }

      cleanup = action()
    },

    hostDisconnected() {
      if (typeof cleanup === 'function') {
        cleanup()
      }

      cleanup = null
    }
  })
}

function afterDisconnect(component: Component, action: () => void): void {
  component.addController({
    hostDisconnected: action
  })
}

function beforeUpdate(component: Component, action: () => Cleanup): void {
  let cleanup: Cleanup

  component.addController({
    hostUpdate() {
      if (typeof cleanup === 'function') {
        cleanup()
      }

      cleanup = action()
    },

    hostDisconnected() {
      if (typeof cleanup === 'function') {
        cleanup()
      }

      cleanup = null
    }
  })
}

function afterUpdate(component: Component, action: () => Cleanup): void {
  let cleanup: Cleanup

  component.addController({
    hostUpdated() {
      if (typeof cleanup === 'function') {
        cleanup()
      }

      cleanup = action()
    },

    hostDisconnected() {
      if (typeof cleanup === 'function') {
        cleanup()
      }

      cleanup = null
    }
  })
}

function createEmitter(host: Component): (ev: CustomEvent<any>) => void

function createEmitter<D = void>(
  host: Component,
  type: string
): (detail: D) => void

function createEmitter<T extends string, D>(
  host: Component,
  type: T,
  getEventProp: () => Listener<CustomEvent<D> & { type: T }> | undefined
): (detail: D) => void

function createEmitter(
  host: Component,
  type?: string,
  getEventProp?: Function
) {
  if (arguments.length > 0 && typeof type !== 'string') {
    throw new Error('[useEmitter] Invalid type of first argument')
  }

  if (type === undefined) {
    return (ev: CustomEvent<any>) => host.dispatchEvent(ev)
  }

  if (getEventProp) {
    const eventListener = (ev: Event) => {
      const eventProp = getEventProp()

      eventProp && eventProp(ev)
    }

    afterConnect(host, () => {
      host.addEventListener(type, eventListener)

      return () => host.removeEventListener(type, eventListener)
    })
  }

  return <D>(detail: D, options?: CustomEventInit<D>) => {
    const ev = new CustomEvent<D>(type, {
      bubbles: true,
      composed: true,
      cancelable: true,
      ...options,
      detail
    })

    host.dispatchEvent(ev)
  }
}
