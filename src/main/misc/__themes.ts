// Color calculations derived from parts of the source code of
// the `Chroma.js` project (see: https://github.com/gka/chroma.js).
// Many thanks for their great work.

// === exports =======================================================

export { loadTheme, Theme, Themes }

// === constants =====================================================

const COLOR_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

const COLOR_LUMINANCES = [
  0.95, // 50
  0.84, // 100
  0.73, // 200
  0.62, // 300
  0.49, // 400
  0.35, // 500
  0.23, // 600
  0.15, // 700
  0.1, // 800
  0.05, // 900
  0.02 // 950
]

const SEMANTIC_COLOR_NAMES = [
  'primary',
  'success',
  'info',
  'warning',
  'danger'
] as const

const PALETTE_COLORS: Record<string, Color> = {
  amber: [245, 158, 11],
  blue: [59, 130, 246],
  cyan: [6, 182, 212],
  emerald: [16, 185, 129],
  fuchsia: [217, 70, 239],
  gray: [113, 113, 122],
  green: [34, 197, 94],
  indigo: [99, 102, 241],
  lime: [132, 204, 22],
  orange: [255, 120, 28],
  pink: [236, 72, 153],
  purple: [168, 85, 247],
  red: [239, 68, 68],
  rose: [244, 63, 94],
  sky: [14, 165, 233],
  teal: [20, 184, 166],
  violet: [139, 92, 246],
  yellow: [240, 184, 20]
}

const PALETTE_COLOR_NAMES = Object.keys(PALETTE_COLORS)

const ALL_COLOR_NAMES = new Set([
  ...SEMANTIC_COLOR_NAMES,
  ...PALETTE_COLOR_NAMES
])

// === types =========================================================

type Color = [red: number, green: number, blue: number]
type ThemeTokens = typeof lightThemeTokens

type ThemeCustomizing = {
  primaryColor?: Color
  successColor?: Color
  infoColor?: Color
  warningColor?: Color
  dangerColor?: Color
  dark?: boolean
}

// === Theme ==========================================================

class Theme {
  #themeTokens: ThemeTokens
  #css: string | null = null
  #invertedTheme: Theme | null = null

  static #colorNames: Set<string> | null = null

  constructor(customizing: ThemeCustomizing) {
    if (Object.keys(customizing).length === 0) {
      this.#themeTokens = lightThemeTokens
      return
    }

    const tokens = { ...lightThemeTokens }

    for (const semanticColor of SEMANTIC_COLOR_NAMES) {
      const color = customizing[`${semanticColor}Color`]

      if (color) {
        Object.assign(tokens, calcColorShades(semanticColor, color))
      }
    }

    this.#themeTokens = tokens
    this.#adjustThemeTokens()
  }

  asCss(selector = ':root, :host'): string {
    let css = this.#css

    if (css) {
      return css
    }

    const lines: string[] = [
      `${selector} {`, //
      '  --on: inherit;',
      '  --off: ;'
    ]

    Object.entries(this.#themeTokens).forEach(([key, value]) => {
      lines.push(`  --sl-${key}: ${value};`)
    })

    lines.push('}\n')
    css = lines.join('\n')
    this.#css = css

