export interface Localizer {
  translate(
    name: string,
    replacements: Record<string, any> | null,
    defaultText?: string
  ): string

  formatNumber(value: number): string
  formatDate(value: Date): string
}
