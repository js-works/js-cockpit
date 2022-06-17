import { ReactiveControllerHost } from 'lit'

import {
  localizeAdapter,
  CockpitTranslation,
  ComponentLocalizer,
  Translation
} from '../i18n/i18n'

export { I18nController }

class I18nController<
  T extends Translation = CockpitTranslation
> extends ComponentLocalizer<T> {
  constructor(element: HTMLElement & ReactiveControllerHost) {
    super(element, localizeAdapter)
  }
}
