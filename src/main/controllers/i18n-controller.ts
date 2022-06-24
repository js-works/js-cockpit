import { ReactiveController, ReactiveControllerHost } from 'lit'
import { I18nFacade } from '../i18n/i18n'
import { LocalizeController } from '@shoelace-style/localize'

// === exports =======================================================

export { I18nController }

// === I18nController ================================================

class I18nController extends I18nFacade {
  #localizeController: LocalizeController

  constructor(element: HTMLElement & ReactiveControllerHost)

  constructor(params: { element: HTMLElement })

  constructor(params: {
    element: HTMLElement
    onConnect: (action: () => void) => void
    onDisconnect: (action: () => void) => void
    update: () => void
  })

  constructor(arg: any) {
    super(() => this.#localizeController.lang())

    if ('addController' in arg) {
      this.#localizeController = new LocalizeController(arg)
    } else {
      const host: ReactiveControllerHost = {
        addController(controller: ReactiveController) {
          if (arg.onConnect && controller.hostConnected) {
            arg.onConnect(() => controller.hostConnected!())
          }

          if (arg.onDisconnect && controller.hostDisconnected) {
            arg.onDisconnect(() => controller.hostDisconnected!())
          }
        },

        removeController: () => {},
        requestUpdate: () => arg?.update(),
        updateComplete: Promise.resolve(true) // TODO!!!
      }

      const proxy = new Proxy(arg.element as HTMLElement, {
        get(target, prop, receiver) {
          if (Object.hasOwn(host, prop)) {
            return (host as any)[prop]
          }

          if (prop === 'lang' || prop === 'dir') {
            return arg.element[prop]
          }

          return Reflect.get(target, prop, receiver)
        }
      }) as HTMLElement & ReactiveControllerHost

      this.#localizeController = new LocalizeController(proxy)
    }
  }

  /* override */ getDirection() {
    const ret = this.#localizeController.dir()

    return ret === 'rtl' ? 'rtl' : 'ltr'
  }
}
