// === exports =======================================================

export { Theme }

// === constants =====================================================

const COLOR_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

const SEMANTIC_COLORS = new Set<ColorName>([
  'primary',
  'success',
  'info',
  'warning',
  'danger'
])

// === types =========================================================

type ThemeTokens = typeof lightThemeTokens

type ThemeCustomizing = {
  primaryColor?: string
  successColor?: string
  infoColor?: string
  warningColor?: string
  dangerColor?: string
  dark?: boolean
}

type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
type ColorName = 'primary' | 'success' | 'info' | 'warning' | 'danger'

// === Theme ==========================================================

class Theme {
  #themeTokens: ThemeTokens
  #css: string | null = null

  static #colorNames: Set<string> | null = null

  static get default(): Theme {
    //return setThemeProperty('default', { primaryColor: '#04a4e9' })
    return Theme.#deriveTheme('default', 'sky')
  }
  static get apricot2(): Theme {
    //return setThemeProperty('default', { primaryColor: '#04a4e9' })
    return Theme.#deriveTheme('apricot2', 'apricot2')
  }

  static get apricot(): Theme {
    //return setThemeProperty('apricot', { primaryColor: '#c94a2a' })
    return setThemeProperty('apricot', { primaryColor: '#e98a6a' })
  }

  static get turquoise(): Theme {
    return setThemeProperty('turquoise', { primaryColor: '#12c9cc' })
  }

  static get amber(): Theme {
    return Theme.#deriveTheme('amber', 'amber')
  }

  static get blue(): Theme {
    return Theme.#deriveTheme('blue', 'blue')
  }

  static get cyan(): Theme {
    return Theme.#deriveTheme('cyan', 'cyan')
  }

  static get emerald(): Theme {
    return Theme.#deriveTheme('emerald', 'emerald')
  }

  static get fuchsia(): Theme {
    return Theme.#deriveTheme('fuchsia', 'fuchsia')
  }

  static get green(): Theme {
    return Theme.#deriveTheme('green', 'green')
  }

  static get indigo(): Theme {
    return Theme.#deriveTheme('indigo', 'indigo')
  }

  static get lime(): Theme {
    return Theme.#deriveTheme('lime', 'lime')
  }

  static get orange(): Theme {
    return Theme.#deriveTheme('orange', 'orange')
  }

  static get pink(): Theme {
    return Theme.#deriveTheme('pink', 'pink')
  }

  static get purple(): Theme {
    return Theme.#deriveTheme('purple', 'purple')
  }

  static get red(): Theme {
    return Theme.#deriveTheme('red', 'red')
  }

  static get rose(): Theme {
    return Theme.#deriveTheme('rose', 'rose')
  }

  static get teal(): Theme {
    return Theme.#deriveTheme('teal', 'teal')
  }

  static get violet(): Theme {
    return Theme.#deriveTheme('violet', 'violet')
  }

  static get yellow(): Theme {
    return Theme.#deriveTheme('yellow', 'yellow')
  }

  constructor(customizing: ThemeCustomizing) {
    if (Object.keys(customizing).length === 0) {
      this.#themeTokens = lightThemeTokens
      return
    }

    const tokens = { ...lightThemeTokens }

    adjustThemeTokens(tokens)

    for (const semanticColor of SEMANTIC_COLORS) {
      const colorHex = customizing[`${semanticColor}Color`]

      if (colorHex) {
        Object.assign(tokens, {
          ...Theme.#calcColorShades(semanticColor, colorHex)
        })
      }
    }

    this.#themeTokens = Object.freeze(tokens)
  }

  asCss(): string {
    let css = this.#css

    if (css) {
      return css
    }

    const lines: string[] = [':host {']

    Object.entries(this.#themeTokens).forEach(([key, value]) => {
      lines.push(`--sl-${key}: ${value};`)
    })

    lines.push('}\n')
    css = lines.join('\n')
    this.#css = css

