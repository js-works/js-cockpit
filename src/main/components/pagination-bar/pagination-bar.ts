// external imports
import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, createRef, repeat, withLit, Ref } from 'js-element/lit'
import { useI18n } from '../../utils/hooks'

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

// === Paginator =====================================================

@elem({
  tag: 'jsc-pagination-bar',
  styles: paginationBarStyles,
  uses: [SlButton, SlIcon, SlInput, SlIconButton, SlMenuItem, SlSelect],
  impl: withLit(paginationBarImpl)
})
class PaginationBar extends component<{
  reset(): void
}>() {
  @prop({ attr: Attrs.number })
  pageIndex = 0

  @prop({ attr: Attrs.number })
  pageSize = DEFAULT_PAGE_SIZE

  @prop({ attr: Attrs.number })
  totalItemCount = -1

  @prop({ attr: Attrs.boolean })
  disabled = false
}

function paginationBarImpl(self: PaginationBar) {
  const { i18n, t } = useI18n('jsc')
  const pageInputRef = createRef<SlInput>()
  const pageSizeSelectRef = createRef<SlSelect>()

  setMethods(self, {
    reset() {
      pageInputRef.value!.value = String(self.pageIndex ?? 1)

      pageSizeSelectRef.value!.value = String(
        self.pageSize || DEFAULT_PAGE_SIZE
      )
    }
  })

  function renderPagination() {
    return html`
      <div class="pagination">
        <sl-button type="default" size="medium" class="nav-button">
          <sl-icon src=${chevronDoubleLeftSvg}></sl-icon>
        </sl-button>
        <sl-button type="default" size="medium" class="nav-button">
          <sl-icon src=${chevronLeftSvg}></sl-icon>
        </sl-button>
        <div class="page-control">
          ${t('page', 'Page')}
          <sl-input
            size="small"
            value=${self.pageIndex + 1}
            class="page-number-input"
          ></sl-input>
          ${t('ofPages', [i18n.formatNumber(12)], 'of {0} pages')}
        </div>
        <sl-button type="default" size="medium" class="nav-button">
          <sl-icon src=${chevronRightSvg}></sl-icon>
        </sl-button>
        <sl-button type="default" size="medium" class="nav-button">
          <sl-icon src=${chevronDoubleRightSvg}></sl-icon>
        </sl-button>
      </div>
    `
  }

  function renderPageSizeSelector() {
    return html`
      <div class="page-size-selector">
        ${t('pageSize', 'Items/Page')}
        <sl-select size="small" value=${self.pageSize}>
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
    const info = t(
      '.pagination-info',
      [i18n.formatNumber(1), i18n.formatNumber(200), i18n.formatNumber(1346)],
      'Items {0}-{1} of {2}'
    )

    return html`<div class="pagination-info">${info}</div>`
  }

  return () => html`
    <div class="base">
      ${renderPagination()} ${renderPageSizeSelector()}
      ${renderPaginationInfo()}
    </div>
  `
}
