import { component, elem, prop, setMethods, Attrs, Listener } from 'js-element'
import { html, createRef, repeat, lit, ref } from 'js-element/lit'
import { useEmitter } from 'js-element/hooks'
import { I18n } from '../../i18n/i18n'
import { useI18n } from '../../utils/hooks'

// events
import { PageChangeEvent } from '../../events/page-change-event'
import { PageSizeChangeEvent } from '../../events/page-size-change-event'

// custom elements
import SlButton from '@shoelace-style/shoelace/dist/components/button/button'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlIconButton from '@shoelace-style/shoelace/dist/components/icon-button/icon-button'
import SlInput from '@shoelace-style/shoelace/dist/components/input/input'
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select'
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item'

// styles
import paginationBarStyles from './pagination-bar.css'

// icons
import chevronDoubleLeftSvg from '../../icons/chevron-double-left.svg'
import chevronLeftSvg from '../../icons/chevron-left.svg'
import chevronRightSvg from '../../icons/chevron-right.svg'
import chevronDoubleRightSvg from '../../icons/chevron-double-right.svg'

// === exports =======================================================

export { PaginationBar }

// === constants =====================================================

const PAGE_SIZES = new Set([25, 50, 100, 250, 500])
const DEFAULT_PAGE_SIZE = 50

// === types =========================================================

type AuxData = {
  isValid: boolean
  pageIndex: number
  pageSize: number
  totalItemCount: number
  pageCount: number
  isFirstPage: boolean
  isLastPage: boolean
  firstShownItemIndex: number
  lastShownItemIndex: number
  shownItemsCount: number
}

// === translations ==================================================

declare global {
  interface I18nTranslationsMap {
    'jsCockpit.paginationBar': I18n.TermsOf<typeof translations>
  }
}

const translations = (() => {
  const i18n = I18n.localize('en')

  const translations = I18n.defineTranslations({
    category: 'jsCockpit.paginationBar',
    language: 'en',

    terms: {
      itemsXToYOfZ(params: {
        firstItemNo: number
        lastItemNo: number
        itemCount: number
      }) {
        return `${i18n.formatNumber(params.firstItemNo)} - ${i18n.formatNumber(
          params.lastItemNo
        )} / ${i18n.formatNumber(params.itemCount)}`
      },

      itemXOfY(params: { itemNo: number; itemCount: number }) {
        return `${i18n.formatNumber(params.itemNo)} - ${i18n.formatNumber(
          params.itemCount
        )}`
      },

      ofXPages(params: { pageCount: number }) {
        return `of ${i18n.formatNumber(params.pageCount)}`
      },

      page: 'Page',
      pageSize: 'Items/Page'
    }
  })

  return translations
})()

I18n.registerTranslations(translations)

// === Paginator =====================================================

@elem({
  tag: 'c-pagination-bar',
  styles: paginationBarStyles,
  impl: lit(paginationBarImpl),
  uses: [SlButton, SlIcon, SlInput, SlIconButton, SlMenuItem, SlSelect]
})
class PaginationBar extends component<{
  reset(): void
}>() {
  @prop({ attr: Attrs.number })
  pageIndex?: number

  @prop({ attr: Attrs.number })
  pageSize?: number

  @prop({ attr: Attrs.number })
  totalItemCount?: number

  @prop({ attr: Attrs.boolean })
  disabled = false

  @prop
  onPageChange?: Listener<PageChangeEvent>

  @prop
  onPageSizeChange?: Listener<PageSizeChangeEvent>
}