    return css
  }

  isDark() {
    return this.#themeTokens['theme-mode'] === '1'
  }

  invert(): Theme {
    let colorNames = Theme.#colorNames || (Theme.#colorNames = getColorNames())

    const tokens: Record<string, string> = this.#themeTokens
    const invertedTokens = Object.assign({}, tokens)

    invertedTokens['theme-mode'] = tokens['theme-mode'] === '0' ? '1' : '0'
    invertedTokens['color-neutral-0'] = tokens['color-neutral-1000']
    invertedTokens['color-neutral-1000'] = tokens['color-neutral-0']

    colorNames.forEach((color) => {
      for (let i = 0; i < 5; ++i) {
        const key1 = `color-${color}-${i === 0 ? 50 : i * 100}`
        const key2 = `color-${color}-${i === 0 ? 950 : 1000 - i * 100}`

        invertedTokens[key1] = tokens[key2]
        invertedTokens[key2] = tokens[key1]
      }
    })

    const invertedTheme = new Theme({})
    invertedTheme.#themeTokens = Object.freeze(invertedTokens) as ThemeTokens

    return invertedTheme
  }

  static #deriveTheme(propName: string, primaryColorName: string): Theme {
    const ret = new Theme({})
    const base: any = lightThemeTokens
    const tokens: any = { ...lightThemeTokens }

    for (const shade of COLOR_SHADES) {
      tokens[`color-primary-${shade}`] =
        base[`color-${primaryColorName}-${shade}`]
    }

    adjustThemeTokens(tokens)
    ret.#themeTokens = tokens

    Object.defineProperty(Theme, propName, {
      value: ret
    })

    return ret
  }

  static #calcColorShades<C extends ColorName>(
    colorName: C,
    colorHex: string,
    dark = false
  ): Record<`color-${ColorName}-${ColorShade}`, string> {
    const ret: any = {}

    const scale = [
      calcColor(colorHex, 0.95), // 50
      calcColor(colorHex, 0.84), // 100
      calcColor(colorHex, 0.73), // 200
      calcColor(colorHex, 0.62), // 300
      calcColor(colorHex, 0.49), // 400
      calcColor(colorHex, 0.35), // 500
      calcColor(colorHex, 0.23), // 600
      calcColor(colorHex, 0.15), // 700
      calcColor(colorHex, 0.1), // 800
      calcColor(colorHex, 0.05), // 900
      calcColor(colorHex, 0.02) // 950
    ]

    scale.forEach((rgb, idx) => {
      ret[`color-${colorName}-${COLOR_SHADES[idx]}`] = rgb.join(' ')
    })
    console.log(colorName, JSON.stringify(ret, null, 2))
    return ret
  }
}

// === utils =========================================================

function getColorNames(): Set<string> {
  return new Set(
    Object.keys(lightThemeTokens)
      .filter((it) => it.startsWith('color-'))
      .map((it) => it.replace(/^color-|-[^-]*$/g, ''))
      .sort()
  )
}

function adjustThemeTokens(tokens: ThemeTokens) {
  tokens['border-radius-small'] = '2px'
  tokens['border-radius-medium'] = '2px'
  tokens['border-radius-large'] = '2px'
  tokens['border-radius-x-large'] = '2px'

  tokens['focus-ring-color'] = 'var(--sl-color-primary-700)'
  tokens['focus-ring-width'] = '1px'
  tokens['focus-ring-alpha'] = '100%'

  tokens['input-border-color'] = 'var(--sl-color-neutral-400)'
  tokens['input-border-color-hover'] = 'var(--sl-color-neutral-600)'
  tokens['input-border-color-focus'] = 'var(--sl-color-primary-700)'

  tokens['font-size-medium'] = '0.92rem'
}

// === color utility functions =======================================

function calcColor(hex: string, lum: number): [number, number, number] {
  let [r, g, b] = hexToRgb(hex)
  let iter = 0
  let l = luminanceOfRgb(r, g, b)
  let rmin = 0
  let gmin = 0
  let bmin = 0
  let rmax = 255
  let gmax = 255
  let bmax = 255

  while (++iter <= 20 && Math.abs(l - lum) > 1e-7) {
    if (l < lum) {
      rmin = r
      gmin = g
      bmin = b
    } else {
      rmax = r
      gmax = g
      bmax = b
    }

    r = (rmin + rmax) / 2
    g = (gmin + gmax) / 2
    b = (bmin + bmax) / 2
    l = luminanceOfRgb(r, g, b)
  }

  return [Math.round(r), Math.round(g), Math.round(b)]
}

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.substr(1), 16)

  if (isNaN(value) || hex[0] !== '#' || hex.length !== 7) {
    throw new Error(`Illegal color '${hex}'. Required hex format: #rrggbb`)
  }

  const r = (value >> 16) % 256
  const g = (value >> 8) % 256
  const b = value % 256

  return [r, g, b]
}

function luminanceOfRgb(r: number, g: number, b: number): number {
  // relative luminance
  // see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
  const lr = luminanceOfValue(r)
  const lg = luminanceOfValue(g)
  const lb = luminanceOfValue(b)

  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb
}

function luminanceOfValue(x: number): number {
  const v = x / 255

  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

// === helpers =======================================================

function setThemeProperty(
  propName: Exclude<keyof typeof Theme, 'prototype'>,
  customizing: ThemeCustomizing
): Theme {
  const theme: Theme = new Theme(customizing)

  Object.defineProperty(Theme, propName, {
    value: theme
  })

  return theme
}

// === Shoelace original light theme =================================

const lightThemeTokens = {
  'theme-mode': '0', // '0': light theme, '1': dark theme
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
  'z-index-tooltip': '1000',

  'color-apricot2-50': '254 248 246',
  'color-apricot2-100': '251 233 226',
  'color-apricot2-200': '248 215 204',
  'color-apricot2-300': '244 196 180',
  'color-apricot2-400': '239 170 146',
  'color-apricot2-500': '229 135 104',
  'color-apricot2-600': '189 112 86',
  'color-apricot2-700': '155 92 70',
  'color-apricot2-800': '128 76 58',
  'color-apricot2-900': '91 54 41',
  'color-apricot2-950': '56 33 25'
}

console.log(getColorNames())
