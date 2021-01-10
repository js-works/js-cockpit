export class Localizer {
  static default = new Localizer(translate, format)

  constructor(
    public translate: (
      name: string,
      replacements: Record<string, any> | null,
      defaultText?: string
    ) => string,

    public format: (type: string, value: any, defaultResult?: string) => string
  ) {}
}

function translate(
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

function format(type: string, value: any, defaultValue?: string): string {
  let ret = typeof defaultValue === 'string' ? defaultValue : ''

  switch (type) {
    case 'number':
      return typeof value === 'number'
        ? value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        : ''
  }

  return ret
}
