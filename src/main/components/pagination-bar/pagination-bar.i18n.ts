import type { I18nFacade, TermsDefinition } from '../../i18n/i18n'

type Terms = TermsDefinition<{
  itemsXToYOfZ(
    params: {
      firstItemNo: number
      lastItemNo: number
      itemCount: number
    },
    i18n: I18nFacade
  ): string

  itemXOfY(
    params: {
      itemNo: number
      itemCount: number
    },
    i18n: I18nFacade
  ): string

  ofXPages(
    params: {
      pageCount: number
    },
    i18n: I18nFacade
  ): string

  page: string
  pageSize: string
}>

declare global {
  namespace Localize {
    interface Translations {
      'jsCockpit.paginationBar': Terms
    }
  }
}
