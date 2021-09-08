import Color from 'color'

// === exports =======================================================

export { convertToCss, Theme, Themes }

// === constants =====================================================

const COLOR_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 950]

const SEMANTIC_COLORS = new Set<SemanticColor>([
  'primary',
  'success',
  'info',
  'warning',
  'danger'
])

// === types =========================================================

type ThemeCustomizing = {
  primaryColor?: string
  successColor?: string
  infoColor?: string
  warningColor?: string
  dangerColor?: string
  dark?: boolean
}

type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
type SemanticColor = 'primary' | 'success' | 'info' | 'warning' | 'danger'

// === enums =========================================================

const Themes = {
  get blue(): Theme {
    return setThemeProperty(this, 'blue', { primaryColor: '#267CC7' })
  },

  get orange(): Theme {
    return setThemeProperty(this, 'orange', { primaryColor: '#c94a2a' })
  },

  get teal(): Theme {
    return setThemeProperty(this, 'teal', { primaryColor: '#00b0b0' })
  },

  get violet(): Theme {
    return setThemeProperty(this, 'violet', { primaryColor: '#b14dc2' })
  },

  custom(customizing: ThemeCustomizing): Theme {
    const ret: { -readonly [K in keyof Theme]: Theme[K] } = Object.assign(
      {},
      lightTheme
    )

    ret['border-radius-small'] = '2px'
    ret['border-radius-medium'] = '2px'
    ret['border-radius-large'] = '2px'
    ret['border-radius-x-large'] = '2px'

    ret['focus-ring-color'] = 'var(--sl-color-primary-700)'
    ret['focus-ring-width'] = '1px'
    ret['focus-ring-alpha'] = '100%'

    ret['input-border-color'] = 'var(--sl-color-neutral-400)'
    ret['input-border-color-hover'] = 'var(--sl-color-neutral-600)'
    ret['input-border-color-focus'] = 'var(--sl-color-primary-700)'

    ret['font-size-medium'] = '0.894rem'

    for (const semanticColor of SEMANTIC_COLORS) {
      const colorHex = customizing[`${semanticColor}Color`]

      if (colorHex) {
        Object.assign(ret, {
          ...calcColorShades(semanticColor, colorHex)
        })
      }
    }

    return Object.freeze(ret)
  }
}

function convertToCss(theme: Theme) {
  const lines: string[] = [':host {']

  Object.entries(theme).forEach(([key, value]) => {
    lines.push(`--sl-${key}: ${value};`)
  })

  lines.push('}\n')

  return lines.join('\n')
}

// === utils =========================================================

function rgbToHex(rgb: string) {
  let ret = '#'

  for (const c of rgb.split(' ')) {
    let hex = parseInt(c).toString(16)

    if (hex.length === 1) {
      hex = `0${hex}`
    }

    ret += hex
  }

  return ret
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  if (!result) {
    throw new Error(`Illegal color '${hex}`)
  }

  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)

  return `${r} ${g} ${b}`
}

function calcColorShades<C extends SemanticColor>(
  semanticColor: C,
  colorHex: string
): Record<`color-${SemanticColor}-${ColorShade}`, string> {
  const ret: any = {
    [`color-${semanticColor}-500`]: hexToRgb(colorHex)
  }
  const base: Record<string, string> = lightTheme
  const key500 = `color-${semanticColor}-500`
  const value500 = colorHex
  const color500 = Color(value500)

  for (const shade of COLOR_SHADES) {
    const colorKey = `color-${semanticColor}-${shade}`

    if (shade !== 500) {
      const lightness500 = color500.lightness()
      const lightnessBase500 = Color(rgbToHex(base[key500])).lightness()
      const lightness = Color(rgbToHex(base[colorKey])).lightness()
      const factor = (lightness500 - lightnessBase500) / lightnessBase500
      const newColor = color500.lightness(lightness).lighten(factor)

      ret[colorKey] = hexToRgb(newColor.hex())
    }
  }

  return ret
}

function setThemeProperty(
  obj: typeof Themes,
  propName: keyof typeof Themes,
  customizing: ThemeCustomizing
) {
  const theme: Theme = Themes.custom(customizing)

  Object.defineProperty(obj, propName, {
    value: theme
  })

  return theme
}

// === Shoelace original light theme =================================

