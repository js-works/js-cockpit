import { ReactiveControllerHost } from 'lit'
import {
  Category,
  CockpitTranslation,
  ComponentLocalizer,
  TermKey
} from '../i18n/i18n'

export { I18nController }

class I18nController extends ComponentLocalizer<CockpitTranslation> {}
