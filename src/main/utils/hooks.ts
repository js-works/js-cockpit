import {
  hook,
  useAfterMount,
  useBeforeUnmount,
  useHost,
  useRefresher
} from 'js-element/hooks'
import { I18n } from './i18n'

// === useI18n =======================================================

export const useI18n = hook(
  'useI18n',
  (namespace: string): I18n.Facade => {
    const refresh = useRefresher()
    const element = useHost()

    return I18n.localize(
      {
        element,
        onConnect: useAfterMount,
        onDisconnect: useBeforeUnmount,
        refresh
      },
      namespace
    )
  }
)