type Theme = Readonly<{
  'color-blue-gray-50': string
  'color-blue-gray-100': string
  'color-blue-gray-200': string
  'color-blue-gray-300': string
  'color-blue-gray-400': string
  'color-blue-gray-500': string
  'color-blue-gray-600': string
  'color-blue-gray-700': string
  'color-blue-gray-800': string
  'color-blue-gray-900': string
  'color-blue-gray-950': string
  'color-cool-gray-50': string
  'color-cool-gray-100': string
  'color-cool-gray-200': string
  'color-cool-gray-300': string
  'color-cool-gray-400': string
  'color-cool-gray-500': string
  'color-cool-gray-600': string
  'color-cool-gray-700': string
  'color-cool-gray-800': string
  'color-cool-gray-900': string
  'color-cool-gray-950': string
  'color-gray-50': string
  'color-gray-100': string
  'color-gray-200': string
  'color-gray-300': string
  'color-gray-400': string
  'color-gray-500': string
  'color-gray-600': string
  'color-gray-700': string
  'color-gray-800': string
  'color-gray-900': string
  'color-gray-950': string
  'color-true-gray-50': string
  'color-true-gray-100': string
  'color-true-gray-200': string
  'color-true-gray-300': string
  'color-true-gray-400': string
  'color-true-gray-500': string
  'color-true-gray-600': string
  'color-true-gray-700': string
  'color-true-gray-800': string
  'color-true-gray-900': string
  'color-true-gray-950': string
  'color-warm-gray-50': string
  'color-warm-gray-100': string
  'color-warm-gray-200': string
  'color-warm-gray-300': string
  'color-warm-gray-400': string
  'color-warm-gray-500': string
  'color-warm-gray-600': string
  'color-warm-gray-700': string
  'color-warm-gray-800': string
  'color-warm-gray-900': string
  'color-warm-gray-950': string
  'color-red-50': string
  'color-red-100': string
  'color-red-200': string
  'color-red-300': string
  'color-red-400': string
  'color-red-500': string
  'color-red-600': string
  'color-red-700': string
  'color-red-800': string
  'color-red-900': string
  'color-red-950': string
  'color-orange-50': string
  'color-orange-100': string
  'color-orange-200': string
  'color-orange-300': string
  'color-orange-400': string
  'color-orange-500': string
  'color-orange-600': string
  'color-orange-700': string
  'color-orange-800': string
  'color-orange-900': string
  'color-orange-950': string
  'color-amber-50': string
  'color-amber-100': string
  'color-amber-200': string
  'color-amber-300': string
  'color-amber-400': string
  'color-amber-500': string
  'color-amber-600': string
  'color-amber-700': string
  'color-amber-800': string
  'color-amber-900': string
  'color-amber-950': string
  'color-yellow-50': string
  'color-yellow-100': string
  'color-yellow-200': string
  'color-yellow-300': string
  'color-yellow-400': string
  'color-yellow-500': string
  'color-yellow-600': string
  'color-yellow-700': string
  'color-yellow-800': string
  'color-yellow-900': string
  'color-yellow-950': string
  'color-lime-50': string
  'color-lime-100': string
  'color-lime-200': string
  'color-lime-300': string
  'color-lime-400': string
  'color-lime-500': string
  'color-lime-600': string
  'color-lime-700': string
  'color-lime-800': string
  'color-lime-900': string
  'color-lime-950': string
  'color-green-50': string
  'color-green-100': string
  'color-green-200': string
  'color-green-300': string
  'color-green-400': string
  'color-green-500': string
  'color-green-600': string
  'color-green-700': string
  'color-green-800': string
  'color-green-900': string
  'color-green-950': string
  'color-emerald-50': string
  'color-emerald-100': string
  'color-emerald-200': string
  'color-emerald-300': string
  'color-emerald-400': string
  'color-emerald-500': string
  'color-emerald-600': string
  'color-emerald-700': string
  'color-emerald-800': string
  'color-emerald-900': string
  'color-emerald-950': string
  'color-teal-50': string
  'color-teal-100': string
  'color-teal-200': string
  'color-teal-300': string
  'color-teal-400': string
  'color-teal-500': string
  'color-teal-600': string
  'color-teal-700': string
  'color-teal-800': string
  'color-teal-900': string
  'color-teal-950': string
  'color-cyan-50': string
  'color-cyan-100': string
  'color-cyan-200': string
  'color-cyan-300': string
  'color-cyan-400': string
  'color-cyan-500': string
  'color-cyan-600': string
  'color-cyan-700': string
  'color-cyan-800': string
  'color-cyan-900': string
  'color-cyan-950': string
  'color-sky-50': string
  'color-sky-100': string
  'color-sky-200': string
  'color-sky-300': string
  'color-sky-400': string
  'color-sky-500': string
  'color-sky-600': string
  'color-sky-700': string
  'color-sky-800': string
  'color-sky-900': string
  'color-sky-950': string
  'color-blue-50': string
  'color-blue-100': string
  'color-blue-200': string
  'color-blue-300': string
  'color-blue-400': string
  'color-blue-500': string
  'color-blue-600': string
  'color-blue-700': string
  'color-blue-800': string
  'color-blue-900': string
  'color-blue-950': string
  'color-indigo-50': string
  'color-indigo-100': string
  'color-indigo-200': string
  'color-indigo-300': string
  'color-indigo-400': string
  'color-indigo-500': string
  'color-indigo-600': string
  'color-indigo-700': string
  'color-indigo-800': string
  'color-indigo-900': string
  'color-indigo-950': string
  'color-violet-50': string
  'color-violet-100': string
  'color-violet-200': string
  'color-violet-300': string
  'color-violet-400': string
  'color-violet-500': string
  'color-violet-600': string
  'color-violet-700': string
  'color-violet-800': string
  'color-violet-900': string
  'color-violet-950': string
  'color-purple-50': string
  'color-purple-100': string
  'color-purple-200': string
  'color-purple-300': string
  'color-purple-400': string
  'color-purple-500': string
  'color-purple-600': string
  'color-purple-700': string
  'color-purple-800': string
  'color-purple-900': string
  'color-purple-950': string
  'color-fuchsia-50': string
  'color-fuchsia-100': string
  'color-fuchsia-200': string
  'color-fuchsia-300': string
  'color-fuchsia-400': string
  'color-fuchsia-500': string
  'color-fuchsia-600': string
  'color-fuchsia-700': string
  'color-fuchsia-800': string
  'color-fuchsia-900': string
  'color-fuchsia-950': string
  'color-pink-50': string
  'color-pink-100': string
  'color-pink-200': string
  'color-pink-300': string
  'color-pink-400': string
  'color-pink-500': string
  'color-pink-600': string
  'color-pink-700': string
  'color-pink-800': string
  'color-pink-900': string
  'color-pink-950': string
  'color-rose-50': string
  'color-rose-100': string
  'color-rose-200': string
  'color-rose-300': string
  'color-rose-400': string
  'color-rose-500': string
  'color-rose-600': string
  'color-rose-700': string
  'color-rose-800': string
  'color-rose-900': string
  'color-rose-950': string
  'color-primary-50': string
  'color-primary-100': string
  'color-primary-200': string
  'color-primary-300': string
  'color-primary-400': string
  'color-primary-500': string
  'color-primary-600': string
  'color-primary-700': string
  'color-primary-800': string
  'color-primary-900': string
  'color-primary-950': string
  'color-success-50': string
  'color-success-100': string
  'color-success-200': string
  'color-success-300': string
  'color-success-400': string
  'color-success-500': string
  'color-success-600': string
  'color-success-700': string
  'color-success-800': string
  'color-success-900': string
  'color-success-950': string
  'color-warning-50': string
  'color-warning-100': string
  'color-warning-200': string
  'color-warning-300': string
  'color-warning-400': string
  'color-warning-500': string
  'color-warning-600': string
  'color-warning-700': string
  'color-warning-800': string
  'color-warning-900': string
  'color-warning-950': string
  'color-danger-50': string
  'color-danger-100': string
  'color-danger-200': string
  'color-danger-300': string
  'color-danger-400': string
  'color-danger-500': string
  'color-danger-600': string
  'color-danger-700': string
  'color-danger-800': string
  'color-danger-900': string
  'color-danger-950': string
  'color-neutral-50': string
  'color-neutral-100': string
  'color-neutral-200': string
  'color-neutral-300': string
  'color-neutral-400': string
  'color-neutral-500': string
  'color-neutral-600': string
  'color-neutral-700': string
  'color-neutral-800': string
  'color-neutral-900': string
  'color-neutral-950': string
  'color-neutral-0': string
  'color-neutral-1000': string
  'border-radius-small': string
  'border-radius-medium': string
  'border-radius-large': string
  'border-radius-x-large': string
  'border-radius-circle': string
  'border-radius-pill': string
  'shadow-x-small': string
  'shadow-small': string
  'shadow-medium': string
  'shadow-large': string
  'shadow-x-large': string
  'spacing-xxx-small': string
  'spacing-xx-small': string
  'spacing-x-small': string
  'spacing-small': string
  'spacing-medium': string
  'spacing-large': string
  'spacing-x-large': string
  'spacing-xx-large': string
  'spacing-xxx-large': string
  'spacing-xxxx-large': string
  'transition-x-slow': string
  'transition-slow': string
  'transition-medium': string
  'transition-fast': string
  'transition-x-fast': string
  'font-mono': string
  'font-sans': string
  'font-serif': string
  'font-size-xx-small': string
  'font-size-x-small': string
  'font-size-small': string
  'font-size-medium': string
  'font-size-large': string
  'font-size-x-large': string
  'font-size-xx-large': string
  'font-size-xxx-large': string
  'font-size-xxxx-large': string
  'font-weight-light': string
  'font-weight-normal': string
  'font-weight-semibold': string
  'font-weight-bold': string
  'letter-spacing-dense': string
  'letter-spacing-normal': string
  'letter-spacing-loose': string
  'line-height-dense': string
  'line-height-normal': string
  'line-height-loose': string
  'focus-ring-color': string
  'focus-ring-width': string
  'focus-ring-alpha': string
  'focus-ring': string
  'button-font-size-small': string
  'button-font-size-medium': string
  'button-font-size-large': string
  'input-height-small': string
  'input-height-medium': string
  'input-height-large': string
  'input-background-color': string
  'input-background-color-hover': string
  'input-background-color-focus': string
  'input-background-color-disabled': string
  'input-border-color': string
  'input-border-color-hover': string
  'input-border-color-focus': string
  'input-border-color-disabled': string
  'input-border-width': string
  'input-border-radius-small': string
  'input-border-radius-medium': string
  'input-border-radius-large': string
  'input-font-family': string
  'input-font-weight': string
  'input-font-size-small': string
  'input-font-size-medium': string
  'input-font-size-large': string
  'input-letter-spacing': string
  'input-color': string
  'input-color-hover': string
  'input-color-focus': string
  'input-color-disabled': string
  'input-icon-color': string
  'input-icon-color-hover': string
  'input-icon-color-focus': string
  'input-placeholder-color': string
  'input-placeholder-color-disabled': string
  'input-spacing-small': string
  'input-spacing-medium': string
  'input-spacing-large': string
  'input-label-font-size-small': string
  'input-label-font-size-medium': string
  'input-label-font-size-large': string
  'input-label-color': string
  'input-help-text-font-size-small': string
  'input-help-text-font-size-medium': string
  'input-help-text-font-size-large': string
  'input-help-text-color': string
  'toggle-size': string
  'overlay-background-color': string
  'overlay-opacity': string
  'panel-background-color': string
  'panel-border-color': string
  'tooltip-border-radius': string
  'tooltip-background-color': string
  'tooltip-color': string
  'tooltip-font-family': string
  'tooltip-font-weight': string
  'tooltip-font-size': string
  'tooltip-line-height': string
  'tooltip-padding': string
  'tooltip-arrow-size': string
  'tooltip-arrow-start-end-offset': string
  'z-index-drawer': string
  'z-index-dialog': string
  'z-index-dropdown': string
  'z-index-toast': string
  'z-index-tooltip': string
}>

