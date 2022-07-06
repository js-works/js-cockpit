import type { Localizer, Translations } from '../../i18n/i18n'

type Terms = Translations<{
  'jsCockpit.paginationBar': {
    itemsXToYOfZ(
      params: {
        firstItemNo: number
        lastItemNo: number
        itemCount: number
      },
      i18n: Localizer
    ): string

    itemXOfY(
      params: {
        itemNo: number
        itemCount: number
      },
      i18n: Localizer
    ): string

    ofXPages(
      params: {
        pageCount: number
      },
      i18n: Localizer
    ): string

    page: string
    pageSize: string
  }
}>

declare global {
  namespace Localize {
    interface Translations extends Terms {}
  }
}
