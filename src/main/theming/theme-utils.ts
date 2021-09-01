import { Theme } from './theme'
import { lightTheme } from './light-theme'

// === exports =======================================================

export { createTheme, convertToCss, invertTheme }

// === constants =====================================================

const INVERTABLE_COLORS = getColorNames(lightTheme)

// === theme utils ===================================================

function createTheme(params: {
  dark?: boolean
  reduceBorderRadius?: boolean
  primaryColor?: string
  successColor?: string
  infoColor?: string
  warningColor?: string
  dangerColor?: string
}): Theme {
  const source = !params.dark ? lightTheme : invertTheme(lightTheme)

  const ret: Record<string, string> = Object.assign({}, source)

  if (params.reduceBorderRadius) {
    ret['border-radius-small'] = '1px'
    ret['border-radius-medium'] = '2px'
    ret['border-radius-large'] = '4px'
  }

  ;['primary', 'success', 'info', 'warning', 'danger', 'neutral'].forEach(
    (color) => {
      const hex: string | undefined = (params as any)[`${color}Color`]

      if (!hex) {
        return
      }

      const value = parseInt(`0x${hex.substr(1)}`)

      const r = (value >> 16) % 256
      const g = (value >> 8) % 256
      const b = value % 256
      const [h, s, l] = rgbToHsl(r, g, b)

      ;[
        0.95,
        0.84,
        0.73,
        0.62,
        0.49,
        0.35,
        0.23,
        0.15,
        0.1,
        0.05,
        0.02
      ].forEach((newL, idx) => {
        let n = idx === 0 ? 50 : idx === 10 ? 950 : idx * 100

        if (params.dark) {
          n = 1000 - n
        }

        ret[`color-${color}-${n}`] = hslToRgb(
          h,
          s,
          newL * Math.abs(1 - newL + l) // TODO: argument should normally be just newL
        ).join(' ')
      })
    }
  )

  return ret as Theme
}

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

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r: number, g: number, b: number) {
  ;(r /= 255), (g /= 255), (b /= 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h: number
  let s: number
  let l = (max + min) / 2

  if (max == min) {
    h = s = 0 // achromatic
  } else {
    var d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return [h, s, l]
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h: number, s: number, l: number) {
  let r: number, g: number, b: number

  if (s == 0) {
    r = g = b = l // achromatic
  } else {
    function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s
    var p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [r * 255, g * 255, b * 255]
}
