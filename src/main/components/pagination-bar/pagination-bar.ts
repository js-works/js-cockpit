import { component, elem, prop, setMethods, Attrs, Listener } from 'js-element'
import { html, createRef, repeat, lit, Ref } from 'js-element/lit'
import { useEmitter, useI18n } from '../../utils/hooks'

// events
import { PageChangeEvent } from '../events/page-change-event'

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
import { render } from 'lit'

// === exports =======================================================

export { PaginationBar }

// === constants =====================================================

const PAGE_SIZES = new Set([25, 50, 100, 250, 500])
const DEFAULT_PAGE_SIZE = 50

// === types =========================================================

// === Paginator =====================================================

@elem({
  tag: 'c-pagination-bar',
  styles: paginationBarStyles,
  uses: [SlButton, SlIcon, SlInput, SlIconButton, SlMenuItem, SlSelect],
  impl: lit(paginationBarImpl)
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
}

function paginationBarImpl(self: PaginationBar) {
  const { i18n, t } = useI18n('js-cockpit')
  const pageInputRef = createRef<SlInput>()
  const pageSizeSelectRef = createRef<SlSelect>()
  const aux = getAuxData(self.pageIndex, self.pageSize, self.totalItemCount)

  setMethods(self, {
    reset() {
      pageInputRef.value!.value = aux.isValid ? String(aux.pageIndex) : ''

      pageSizeSelectRef.value!.value = String(
        aux.isValid ? aux.pageSize : DEFAULT_PAGE_SIZE
      )
    }
  })

  function render() {
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

    const pageTransl = t('.page', 'Page')

    const ofXPagesTransl =
      aux.pageCount > 1
        ? t('.of-x-Pages', 'of {0} pages', [i18n.formatNumber(aux.pageCount)])
        : t('.of-1-Page', 'of 1 page')

    return html`
      <div class="pagination">
        <sl-button
          type="default"
          class="nav-button"
          ?disabled=${aux.isFirstPage}
        >
          <sl-icon src=${chevronDoubleLeftSvg}></sl-icon>
        </sl-button>
        <sl-button
          type="default"
          class="nav-button"
          ?disabled=${aux.isFirstPage}
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
          ></sl-input>
          ${ofXPagesTransl}
        </div>
        <sl-button
          type="default"
          class="nav-button"
          ?disabled=${aux.isLastPage}
        >
          <sl-icon src=${chevronRightSvg}></sl-icon>
        </sl-button>
        <sl-button
          type="default"
          class="nav-button"
          ?disabled=${aux.isLastPage}
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
        ${t('.page-size', 'Items/Page')}
        <sl-select size="small" value=${aux.pageSize}>
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

    const startNumberText = i18n.formatNumber(aux.firstShownItemIndex)
    const endNumberText = i18n.formatNumber(aux.lastShownItemIndex)
    const totalCountText = i18n.formatNumber(aux.totalItemCount)

    let info: String

    if (aux.shownItemsCount > 1) {
      info = t('.items-x-to-y-of-z', 'Items {0}-{1} of {2}', [
        startNumberText,
        endNumberText,
        totalCountText
      ])
    } else {
      info = t('.item-x-of-y', 'Item {0} of {1}', [
        startNumberText,
        totalCountText
      ])
    }

    return html`<div class="pagination-info">${info}</div>`
  }

  return render
}

function getAuxData(
  pageIndex: number | undefined,
  pageSize: number | undefined,
  totalItemCount: number | undefined
): {
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
} {
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