function paginationBarImpl(self: PaginationBar) {
  let aux: AuxData
  const { i18n, t } = useI18n('jsCockpit.paginationBar')
  const pageInputRef = createRef<SlInput>()
  const pageSizeSelectRef = createRef<SlSelect>()
  const emitPageChange = useEmitter('c-page-change', () => self.onPageChange)

  const emitPageSizeChange = useEmitter(
    'c-page-size-change',
    () => self.onPageSizeChange
  )

  const onFirstPage = () => moveToPage(0)
  const onPrevPage = () => moveToPage(aux.pageIndex - 1)
  const onNextPage = () => moveToPage(aux.pageIndex + 1)
  const onLastPage = () => moveToPage(aux.pageCount - 1)

  const onPageFieldKey = (ev: KeyboardEvent) => {
    if (ev.key !== 'Enter') {
      return
    }

    const pageNo = parseFloat(pageInputRef.value!.value)

    if (!Number.isInteger(pageNo) || pageNo < 1 || pageNo > aux.pageCount) {
      pageInputRef.value!.value = String(aux.pageIndex + 1)
      return
    }

    if (pageNo === aux.pageIndex + 1) {
      return
    }

    moveToPage(pageNo - 1)
  }

  const onPageSizeSelect = (ev: Event) => {
    const newPageSize = parseInt((ev.target as any).value)

    if (newPageSize !== aux.pageSize) {
      emitPageSizeChange({ pageSize: newPageSize })
    }
  }

  setMethods(self, {
    reset() {
      pageInputRef.value!.value = aux.isValid ? String(aux.pageIndex) : ''

      pageSizeSelectRef.value!.value = String(
        aux.isValid ? aux.pageSize : DEFAULT_PAGE_SIZE
      )
    }
  })

  function moveToPage(index: number) {
    emitPageChange({ pageIndex: index })
  }

  function render() {
    aux = getAuxData(self.pageIndex, self.pageSize, self.totalItemCount)

    return html`
      <div class="base">
        ${renderPagination()} ${renderPageSizeSelector()}
        ${renderPaginationInfo()}
      </div>
    `
  }

  function renderPagination() {
    if (!aux.isValid) {
      return null
    }

    const pageTransl = t('page')
    const ofXPagesTransl = t('ofXPages', {
      pageCount: aux.pageCount
    })

    return html`
      <div class="pagination">
        <sl-button
          type="default"
          class="nav-button"
          ?disabled=${aux.isFirstPage}
          @click=${onFirstPage}
        >
          <sl-icon src=${chevronDoubleLeftSvg}></sl-icon>
        </sl-button>
        <sl-button
          type="default"
          class="nav-button"
          ?disabled=${aux.isFirstPage}
          @click=${onPrevPage}
        >
          <sl-icon src=${chevronLeftSvg}></sl-icon>
        </sl-button>
        <div class="page-control">
          ${pageTransl}
          <sl-input
            size="small"
            value=${aux.pageIndex + 1}
            class="page-number-input"
            ?readonly=${aux.pageCount === 1}
            @keypress=${onPageFieldKey}
            ${ref(pageInputRef)}
          ></sl-input>
          ${ofXPagesTransl}
        </div>
        <sl-button
          type="default"
          class="nav-button"
          ?disabled=${aux.isLastPage}
          @click=${onNextPage}
        >
          <sl-icon src=${chevronRightSvg}></sl-icon>
        </sl-button>
        <sl-button
          type="default"
          class="nav-button"
          ?disabled=${aux.isLastPage}
          @click=${onLastPage}
        >
          <sl-icon src=${chevronDoubleRightSvg}></sl-icon>
        </sl-button>
      </div>
    `
  }

  function renderPageSizeSelector() {
    if (!aux.isValid) {
      return null
    }

    return html`
      <div class="page-size-selector">
        ${t('pageSize')}
        <sl-select
          size="small"
          value=${aux.pageSize}
          @sl-select=${onPageSizeSelect}
        >
          ${repeat(
            PAGE_SIZES,
            (idx) => idx,
            (pageSize) =>
              html`<sl-menu-item value=${pageSize}>${pageSize}</sl-menu-item>`
          )}
        </sl-select>
      </div>
    `
  }

  function renderPaginationInfo() {
    if (!aux.isValid) {
      return null
    }

    let info: String

    info = t('itemsXToYOfZ', {
      firstItemNo: aux.firstShownItemIndex,
      lastItemNo: aux.lastShownItemIndex,
      itemCount: aux.totalItemCount
    })

    return html`<div class="pagination-info">${info}</div>`
  }

  return render
}

function getAuxData(
  pageIndex: number | undefined,
  pageSize: number | undefined,
  totalItemCount: number | undefined
): AuxData {
  const isValid =
    pageIndex !== undefined &&
    !isNaN(pageIndex) &&
    isFinite(pageIndex) &&
    Math.floor(pageIndex) === pageIndex &&
    pageIndex >= 0 &&
    pageSize !== undefined &&
    !isNaN(pageSize) &&
    isFinite(pageIndex) &&
    Math.floor(pageSize) === pageSize &&
    pageSize > 0 &&
    totalItemCount !== undefined &&
    !isNaN(totalItemCount) &&
    isFinite(totalItemCount) &&
    Math.floor(totalItemCount) === totalItemCount &&
    totalItemCount >= 0 &&
    pageIndex <= Math.ceil(totalItemCount / pageSize) - 1 &&
    PAGE_SIZES.has(pageSize)

  const pageCount = !isValid ? -1 : Math.ceil(totalItemCount! / pageSize!)

  return {
    isValid,
    pageIndex: isValid ? pageIndex : -1,
    pageSize: isValid ? pageSize : -1,
    totalItemCount: isValid ? totalItemCount : -1,
    pageCount,
    isFirstPage: isValid && pageIndex === 0,
    isLastPage: isValid && pageIndex === pageCount - 1,
    firstShownItemIndex: isValid ? pageIndex * pageSize + 1 : -1,

    lastShownItemIndex: isValid
      ? pageIndex < pageCount - 1
        ? (pageIndex + 1) * pageSize
        : totalItemCount
      : -1,

    shownItemsCount: isValid
      ? pageIndex < pageCount - 1
        ? pageSize
        : totalItemCount - pageIndex * pageSize
      : -1
  }
}
