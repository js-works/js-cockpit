import { ReactiveControllerHost } from 'lit'
import { I18nFacade } from '../i18n/i18n'
import { LocalizeController } from '@shoelace-style/localize'

// === exports =======================================================

export { I18nController }

// === I18nController ================================================

class I18nController extends I18nFacade { 
  #localizeController: LocalizeController

  constructor(element: HTMLElement & ReactiveControllerHost) {
    super(() => this.#localizeController.lang())
    this.#localizeController = new LocalizeController(element)
  }

  override getDirection() {
    const ret = this.#localizeController.dir()

    return ret === 'rtl' ? 'rtl' : 'ltr'
  }
}