    return css
  }

  isDark() {
    return this.#themeTokens['dark'] === 'var(--on)'
  }

  invert(): Theme {
    let ret = this.#invertedTheme

    if (ret) {
      return ret
    }

    const tokens: Record<string, string> = this.#themeTokens
    const invertedTokens = Object.assign({}, tokens)

    invertedTokens['light'] =
      tokens['light'] === 'var(--off)' ? 'var(--on)' : 'var(--off)'

    invertedTokens['dark'] =
      tokens['dark'] === 'var(--off)' ? 'var(--on)' : 'var(--off)'

    // TODO
    //invertedTokens['color-neutral-0'] = tokens['color-neutral-1000']
    //invertedTokens['color-neutral-1000'] = tokens['color-neutral-0']

    ALL_COLOR_NAMES.forEach((color) => {
      for (let i = 0; i < 5; ++i) {
        const key1 = `color-${color}-${i === 0 ? 50 : i * 100}`
        const key2 = `color-${color}-${i === 0 ? 950 : 1000 - i * 100}`

        invertedTokens[key1] = tokens[key2]
        invertedTokens[key2] = tokens[key1]
      }
    })

    // TODO!!!!!
    if (this.isDark()) {
      COLOR_SHADES.forEach((shade) => {
        invertedTokens[`color-neutral-${shade}`] = (lightThemeTokens as any)[
          `color-neutral-${shade}`
        ]
      })

      Object.assign(invertedTokens, {
        'color-neutral-0': lightThemeTokens['color-neutral-0'],
        'color-neutral-1000': lightThemeTokens['color-neutral-1000']

        //'input-background-color': lightThemeTokens['input-background-color'],
        //'input-border-color': lightThemeTokens['input-border-color']
      })
    } else {
      Object.assign(invertedTokens, {
        'color-neutral-0': '30 30 33',
        'color-neutral-50': '32 32 36',
        'color-neutral-100': '33 33 37',
        'color-neutral-200': '43 43 46',
        'color-neutral-300': '67 67 74',
        'color-neutral-400': '86 86 95',
        'color-neutral-500': '118 118 127',
        'color-neutral-600': '166 166 175',
        'color-neutral-700': '217 217 221',
        'color-neutral-800': '233 233 236',
        'color-neutral-900': '249 249 250',
        'color-neutral-950': '252 252 253',
        'color-neutral-1000': '255 255 255'

        //'input-background-color': '42 42 46',
        //'input-border-color': 'var(--sl-color-neutral-200)'
      })
    }

    const invertedTheme = new Theme({})
    invertedTheme.#themeTokens = invertedTokens as ThemeTokens

    this.#invertedTheme = invertedTheme
    return invertedTheme
  }

  #adjustThemeTokens() {
    if (this.#themeTokens === lightThemeTokens) {
      this.#themeTokens = { ...this.#themeTokens }
    }

    const tokens = this.#themeTokens

    tokens['border-radius-small'] = '0px'
    tokens['border-radius-medium'] = '1px'
    tokens['border-radius-large'] = '2px'
    tokens['border-radius-x-large'] = '3px'

    tokens['focus-ring-color'] = 'var(--sl-color-primary-700)'
    tokens['focus-ring-width'] = '1px'
    tokens['focus-ring-alpha'] = '100%'

    tokens['input-border-color'] = 'var(--sl-color-neutral-400)'
    tokens['input-border-color-hover'] = 'var(--sl-color-neutral-600)'
    tokens['input-border-color-focus'] = 'var(--sl-color-primary-700)'

    tokens['font-size-medium'] = '0.92rem'
    tokens['font-weight-semibold'] = '600'

    tokens['font-sans'] =
      "-apple-system, BlinkMacSystemFont, 'Lato', 'Libre Sans', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'"

    // TODO!!!!
    tokens['input-placeholder-color'] = 'red'
    tokens['input-placeholder-color-disabled'] = 'var(--sl-color-neutral-700)'

    /*
    tokens['font-size-medium'] = '1rem'
    tokens['font-size-large'] = '1.3rem'
    tokens['font-size-x-large'] = '1.6rem'
    tokens['font-size-2x-large'] = '2rem'
    tokens['font-size-3x-large'] = '3.5rem'
    tokens['font-size-4x-large'] = '4rem'
*/
    Object.assign(tokens, {
      'input-height-small': '1.85rem',
      'input-height-medium': '1.95rem',
      'input-height-large': '2.5rem'
    })
  }
}

// === public functions ==============================================

function calcColorShades(
  colorName: string,
  color: Color,
  dark = false
): Record<`color-${string}-${string}`, string> {
  const ret: any = {}

  COLOR_LUMINANCES.forEach((luminance, idx) => {
    if (dark) {
      idx = 1000 - idx
    }

    ret[`color-${colorName}-${COLOR_SHADES[idx]}`] = calcColor(
      color,
      luminance
    ).join(' ')
  })

  return ret
}

function loadTheme(theme: Theme, selector?: string) {
  const elem = document.createElement('style')
  elem.append(document.createTextNode(theme.asCss(selector)))
  document.head.append(elem)

  return () => elem.remove()
}

// === themes ========================================================

// For color naming see: https://chir.ag/projects/name-that-color/#DD5A8C