const lightTheme: Theme = {
  'color-blue-gray-50': '248 250 252',
  'color-blue-gray-100': '241 245 249',
  'color-blue-gray-200': '226 232 240',
  'color-blue-gray-300': '203 213 225',
  'color-blue-gray-400': '148 163 184',
  'color-blue-gray-500': '100 116 139',
  'color-blue-gray-600': '71 85 105',
  'color-blue-gray-700': '51 65 85',
  'color-blue-gray-800': '30 41 59',
  'color-blue-gray-900': '15 23 42',
  'color-blue-gray-950': '10 16 30',
  'color-cool-gray-50': '249 250 251',
  'color-cool-gray-100': '243 244 246',
  'color-cool-gray-200': '229 231 235',
  'color-cool-gray-300': '209 213 219',
  'color-cool-gray-400': '156 163 175',
  'color-cool-gray-500': '107 114 128',
  'color-cool-gray-600': '75 85 99',
  'color-cool-gray-700': '55 65 81',
  'color-cool-gray-800': '31 41 55',
  'color-cool-gray-900': '17 24 39',
  'color-cool-gray-950': '12 17 29',
  'color-gray-50': '250 250 250',
  'color-gray-100': '244 244 245',
  'color-gray-200': '228 228 231',
  'color-gray-300': '212 212 216',
  'color-gray-400': '161 161 170',
  'color-gray-500': '113 113 122',
  'color-gray-600': '82 82 91',
  'color-gray-700': '63 63 70',
  'color-gray-800': '39 39 42',
  'color-gray-900': '24 24 27',
  'color-gray-950': '19 19 22',
  'color-true-gray-50': '250 250 250',
  'color-true-gray-100': '245 245 245',
  'color-true-gray-200': '229 229 229',
  'color-true-gray-300': '212 212 212',
  'color-true-gray-400': '163 163 163',
  'color-true-gray-500': '115 115 115',
  'color-true-gray-600': '82 82 82',
  'color-true-gray-700': '64 64 64',
  'color-true-gray-800': '38 38 38',
  'color-true-gray-900': '23 23 23',
  'color-true-gray-950': '17 17 17',
  'color-warm-gray-50': '250 250 249',
  'color-warm-gray-100': '245 245 244',
  'color-warm-gray-200': '231 229 228',
  'color-warm-gray-300': '214 211 209',
  'color-warm-gray-400': '168 162 158',
  'color-warm-gray-500': '120 113 108',
  'color-warm-gray-600': '87 83 78',
  'color-warm-gray-700': '68 64 60',
  'color-warm-gray-800': '41 37 36',
  'color-warm-gray-900': '28 25 23',
  'color-warm-gray-950': '19 18 16',
  'color-red-50': '254 242 242',
  'color-red-100': '254 226 226',
  'color-red-200': '254 202 202',
  'color-red-300': '252 165 165',
  'color-red-400': '248 113 113',
  'color-red-500': '239 68 68',
  'color-red-600': '220 38 38',
  'color-red-700': '185 28 28',
  'color-red-800': '153 27 27',
  'color-red-900': '127 29 29',
  'color-red-950': '80 20 20',
  'color-orange-50': '255 247 237',
  'color-orange-100': '255 237 213',
  'color-orange-200': '254 215 170',
  'color-orange-300': '253 186 116',
  'color-orange-400': '251 146 60',
  'color-orange-500': '249 115 22',
  'color-orange-600': '234 88 12',
  'color-orange-700': '194 65 12',
  'color-orange-800': '154 52 18',
  'color-orange-900': '124 45 18',
  'color-orange-950': '82 32 15',
  'color-amber-50': '255 251 235',
  'color-amber-100': '254 243 199',
  'color-amber-200': '253 230 138',
  'color-amber-300': '252 211 77',
  'color-amber-400': '251 191 36',
  'color-amber-500': '245 158 11',
  'color-amber-600': '217 119 6',
  'color-amber-700': '180 83 9',
  'color-amber-800': '146 64 14',
  'color-amber-900': '120 53 15',
  'color-amber-950': '74 35 11',
  'color-yellow-50': '254 252 232',
  'color-yellow-100': '254 249 195',
  'color-yellow-200': '254 240 138',
  'color-yellow-300': '253 224 71',
  'color-yellow-400': '250 204 21',
  'color-yellow-500': '234 179 8',
  'color-yellow-600': '202 138 4',
  'color-yellow-700': '161 98 7',
  'color-yellow-800': '133 77 14',
  'color-yellow-900': '113 63 18',
  'color-yellow-950': '60 38 11',
  'color-lime-50': '247 254 231',
  'color-lime-100': '236 252 203',
  'color-lime-200': '217 249 157',
  'color-lime-300': '190 242 100',
  'color-lime-400': '163 230 53',
  'color-lime-500': '132 204 22',
  'color-lime-600': '101 163 13',
  'color-lime-700': '77 124 15',
  'color-lime-800': '63 98 18',
  'color-lime-900': '54 83 20',
  'color-lime-950': '38 57 14',
  'color-green-50': '240 253 244',
  'color-green-100': '220 252 231',
  'color-green-200': '187 247 208',
  'color-green-300': '134 239 172',
  'color-green-400': '74 222 128',
  'color-green-500': '34 197 94',
  'color-green-600': '22 163 74',
  'color-green-700': '21 128 61',
  'color-green-800': '22 101 52',
  'color-green-900': '20 83 45',
  'color-green-950': '12 49 27',
  'color-emerald-50': '236 253 245',
  'color-emerald-100': '209 250 229',
  'color-emerald-200': '167 243 208',
  'color-emerald-300': '110 231 183',
  'color-emerald-400': '52 211 153',
  'color-emerald-500': '16 185 129',
  'color-emerald-600': '5 150 105',
  'color-emerald-700': '4 120 87',
  'color-emerald-800': '6 95 70',
  'color-emerald-900': '6 78 59',
  'color-emerald-950': '3 45 34',
  'color-teal-50': '240 253 250',
  'color-teal-100': '204 251 241',
  'color-teal-200': '153 246 228',
  'color-teal-300': '94 234 212',
  'color-teal-400': '45 212 191',
  'color-teal-500': '20 184 166',
  'color-teal-600': '13 148 136',
  'color-teal-700': '15 118 110',
  'color-teal-800': '17 94 89',
  'color-teal-900': '19 78 74',
  'color-teal-950': '12 46 44',
  'color-cyan-50': '236 254 255',
  'color-cyan-100': '207 250 254',
  'color-cyan-200': '165 243 252',
  'color-cyan-300': '103 232 249',
  'color-cyan-400': '34 211 238',
  'color-cyan-500': '6 182 212',
  'color-cyan-600': '8 145 178',
  'color-cyan-700': '14 116 144',
  'color-cyan-800': '21 94 117',
  'color-cyan-900': '22 78 99',
  'color-cyan-950': '16 52 66',
  'color-sky-50': '240 249 255',
  'color-sky-100': '224 242 254',
  'color-sky-200': '186 230 253',
  'color-sky-300': '125 211 252',
  'color-sky-400': '56 189 248',
  'color-sky-500': '14 165 233',
  'color-sky-600': '2 132 199',
  'color-sky-700': '3 105 161',
  'color-sky-800': '7 89 133',
  'color-sky-900': '12 74 110',
  'color-sky-950': '11 50 73',
  'color-blue-50': '239 246 255',
  'color-blue-100': '219 234 254',
  'color-blue-200': '191 219 254',
  'color-blue-300': '147 197 253',
  'color-blue-400': '96 165 250',
  'color-blue-500': '59 130 246',
  'color-blue-600': '37 99 235',
  'color-blue-700': '29 78 216',
  'color-blue-800': '30 64 175',
  'color-blue-900': '30 58 138',
  'color-blue-950': '21 33 73',
  'color-indigo-50': '238 242 255',
  'color-indigo-100': '224 231 255',
  'color-indigo-200': '199 210 254',
  'color-indigo-300': '165 180 252',
  'color-indigo-400': '129 140 248',
  'color-indigo-500': '99 102 241',
  'color-indigo-600': '79 70 229',
  'color-indigo-700': '67 56 202',
  'color-indigo-800': '55 48 163',
  'color-indigo-900': '49 46 129',
  'color-indigo-950': '36 33 84',
  'color-violet-50': '245 243 255',
  'color-violet-100': '237 233 254',
  'color-violet-200': '221 214 254',
  'color-violet-300': '196 181 253',
  'color-violet-400': '167 139 250',
  'color-violet-500': '139 92 246',
  'color-violet-600': '124 58 237',
  'color-violet-700': '109 40 217',
  'color-violet-800': '91 33 182',
  'color-violet-900': '76 29 149',
  'color-violet-950': '49 21 88',
  'color-purple-50': '250 245 255',
  'color-purple-100': '243 232 255',
  'color-purple-200': '233 213 255',
  'color-purple-300': '216 180 254',
  'color-purple-400': '192 132 252',
  'color-purple-500': '168 85 247',
  'color-purple-600': '147 51 234',
  'color-purple-700': '126 34 206',
  'color-purple-800': '107 33 168',
  'color-purple-900': '88 28 135',
  'color-purple-950': '47 17 67',
  'color-fuchsia-50': '253 244 255',
  'color-fuchsia-100': '250 232 255',
  'color-fuchsia-200': '245 208 254',
  'color-fuchsia-300': '240 171 252',
  'color-fuchsia-400': '232 121 249',
  'color-fuchsia-500': '217 70 239',
  'color-fuchsia-600': '192 38 211',
  'color-fuchsia-700': '162 28 175',
  'color-fuchsia-800': '134 25 143',
  'color-fuchsia-900': '112 26 117',
  'color-fuchsia-950': '56 16 58',
  'color-pink-50': '253 242 248',
  'color-pink-100': '252 231 243',
  'color-pink-200': '251 207 232',
  'color-pink-300': '249 168 212',
  'color-pink-400': '244 114 182',
  'color-pink-500': '236 72 153',
  'color-pink-600': '219 39 119',
  'color-pink-700': '190 24 93',
  'color-pink-800': '157 23 77',
  'color-pink-900': '131 24 67',
  'color-pink-950': '67 14 35',
  'color-rose-50': '255 241 242',
  'color-rose-100': '255 228 230',
  'color-rose-200': '254 205 211',
  'color-rose-300': '253 164 175',
  'color-rose-400': '251 113 133',
  'color-rose-500': '244 63 94',
  'color-rose-600': '225 29 72',
  'color-rose-700': '190 18 60',
  'color-rose-800': '159 18 57',
  'color-rose-900': '136 19 55',
  'color-rose-950': '74 13 32',
  'color-primary-50': '240 249 255',
  'color-primary-100': '224 242 254',
  'color-primary-200': '186 230 253',
  'color-primary-300': '125 211 252',
  'color-primary-400': '56 189 248',
  'color-primary-500': '14 165 233',
  'color-primary-600': '2 132 199',
  'color-primary-700': '3 105 161',
  'color-primary-800': '7 89 133',
  'color-primary-900': '12 74 110',
  'color-primary-950': '11 50 73',
  'color-success-50': '240 253 244',
  'color-success-100': '220 252 231',
  'color-success-200': '187 247 208',
  'color-success-300': '134 239 172',
  'color-success-400': '74 222 128',
  'color-success-500': '34 197 94',
  'color-success-600': '22 163 74',
  'color-success-700': '21 128 61',
  'color-success-800': '22 101 52',
  'color-success-900': '20 83 45',
  'color-success-950': '12 49 27',
  'color-warning-50': '255 251 235',
  'color-warning-100': '254 243 199',
  'color-warning-200': '253 230 138',
  'color-warning-300': '252 211 77',
  'color-warning-400': '251 191 36',
  'color-warning-500': '245 158 11',
  'color-warning-600': '217 119 6',
  'color-warning-700': '180 83 9',
  'color-warning-800': '146 64 14',
  'color-warning-900': '120 53 15',
  'color-warning-950': '74 35 11',
  'color-danger-50': '254 242 242',
  'color-danger-100': '254 226 226',
  'color-danger-200': '254 202 202',
  'color-danger-300': '252 165 165',
  'color-danger-400': '248 113 113',
  'color-danger-500': '239 68 68',
  'color-danger-600': '220 38 38',
  'color-danger-700': '185 28 28',
  'color-danger-800': '153 27 27',
  'color-danger-900': '127 29 29',
  'color-danger-950': '80 20 20',
  'color-neutral-50': '250 250 250',
  'color-neutral-100': '244 244 245',
  'color-neutral-200': '228 228 231',
  'color-neutral-300': '212 212 216',
  'color-neutral-400': '161 161 170',
  'color-neutral-500': '113 113 122',
  'color-neutral-600': '82 82 91',
  'color-neutral-700': '63 63 70',
  'color-neutral-800': '39 39 42',
  'color-neutral-900': '24 24 27',
  'color-neutral-950': '19 19 22',
  'color-neutral-0': '255 255 255',
  'color-neutral-1000': '0 0 0',
  'border-radius-small': '0.125rem',
  'border-radius-medium': '0.25rem',
  'border-radius-large': '0.5rem',
  'border-radius-x-large': '1rem',
  'border-radius-circle': '50%',
  'border-radius-pill': '9999px',
  'shadow-x-small': '0 1px 0 rgb(var(--sl-color-neutral-500) / 10%)',
  'shadow-small': '0 1px 2px rgb(var(--sl-color-neutral-500) / 12%)',
  'shadow-medium': '0 2px 4px rgb(var(--sl-color-neutral-500) / 12%)',
  'shadow-large': '0 2px 8px rgb(var(--sl-color-neutral-500) / 12%)',
  'shadow-x-large': '0 4px 16px rgb(var(--sl-color-neutral-500) / 12%)',
  'spacing-xxx-small': '0.125rem',
  'spacing-xx-small': '0.25rem',
  'spacing-x-small': '0.5rem',
  'spacing-small': '0.75rem',
  'spacing-medium': '1rem',
  'spacing-large': '1.25rem',
  'spacing-x-large': '1.75rem',
  'spacing-xx-large': '2.25rem',
  'spacing-xxx-large': '3rem',
  'spacing-xxxx-large': '4.5rem',
  'transition-x-slow': '1000ms',
  'transition-slow': '500ms',
  'transition-medium': '250ms',
  'transition-fast': '150ms',
  'transition-x-fast': '50ms',
  'font-mono': "SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace",
  'font-sans':
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
  'font-serif': "Georgia, 'Times New Roman', serif",
  'font-size-xx-small': '0.625rem',
  'font-size-x-small': '0.75rem',
  'font-size-small': '0.875rem',
  'font-size-medium': '1rem',
  'font-size-large': '1.25rem',
  'font-size-x-large': '1.5rem',
  'font-size-xx-large': '2.25rem',
  'font-size-xxx-large': '3rem',
  'font-size-xxxx-large': '4.5rem',
  'font-weight-light': '300',
  'font-weight-normal': '400',
  'font-weight-semibold': '500',
  'font-weight-bold': '700',
  'letter-spacing-dense': '-0.015em',
  'letter-spacing-normal': 'normal',
  'letter-spacing-loose': '0.075em',
  'line-height-dense': '1.4',
  'line-height-normal': '1.8',
  'line-height-loose': '2.2',
  'focus-ring-color': 'var(--sl-color-primary-500)',
  'focus-ring-width': '3px',
  'focus-ring-alpha': '40%',
  'focus-ring':
    '0 0 0 var(--sl-focus-ring-width) rgb(var(--sl-focus-ring-color) / var(--sl-focus-ring-alpha))',
  'button-font-size-small': 'var(--sl-font-size-x-small)',
  'button-font-size-medium': 'var(--sl-font-size-small)',
  'button-font-size-large': 'var(--sl-font-size-medium)',
  'input-height-small': '1.875rem',
  'input-height-medium': '2.5rem',
  'input-height-large': '3.125rem',
  'input-background-color': 'var(--sl-color-neutral-0)',
  'input-background-color-hover': 'var(--sl-color-neutral-0)',
  'input-background-color-focus': 'var(--sl-color-neutral-0)',
  'input-background-color-disabled': 'var(--sl-color-neutral-100)',
  'input-border-color': 'var(--sl-color-neutral-300)',
  'input-border-color-hover': 'var(--sl-color-neutral-400)',
  'input-border-color-focus': 'var(--sl-color-primary-500)',
  'input-border-color-disabled': 'var(--sl-color-neutral-300)',
  'input-border-width': '1px',
  'input-border-radius-small': 'var(--sl-border-radius-medium)',
  'input-border-radius-medium': 'var(--sl-border-radius-medium)',
  'input-border-radius-large': 'var(--sl-border-radius-medium)',
  'input-font-family': 'var(--sl-font-sans)',
  'input-font-weight': 'var(--sl-font-weight-normal)',
  'input-font-size-small': 'var(--sl-font-size-small)',
  'input-font-size-medium': 'var(--sl-font-size-medium)',
  'input-font-size-large': 'var(--sl-font-size-large)',
  'input-letter-spacing': 'var(--sl-letter-spacing-normal)',
  'input-color': 'var(--sl-color-neutral-700)',
  'input-color-hover': 'var(--sl-color-neutral-700)',
  'input-color-focus': 'var(--sl-color-neutral-700)',
  'input-color-disabled': 'var(--sl-color-neutral-900)',
  'input-icon-color': 'var(--sl-color-neutral-500)',
  'input-icon-color-hover': 'var(--sl-color-neutral-600)',
  'input-icon-color-focus': 'var(--sl-color-neutral-600)',
  'input-placeholder-color': 'var(--sl-color-neutral-500)',
  'input-placeholder-color-disabled': 'var(--sl-color-neutral-600)',
  'input-spacing-small': 'var(--sl-spacing-small)',
  'input-spacing-medium': 'var(--sl-spacing-medium)',
  'input-spacing-large': 'var(--sl-spacing-large)',
  'input-label-font-size-small': 'var(--sl-font-size-small)',
  'input-label-font-size-medium': 'var(--sl-font-size-medium)',
  'input-label-font-size-large': 'var(--sl-font-size-large)',
  'input-label-color': 'inherit',
  'input-help-text-font-size-small': 'var(--sl-font-size-x-small)',
  'input-help-text-font-size-medium': 'var(--sl-font-size-small)',
  'input-help-text-font-size-large': 'var(--sl-font-size-medium)',
  'input-help-text-color': 'var(--sl-color-neutral-500)',
  'toggle-size': '1rem',
  'overlay-background-color': 'var(--sl-color-blue-gray-500)',
  'overlay-opacity': '33%',
  'panel-background-color': 'var(--sl-color-neutral-0)',
  'panel-border-color': 'var(--sl-color-neutral-200)',
  'tooltip-border-radius': 'var(--sl-border-radius-medium)',
  'tooltip-background-color': 'var(--sl-color-neutral-800)',
  'tooltip-color': 'var(--sl-color-neutral-0)',
  'tooltip-font-family': 'var(--sl-font-sans)',
  'tooltip-font-weight': 'var(--sl-font-weight-normal)',
  'tooltip-font-size': 'var(--sl-font-size-small)',
  'tooltip-line-height': 'var(--sl-line-height-dense)',
  'tooltip-padding': 'var(--sl-spacing-xx-small) var(--sl-spacing-x-small)',
  'tooltip-arrow-size': '5px',
  'tooltip-arrow-start-end-offset': '8px',
  'z-index-drawer': '700',
  'z-index-dialog': '800',
  'z-index-dropdown': '900',
  'z-index-toast': '950',
  'z-index-tooltip': '1000'
}
