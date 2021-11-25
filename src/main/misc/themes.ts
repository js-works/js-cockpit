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

const SEMANTIC_COLORS = [
  'primary',
  'success',
  'info',
  'warning',
  'danger'
] as const

const PALETTE_COLORS = [
  'amber',
  'blue',
  'blue-gray',
  'cool-gray',
  'cyan',
  'danger',
  'emerald',
  'fuchsia',
  'gray',
  'green',
  'indigo',
  'lime',
  'neutral',
  'orange',
  'pink',
  'purple',
  'red',
  'rose',
  'sky',
  'success',
  'teal',
  'true-gray',
  'violet',
  'warm-gray',
  'yellow'
] as const

const ALL_COLORS = new Set([...SEMANTIC_COLORS, ...PALETTE_COLORS])

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

    for (const semanticColor of SEMANTIC_COLORS) {
      const colorHex = customizing[`${semanticColor}Color`]

      if (colorHex) {
        Object.assign(tokens, {
          ...Theme.#calcColorShades(semanticColor, colorHex)
        })
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

    ALL_COLORS.forEach((color) => {
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
        'color-neutral-0': 'rgb(30 30 33)',
        'color-neutral-50': 'rgb(32 32 36)',
        'color-neutral-100': 'rgb(33 33 37)',
        'color-neutral-200': 'rgb(43 43 46)',
        'color-neutral-300': 'rgb(67 67 74)',
        'color-neutral-400': 'rgb(86 86 95)',
        'color-neutral-500': 'rgb(118 118 127)',
        'color-neutral-600': 'rgb(166 166 175)',
        'color-neutral-700': 'rgb(217 217 221)',
        'color-neutral-800': 'rgb(233 233 236)',
        'color-neutral-900': 'rgb(249 249 250)',
        'color-neutral-950': 'rgb(252 252 253)',
        'color-neutral-1000': 'rgb(255 255 255)'

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

    //tokens['focus-ring-color'] = 'var(--sl-color-primary-700)'
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
    //tokens['input-placeholder-color'] = 'red'
    //tokens['input-placeholder-color-disabled'] = 'var(--sl-color-neutral-700)'

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

  static #calcColorShades(
    colorName: string,
    colorHex: string,
    dark = false
  ): Record<`color-${string}-${string}`, string> {
    const ret: any = {}

    COLOR_LUMINANCES.forEach((luminance, idx) => {
      if (dark) {
        idx = 1000 - idx
      }

      ret[`color-${colorName}-${COLOR_SHADES[idx]}`] =
        'rgb(' + calcColor(colorHex, luminance).join(' ') + ')'
    })

    return ret
  }
}

// === public functions ==============================================

function loadTheme(theme: Theme, selector?: string) {
  const elem = document.createElement('style')
  elem.append(document.createTextNode(theme.asCss(selector)))
  document.head.append(elem)

  return () => elem.remove()
}

// === themes ========================================================

// For color naming see: https://chir.ag/projects/name-that-color/#DD5A8C

const Themes = predefineThemes({
  default: {
    primaryColor: '#2899e2'
    //primaryColor: '#0077cB'
  },

  blue: {
    primaryColor: '#00B0FF'
  },

  orange: {
    primaryColor: '#ff7606'
  },

  teal: {
    primaryColor: '#008080'
  },

  // Error colors
  // #FFA6C9
  // #F77703
  // #FF6B53

  horizon: {
    primaryColor: '#71d9f2'
  },

  bostonBlue: {
    primaryColor: '#45B1E8',
    dangerColor: '#E34234'
  },

  pacificBlue: {
    primaryColor: '#0E94BB',
    dangerColor: '#E34234'
  },

  cranberry: {
    primaryColor: '#DD5A8C'
  },

  turqoiseBlue: {
    primaryColor: '#47E3EB'
  },

  orchid: {
    primaryColor: '#BF68BD'
  },

  temp: {
    primaryColor: '#00586B'
    //primaryColor: '#2889e2' // baseui based
    //primaryColor: '#3366e2' // baseui based
    //primaryColor: '#3366cc' // baseui
    //primaryColor: '#0078d4' // fluentui
    //primaryColor: '#6595c4' // industrial

    //primaryColor: '#76D7EA' // +
    // primaryColor: '#6595c4' // bluish
    // primaryColor: '#c71d7c' // pink++
    //primaryColor: '#f2704e' // coral?
    //primaryColor: '#40a6ff' //
    //primaryColor: '#c05c5c' // indian red 2
    //primaryColor: '#8b008b' // +
    //primaryColor: '#b22222' //
    //primaryColor: '#cd5c5c' // indian red
    //primaryColor: '#00bbff' // default?
    //primaryColor: '#cd5c5c' //
    //primaryColor: '#a9ddff' //
    //primaryColor: '#dd1493' //
    //primaryColor: '#7FFFD4' // aquamarine
    //primaryColor: '#00FFFF' // aqua?
    //primaryColor: '#008B8B' // cyan
    //primaryColor: '#00CED1' // dark turquoise
    //primaryColor: '#008000' // green
    //primaryColor: '#008080' // teal
    //primaryColor: '#800080' // purple
    //primaryColor: '#DA70D6' // orchid ++
    //primaryColor: '#C71585' // violet red
    //primaryColor: '#BA55D3' // orchid
    //primaryColor: '#66CDAA' // aquamarine
    //primaryColor: '#FF69B4' // +
    //primaryColor: '#00BFFF' // sky blue
    //primaryColor: '#FF7F50' // coral
    //primaryColor: '#7EC0EE' //
    //primaryColor: '#F660AB' //
    //primaryColor: '#00bbff' //
    //primaryColor: '#9c36b5' //
    //primaryColor: '#4F84C4' // +
    //primaryColor: '#EA7E5D' // -
    //primaryColor: '#008b8b' // +
    //primaryColor: '#00bfff' //
    //primaryColor: '#5f9ea0' //
    //primaryColor: '#ff8c00' //
  },

  skyBlue: {
    primaryColor: '#0EA5E9'
  },

  aquamarine: {
    primaryColor: '#7FFFD4'
  },

  coral: {
    primaryColor: '#ff7f50'
  },

  pink: {
    primaryColor: '#d24899'
  },

  turquoise: {
    primaryColor: '#40e0d0'
  }
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

// === Shoelace original light theme =================================

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

  /*
   * Color Primitives
   */

  /* Gray */
  'color-gray-50': 'hsl(0 0% 97.5%)',
  'color-gray-100': 'hsl(240 4.8% 95.9%)',
  'color-gray-200': 'hsl(240 5.9% 90%)',
  'color-gray-300': 'hsl(240 4.9% 83.9%)',
  'color-gray-400': 'hsl(240 5% 64.9%)',
  'color-gray-500': 'hsl(240 3.8% 46.1%)',
  'color-gray-600': 'hsl(240 5.2% 33.9%)',
  'color-gray-700': 'hsl(240 5.3% 26.1%)',
  'color-gray-800': 'hsl(240 3.7% 15.9%)',
  'color-gray-900': 'hsl(240 5.9% 10%)',
  'color-gray-950': 'hsl(240 7.3% 8%)',

  /* Red */
  'color-red-50': 'hsl(0 85.7% 97.3%)',
  'color-red-100': 'hsl(0 93.3% 94.1%)',
  'color-red-200': 'hsl(0 96.3% 89.4%)',
  'color-red-300': 'hsl(0 93.5% 81.8%)',
  'color-red-400': 'hsl(0 90.6% 70.8%)',
  'color-red-500': 'hsl(0 84.2% 60.2%)',
  'color-red-600': 'hsl(0 72.2% 50.6%)',
  'color-red-700': 'hsl(0 73.7% 41.8%)',
  'color-red-800': 'hsl(0 70% 35.3%)',
  'color-red-900': 'hsl(0 62.8% 30.6%)',
  'color-red-950': 'hsl(0 60% 19.6%)',

  /* Orange */
  'color-orange-50': 'hsl(33.3 100% 96.5%)',
  'color-orange-100': 'hsl(34.3 100% 91.8%)',
  'color-orange-200': 'hsl(32.1 97.7% 83.1%)',
  'color-orange-300': 'hsl(30.7 97.2% 72.4%)',
  'color-orange-400': 'hsl(27 96% 61%)',
  'color-orange-500': 'hsl(24.6 95% 53.1%)',
  'color-orange-600': 'hsl(20.5 90.2% 48.2%)',
  'color-orange-700': 'hsl(17.5 88.3% 40.4%)',
  'color-orange-800': 'hsl(15 79.1% 33.7%)',
  'color-orange-900': 'hsl(15.3 74.6% 27.8%)',
  'color-orange-950': 'hsl(15.2 69.1% 19%)',

  /* Amber */
  'color-amber-50': 'hsl(48 100% 96.1%)',
  'color-amber-100': 'hsl(48 96.5% 88.8%)',
  'color-amber-200': 'hsl(48 96.6% 76.7%)',
  'color-amber-300': 'hsl(45.9 96.7% 64.5%)',
  'color-amber-400': 'hsl(43.3 96.4% 56.3%)',
  'color-amber-500': 'hsl(37.7 92.1% 50.2%)',
  'color-amber-600': 'hsl(32.1 94.6% 43.7%)',
  'color-amber-700': 'hsl(26 90.5% 37.1%)',
  'color-amber-800': 'hsl(22.7 82.5% 31.4%)',
  'color-amber-900': 'hsl(21.7 77.8% 26.5%)',
  'color-amber-950': 'hsl(22.9 74.1% 16.7%)',

  /* Yellow */
  'color-yellow-50': 'hsl(54.5 91.7% 95.3%)',
  'color-yellow-100': 'hsl(54.9 96.7% 88%)',
  'color-yellow-200': 'hsl(52.8 98.3% 76.9%)',
  'color-yellow-300': 'hsl(50.4 97.8% 63.5%)',
  'color-yellow-400': 'hsl(47.9 95.8% 53.1%)',
  'color-yellow-500': 'hsl(45.4 93.4% 47.5%)',
  'color-yellow-600': 'hsl(40.6 96.1% 40.4%)',
  'color-yellow-700': 'hsl(35.5 91.7% 32.9%)',
  'color-yellow-800': 'hsl(31.8 81% 28.8%)',
  'color-yellow-900': 'hsl(28.4 72.5% 25.7%)',
  'color-yellow-950': 'hsl(33.1 69% 13.9%)',

  /* Lime */
  'color-lime-50': 'hsl(78.3 92% 95.1%)',
  'color-lime-100': 'hsl(79.6 89.1% 89.2%)',
  'color-lime-200': 'hsl(80.9 88.5% 79.6%)',
  'color-lime-300': 'hsl(82 84.5% 67.1%)',
  'color-lime-400': 'hsl(82.7 78% 55.5%)',
  'color-lime-500': 'hsl(83.7 80.5% 44.3%)',
  'color-lime-600': 'hsl(84.8 85.2% 34.5%)',
  'color-lime-700': 'hsl(85.9 78.4% 27.3%)',
  'color-lime-800': 'hsl(86.3 69% 22.7%)',
  'color-lime-900': 'hsl(87.6 61.2% 20.2%)',
  'color-lime-950': 'hsl(86.5 60.6% 13.9%)',

  /* Green */
  'color-green-50': 'hsl(138.5 76.5% 96.7%)',
  'color-green-100': 'hsl(140.6 84.2% 92.5%)',
  'color-green-200': 'hsl(141 78.9% 85.1%)',
  'color-green-300': 'hsl(141.7 76.6% 73.1%)',
  'color-green-400': 'hsl(141.9 69.2% 58%)',
  'color-green-500': 'hsl(142.1 70.6% 45.3%)',
  'color-green-600': 'hsl(142.1 76.2% 36.3%)',
  'color-green-700': 'hsl(142.4 71.8% 29.2%)',
  'color-green-800': 'hsl(142.8 64.2% 24.1%)',
  'color-green-900': 'hsl(143.8 61.2% 20.2%)',
  'color-green-950': 'hsl(144.3 60.7% 12%)',

  /* Emerald */
  'color-emerald-50': 'hsl(151.8 81% 95.9%)',
  'color-emerald-100': 'hsl(149.3 80.4% 90%)',
  'color-emerald-200': 'hsl(152.4 76% 80.4%)',
  'color-emerald-300': 'hsl(156.2 71.6% 66.9%)',
  'color-emerald-400': 'hsl(158.1 64.4% 51.6%)',
  'color-emerald-500': 'hsl(160.1 84.1% 39.4%)',
  'color-emerald-600': 'hsl(161.4 93.5% 30.4%)',
  'color-emerald-700': 'hsl(162.9 93.5% 24.3%)',
  'color-emerald-800': 'hsl(163.1 88.1% 19.8%)',
  'color-emerald-900': 'hsl(164.2 85.7% 16.5%)',
  'color-emerald-950': 'hsl(164.3 87.5% 9.4%)',

  /* Teal */
  'color-teal-50': 'hsl(166.2 76.5% 96.7%)',
  'color-teal-100': 'hsl(167.2 85.5% 89.2%)',
  'color-teal-200': 'hsl(168.4 83.8% 78.2%)',
  'color-teal-300': 'hsl(170.6 76.9% 64.3%)',
  'color-teal-400': 'hsl(172.5 66% 50.4%)',
  'color-teal-500': 'hsl(173.4 80.4% 40%)',
  'color-teal-600': 'hsl(174.7 83.9% 31.6%)',
  'color-teal-700': 'hsl(175.3 77.4% 26.1%)',
  'color-teal-800': 'hsl(176.1 69.4% 21.8%)',
  'color-teal-900': 'hsl(175.9 60.8% 19%)',
  'color-teal-950': 'hsl(176.5 58.6% 11.4%)',

  /* Cyan */
  'color-cyan-50': 'hsl(183.2 100% 96.3%)',
  'color-cyan-100': 'hsl(185.1 95.9% 90.4%)',
  'color-cyan-200': 'hsl(186.2 93.5% 81.8%)',
  'color-cyan-300': 'hsl(187 92.4% 69%)',
  'color-cyan-400': 'hsl(187.9 85.7% 53.3%)',
  'color-cyan-500': 'hsl(188.7 94.5% 42.7%)',
  'color-cyan-600': 'hsl(191.6 91.4% 36.5%)',
  'color-cyan-700': 'hsl(192.9 82.3% 31%)',
  'color-cyan-800': 'hsl(194.4 69.6% 27.1%)',
  'color-cyan-900': 'hsl(196.4 63.6% 23.7%)',
  'color-cyan-950': 'hsl(196.8 61% 16.1%)',

  /* Sky */
  'color-sky-50': 'hsl(204 100% 97.1%)',
  'color-sky-100': 'hsl(204 93.8% 93.7%)',
  'color-sky-200': 'hsl(200.6 94.4% 86.1%)',
  'color-sky-300': 'hsl(199.4 95.5% 73.9%)',
  'color-sky-400': 'hsl(198.4 93.2% 59.6%)',
  'color-sky-500': 'hsl(198.6 88.7% 48.4%)',
  'color-sky-600': 'hsl(200.4 98% 39.4%)',
  'color-sky-700': 'hsl(201.3 96.3% 32.2%)',
  'color-sky-800': 'hsl(201 90% 27.5%)',
  'color-sky-900': 'hsl(202 80.3% 23.9%)',
  'color-sky-950': 'hsl(202.3 73.8% 16.5%)',

  /* Blue */
  'color-blue-50': 'hsl(213.8 100% 96.9%)',
  'color-blue-100': 'hsl(214.3 94.6% 92.7%)',
  'color-blue-200': 'hsl(213.3 96.9% 87.3%)',
  'color-blue-300': 'hsl(211.7 96.4% 78.4%)',
  'color-blue-400': 'hsl(213.1 93.9% 67.8%)',
  'color-blue-500': 'hsl(217.2 91.2% 59.8%)',
  'color-blue-600': 'hsl(221.2 83.2% 53.3%)',
  'color-blue-700': 'hsl(224.3 76.3% 48%)',
  'color-blue-800': 'hsl(225.9 70.7% 40.2%)',
  'color-blue-900': 'hsl(224.4 64.3% 32.9%)',
  'color-blue-950': 'hsl(226.2 55.3% 18.4%)',

  /* Indigo */
  'color-indigo-50': 'hsl(225.9 100% 96.7%)',
  'color-indigo-100': 'hsl(226.5 100% 93.9%)',
  'color-indigo-200': 'hsl(228 96.5% 88.8%)',
  'color-indigo-300': 'hsl(229.7 93.5% 81.8%)',
  'color-indigo-400': 'hsl(234.5 89.5% 73.9%)',
  'color-indigo-500': 'hsl(238.7 83.5% 66.7%)',
  'color-indigo-600': 'hsl(243.4 75.4% 58.6%)',
  'color-indigo-700': 'hsl(244.5 57.9% 50.6%)',
  'color-indigo-800': 'hsl(243.7 54.5% 41.4%)',
  'color-indigo-900': 'hsl(242.2 47.4% 34.3%)',
  'color-indigo-950': 'hsl(243.5 43.6% 22.9%)',

  /* Violet */
  'color-violet-50': 'hsl(250 100% 97.6%)',
  'color-violet-100': 'hsl(251.4 91.3% 95.5%)',
  'color-violet-200': 'hsl(250.5 95.2% 91.8%)',
  'color-violet-300': 'hsl(252.5 94.7% 85.1%)',
  'color-violet-400': 'hsl(255.1 91.7% 76.3%)',
  'color-violet-500': 'hsl(258.3 89.5% 66.3%)',
  'color-violet-600': 'hsl(262.1 83.3% 57.8%)',
  'color-violet-700': 'hsl(263.4 70% 50.4%)',
  'color-violet-800': 'hsl(263.4 69.3% 42.2%)',
  'color-violet-900': 'hsl(263.5 67.4% 34.9%)',
  'color-violet-950': 'hsl(265.1 61.5% 21.4%)',

  /* Purple */
  'color-purple-50': 'hsl(270 100% 98%)',
  'color-purple-100': 'hsl(268.7 100% 95.5%)',
  'color-purple-200': 'hsl(268.6 100% 91.8%)',
  'color-purple-300': 'hsl(269.2 97.4% 85.1%)',
  'color-purple-400': 'hsl(270 95.2% 75.3%)',
  'color-purple-500': 'hsl(270.7 91% 65.1%)',
  'color-purple-600': 'hsl(271.5 81.3% 55.9%)',
  'color-purple-700': 'hsl(272.1 71.7% 47.1%)',
  'color-purple-800': 'hsl(272.9 67.2% 39.4%)',
  'color-purple-900': 'hsl(273.6 65.6% 32%)',
  'color-purple-950': 'hsl(276 59.5% 16.5%)',

  /* Fuchsia */
  'color-fuchsia-50': 'hsl(289.1 100% 97.8%)',
  'color-fuchsia-100': 'hsl(287 100% 95.5%)',
  'color-fuchsia-200': 'hsl(288.3 95.8% 90.6%)',
  'color-fuchsia-300': 'hsl(291.1 93.1% 82.9%)',
  'color-fuchsia-400': 'hsl(292 91.4% 72.5%)',
  'color-fuchsia-500': 'hsl(292.2 84.1% 60.6%)',
  'color-fuchsia-600': 'hsl(293.4 69.5% 48.8%)',
  'color-fuchsia-700': 'hsl(294.7 72.4% 39.8%)',
  'color-fuchsia-800': 'hsl(295.4 70.2% 32.9%)',
  'color-fuchsia-900': 'hsl(296.7 63.6% 28%)',
  'color-fuchsia-950': 'hsl(297.1 56.8% 14.5%)',

  /* Pink */
  'color-pink-50': 'hsl(327.3 73.3% 97.1%)',
  'color-pink-100': 'hsl(325.7 77.8% 94.7%)',
  'color-pink-200': 'hsl(325.9 84.6% 89.8%)',
  'color-pink-300': 'hsl(327.4 87.1% 81.8%)',
  'color-pink-400': 'hsl(328.6 85.5% 70.2%)',
  'color-pink-500': 'hsl(330.4 81.2% 60.4%)',
  'color-pink-600': 'hsl(333.3 71.4% 50.6%)',
  'color-pink-700': 'hsl(335.1 77.6% 42%)',
  'color-pink-800': 'hsl(335.8 74.4% 35.3%)',
  'color-pink-900': 'hsl(335.9 69% 30.4%)',
  'color-pink-950': 'hsl(336.2 65.4% 15.9%)',

  /* Rose */
  'color-rose-50': 'hsl(355.7 100% 97.3%)',
  'color-rose-100': 'hsl(355.6 100% 94.7%)',
  'color-rose-200': 'hsl(352.7 96.1% 90%)',
  'color-rose-300': 'hsl(352.6 95.7% 81.8%)',
  'color-rose-400': 'hsl(351.3 94.5% 71.4%)',
  'color-rose-500': 'hsl(349.7 89.2% 60.2%)',
  'color-rose-600': 'hsl(346.8 77.2% 49.8%)',
  'color-rose-700': 'hsl(345.3 82.7% 40.8%)',
  'color-rose-800': 'hsl(343.4 79.7% 34.7%)',
  'color-rose-900': 'hsl(341.5 75.5% 30.4%)',
  'color-rose-950': 'hsl(341.3 70.1% 17.1%)',

  /*
   * Theme Tokens
   */

  /* Primary */
  'color-primary-50': 'var(--sl-color-sky-50)',
  'color-primary-100': 'var(--sl-color-sky-100)',
  'color-primary-200': 'var(--sl-color-sky-200)',
  'color-primary-300': 'var(--sl-color-sky-300)',
  'color-primary-400': 'var(--sl-color-sky-400)',
  'color-primary-500': 'var(--sl-color-sky-500)',
  'color-primary-600': 'var(--sl-color-sky-600)',
  'color-primary-700': 'var(--sl-color-sky-700)',
  'color-primary-800': 'var(--sl-color-sky-800)',
  'color-primary-900': 'var(--sl-color-sky-900)',
  'color-primary-950': 'var(--sl-color-sky-950)',

  /* Success */
  'color-success-50': 'var(--sl-color-green-50)',
  'color-success-100': 'var(--sl-color-green-100)',
  'color-success-200': 'var(--sl-color-green-200)',
  'color-success-300': 'var(--sl-color-green-300)',
  'color-success-400': 'var(--sl-color-green-400)',
  'color-success-500': 'var(--sl-color-green-500)',
  'color-success-600': 'var(--sl-color-green-600)',
  'color-success-700': 'var(--sl-color-green-700)',
  'color-success-800': 'var(--sl-color-green-800)',
  'color-success-900': 'var(--sl-color-green-900)',
  'color-success-950': 'var(--sl-color-green-950)',

  /* Warning */
  'color-warning-50': 'var(--sl-color-amber-50)',
  'color-warning-100': 'var(--sl-color-amber-100)',
  'color-warning-200': 'var(--sl-color-amber-200)',
  'color-warning-300': 'var(--sl-color-amber-300)',
  'color-warning-400': 'var(--sl-color-amber-400)',
  'color-warning-500': 'var(--sl-color-amber-500)',
  'color-warning-600': 'var(--sl-color-amber-600)',
  'color-warning-700': 'var(--sl-color-amber-700)',
  'color-warning-800': 'var(--sl-color-amber-800)',
  'color-warning-900': 'var(--sl-color-amber-900)',
  'color-warning-950': 'var(--sl-color-amber-950)',

  /* Danger */
  'color-danger-50': 'var(--sl-color-red-50)',
  'color-danger-100': 'var(--sl-color-red-100)',
  'color-danger-200': 'var(--sl-color-red-200)',
  'color-danger-300': 'var(--sl-color-red-300)',
  'color-danger-400': 'var(--sl-color-red-400)',
  'color-danger-500': 'var(--sl-color-red-500)',
  'color-danger-600': 'var(--sl-color-red-600)',
  'color-danger-700': 'var(--sl-color-red-700)',
  'color-danger-800': 'var(--sl-color-red-800)',
  'color-danger-900': 'var(--sl-color-red-900)',
  'color-danger-950': 'var(--sl-color-red-950)',

  /* Neutral */
  'color-neutral-50': 'var(--sl-color-gray-50)',
  'color-neutral-100': 'var(--sl-color-gray-100)',
  'color-neutral-200': 'var(--sl-color-gray-200)',
  'color-neutral-300': 'var(--sl-color-gray-300)',
  'color-neutral-400': 'var(--sl-color-gray-400)',
  'color-neutral-500': 'var(--sl-color-gray-500)',
  'color-neutral-600': 'var(--sl-color-gray-600)',
  'color-neutral-700': 'var(--sl-color-gray-700)',
  'color-neutral-800': 'var(--sl-color-gray-800)',
  'color-neutral-900': 'var(--sl-color-gray-900)',
  'color-neutral-950': 'var(--sl-color-gray-950)',

  /* Neutral one-offs */
  'color-neutral-0': 'hsl(0, 0%, 100%)',
  'color-neutral-1000': 'hsl(0, 0%, 0%)',

  /*
   * Border radii
   */

  'border-radius-small': '0.1875rem' /* 3px */,
  'border-radius-medium': '0.25rem' /* 4px */,
  'border-radius-large': '0.5rem' /* 8px */,
  'border-radius-x-large': '1rem' /* 16px */,

  'border-radius-circle': '50%',
  'border-radius-pill': '9999px',

  /*
   * Elevations
   */

  'shadow-x-small': '0 1px 2px hsl(240 3.8% 46.1% / 6%)',
  'shadow-small': '0 1px 2px hsl(240 3.8% 46.1% / 12%)',
  'shadow-medium': '0 2px 4px hsl(240 3.8% 46.1% / 12%)',
  'shadow-large': '0 2px 8px hsl(240 3.8% 46.1% / 12%)',
  'shadow-x-large': '0 4px 16px hsl(240 3.8% 46.1% / 12%)',

  /*
   * Spacings
   */

  'spacing-3x-small': '0.125rem' /* 2px */,
  'spacing-2x-small': '0.25rem' /* 4px */,
  'spacing-x-small': '0.5rem' /* 8px */,
  'spacing-small': '0.75rem' /* 12px */,
  'spacing-medium': '1rem' /* 16px */,
  'spacing-large': '1.25rem' /* 20px */,
  'spacing-x-large': '1.75rem' /* 28px */,
  'spacing-2x-large': '2.25rem' /* 36px */,
  'spacing-3x-large': '3rem' /* 48px */,
  'spacing-4x-large': '4.5rem' /* 72px */,

  /*
   * Transitions
   */

  'transition-x-slow': '1000ms',
  'transition-slow': '500ms',
  'transition-medium': '250ms',
  'transition-fast': '150ms',
  'transition-x-fast': '50ms',

  /*
   * Typography
   */

  /* Fonts */
  'font-mono': "SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace",
  'font-sans':
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif," +
    "Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
  'font-serif': "Georgia, 'Times New Roman', serif",

  /* Font sizes */
  'font-size-2x-small': '0.625rem' /* 10px */,
  'font-size-x-small': '0.75rem' /* 12px */,
  'font-size-small': '0.875rem' /* 14px */,
  'font-size-medium': '1rem' /* 16px */,
  'font-size-large': '1.25rem' /* 20px */,
  'font-size-x-large': '1.5rem' /* 24px */,
  'font-size-2x-large': '2.25rem' /* 36px */,
  'font-size-3x-large': '3rem' /* 48px */,
  'font-size-4x-large': '4.5rem' /* 72px */,

  /* Font weights */
  'font-weight-light': '300',
  'font-weight-normal': '400',
  'font-weight-semibold': '500',
  'font-weight-bold': '700',

  /* Letter spacings */
  'letter-spacing-denser': '-0.03em',
  'letter-spacing-dense': '-0.015em',
  'letter-spacing-normal': 'normal',
  'letter-spacing-loose': '0.075em',
  'letter-spacing-looser': '0.15em',

  /* Line heights */
  'line-height-denser': '1',
  'line-height-dense': '1.4',
  'line-height-normal': '1.8',
  'line-height-loose': '2.2',
  'line-height-looser': '2.6',

  /*
   * Forms
   */

  /* Focus rings */
  'focus-ring-alpha': '40%',
  'focus-ring-width': '3px',
  'focus-ring':
    '0 0 0 var(--sl-focus-ring-width) hsl(198.6 88.7% 48.4% / var(--sl-focus-ring-alpha))',

  /* Buttons */
  'button-font-size-small': 'var(--sl-font-size-x-small)',
  'button-font-size-medium': 'var(--sl-font-size-small)',
  'button-font-size-large': 'var(--sl-font-size-medium)',

  /* Inputs */
  'input-height-small': '1.875rem' /* 30px */,
  'input-height-medium': '2.5rem' /* 40px */,
  'input-height-large': '3.125rem' /* 50px */,

  'input-background-color': 'var(--sl-color-neutral-0)',
  'input-background-color-hover': 'var(--sl-input-background-color)',
  'input-background-color-focus': 'var(--sl-input-background-color)',
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

  /* Labels */
  'input-label-font-size-small': 'var(--sl-font-size-small)',
  'input-label-font-size-medium': 'var(--sl-font-size-medium)',
  'input-label-font-size-large': 'var(--sl-font-size-large)',

  'input-label-color': 'inherit',

  /* Help text */
  'input-help-text-font-size-small': 'var(--sl-font-size-x-small)',
  'input-help-text-font-size-medium': 'var(--sl-font-size-small)',
  'input-help-text-font-size-large': 'var(--sl-font-size-medium)',

  'input-help-text-color': 'var(--sl-color-neutral-500)',

  /* Toggles (checkboxes, radios, switches) */
  'toggle-size': '1rem',

  /*
   * Overlays
   */

  'overlay-background-color': 'hsl(240 3.8% 46.1% / 33%)',

  /*
   * Panels
   */

  'panel-background-color': 'var(--sl-color-neutral-0)',
  'panel-border-color': 'var(--sl-color-neutral-200)',
  'panel-border-width': '1px',

  /*
   * Tooltips
   */

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

  /*
   * Z-indexes
   */

  'z-index-drawer': '700',
  'z-index-dialog': '800',
  'z-index-dropdown': '900',
  'z-index-toast': '950',
  'z-index-tooltip': '1000'
}