const Themes = predefineThemes({
  default: { primaryColor: [40, 153, 226] },
  blue: { primaryColor: [0, 176, 255] },
  orange: { primaryColor: [255, 118, 6] },
  teal: { primaryColor: [0, 128, 128] },
  horizon: { primaryColor: [113, 217, 242] },
  bostonBlue: { primaryColor: [69, 177, 232], dangerColor: [227, 66, 52] },
  pacificBlue: { primaryColor: [227, 66, 52], dangerColor: [227, 66, 52] },
  cranberry: { primaryColor: [221, 90, 140] },
  turqoiseBlue: { primaryColor: [71, 227, 235] },
  orchid: { primaryColor: [191, 104, 189] },
  skyBlue: { primaryColor: [14, 165, 233] },
  aquamarine: { primaryColor: [127, 255, 212] },
  coral: { primaryColor: [255, 127, 80] },
  pink: { primaryColor: [210, 72, 153] },
  turquoise: { primaryColor: [64, 224, 208] }
})

// === theme helpers =================================================

function predefineThemes(
  config: Record<string, ThemeCustomizing>
): Record<string, Theme> {
  const ret: Record<string, Theme> = {}

  Object.entries(config).forEach(([name, customizing]) => {
    Object.defineProperty(ret, name, {
      configurable: true,

      get() {
        const theme = new Theme(customizing)
        Object.defineProperty(ret, name, { value: theme })
        return theme
      }
    })
  })

  return ret
}

// === color utility functions =======================================

function calcColor(color: Color, lum: number): [number, number, number] {
  let [r, g, b] = color
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

// === Shoelace original light theme =================================

const paletteColorTokens: any = {}

Object.entries(PALETTE_COLORS).forEach(([name, color]) => {
  Object.assign(paletteColorTokens, calcColorShades(name, color))
})

const lightThemeTokens = {
  // The following two custom properties will be added
  // automtically to allow features to be turned on and off
  // via CSS:
  //
  // --on: inherit
  // --off: ' '

  // used for conditional "light vs. dark" theming
  light: 'var(--on)' as 'var(--on)' | 'var(--off)',
  dark: 'var(--off)' as 'var(--on)' | 'var(--off)',

  // used for conditional label alignment (top vs. right)
  'label-alignment-above': 'var(--on)',
  'label-alignment-aside': 'var(--off)',
  'label-alignment-aside-width': '8rem',

  // TODO - optimize as color shades are already calculated
  ...calcColorShades('primary', [14, 165, 233]),
  ...calcColorShades('success', [34, 197, 94]),
  ...calcColorShades('warning', [245, 158, 11]),
  ...calcColorShades('danger', [239, 68, 68]),
  ...calcColorShades('neutral', [113, 113, 122]),

  ...paletteColorTokens,

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
  'spacing-3x-small': '0.125rem',
  'spacing-2x-small': '0.25rem',
  'spacing-x-small': '0.5rem',
  'spacing-small': '0.75rem',
  'spacing-medium': '1rem',
  'spacing-large': '1.25rem',
  'spacing-x-large': '1.75rem',
  'spacing-2x-large': '2.25rem',
  'spacing-3x-large': '3rem',
  'spacing-4x-large': '4.5rem',
  'transition-x-slow': '1000ms',
  'transition-slow': '500ms',
  'transition-medium': '250ms',
  'transition-fast': '150ms',
  'transition-x-fast': '50ms',
  'font-mono': "SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace",
  'font-sans':
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
  'font-serif': "Georgia, 'Times New Roman', serif",
  'font-size-2x-small': '0.625rem',
  'font-size-x-small': '0.75rem',
  'font-size-small': '0.875rem',
  'font-size-medium': '1rem',
  'font-size-large': '1.25rem',
  'font-size-x-large': '1.5rem',
  'font-size-2x-large': '2.25rem',
  'font-size-3x-large': '3rem',
  'font-size-4x-large': '4.5rem',
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
  'input-filled-background-color': 'var(--sl-color-neutral-100)',
  'input-filled-background-color-hover': 'var(--sl-color-neutral-100)',
  'input-filled-background-color-focus': 'var(--sl-color-neutral-0)',
  'input-filled-background-color-disabled': 'var(--sl-color-neutral-100)',
  'input-filled-color': 'var(--sl-color-neutral-800)',
  'input-filled-color-hover': 'var(--sl-color-neutral-800)',
  'input-filled-color-focus': 'var(--sl-color-neutral-700)',
  'input-filled-color-disabled': 'var(--sl-color-neutral-800)',
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
  'tooltip-padding': 'var(--sl-spacing-2x-small) var(--sl-spacing-x-small)',
  'tooltip-arrow-size': '5px',
  'tooltip-arrow-start-end-offset': '8px',
  'z-index-drawer': '700',
  'z-index-dialog': '800',
  'z-index-dropdown': '900',
  'z-index-toast': '950',
  'z-index-tooltip': '1000'
}
