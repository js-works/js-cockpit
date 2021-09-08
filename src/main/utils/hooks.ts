import {
  hook,
  useAfterMount,
  useBeforeUnmount,
  useHost,
  useRefresher
} from 'js-element/hooks'
import { I18n } from '../misc/i18n'

// === useI18n =======================================================

export const useI18n = hook('useI18n', (namespace: string) => {
  const refresh = useRefresher()
  const element = useHost()

  const localizer = I18n.localize(
    {
      element,
      onConnect: useAfterMount,
      onDisconnect: useBeforeUnmount,
      refresh
    },
    namespace
  )

  const t = localizer.bind(null)

  return {
    i18n: {
      ...localizer,
      getText: t
    },
    t
  }
})
