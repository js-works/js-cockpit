import { ReactiveControllerHost } from 'lit'
import { CockpitTranslation, Localizer, Translation } from '../i18n/i18n'
import { LocalizeController } from '@shoelace-style/localize'

// === exports =======================================================

export { I18nController }

// === I18nController ================================================

class I18nController<T extends Translation = CockpitTranslation> extends Localizer<T> { 
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


