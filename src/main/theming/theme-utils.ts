import { Theme } from './theme'
import { lightTheme } from './light-theme'

// === exports =======================================================

export { invertTheme, convertToCss }

// === constants =====================================================

const INVERTABLE_COLORS = getColorNames(lightTheme)

// === theme utils ===================================================

function invertTheme(theme: Theme): Theme {
  const ret: Record<string, string> = Object.assign({}, theme)
  const tokens: Record<string, string> = theme

  ret['theme-mode'] = tokens['theme-mode'] === '0' ? '1' : '0'
  ret['color-neutral-0'] = tokens['color-neutral-1000']
  ret['color-neutral-1000'] = tokens['color-neutral-0']

  INVERTABLE_COLORS.forEach((color) => {
    for (let i = 0; i < 5; ++i) {
      const key1 = `color-${color}-${i === 0 ? 50 : i * 100}`
      const key2 = `color-${color}-${i === 0 ? 950 : 1000 - i * 100}`

      ret[key1] = tokens[key2]
      ret[key2] = tokens[key1]
    }
  })

  return Object.freeze(ret) as Theme
}

function convertToCss(theme: Theme) {
  const lines: string[] = [':host {']

  Object.entries(theme).forEach(([key, value]) => {
    lines.push(`--sl-${key}: ${value};`)
  })

  lines.push('}\n')

  return lines.join('\n')
}

// == local helpers ==================================================

function getColorNames(theme: Theme): Set<string> {
  return new Set(
    Object.keys(theme)
      .filter((it) => it.startsWith('color-'))
      .map((it) => it.replace(/^color-|-[^-]*$/g, ''))
  )
}
