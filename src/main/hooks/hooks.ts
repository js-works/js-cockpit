import { hook } from 'js-element/hooks'
import { Localizer } from '../utils/i18n'

// TODOOOOOOOOOOOOOOOOOOOOOOOOOOO - the whole stuff!!!!

export const useLocalizer = hook('useLocalizer', () => {
  return new DefaultLocalizer()
})

class DefaultLocalizer implements Localizer {
  translate(
    name: string,
    replacements: Record<string, any> | null,
    defaultText?: string
  ): string {
    let ret = typeof defaultText === 'string' ? defaultText : ''

    if (ret && replacements) {
      for (const [k, v] of Object.entries(replacements)) {
        ret = ret.replace('%{' + k + '}', v)
      }
    }

    return ret
  }

  formatNumber(value: number): string {
    return typeof value === 'number'
      ? value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      : ''
  }

  formatDate(value: Date): string {
    throw new Error('[formatDate] Not implemented')
  }
}
