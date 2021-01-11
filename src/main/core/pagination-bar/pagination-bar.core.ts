// external imports
import { html, VNode } from 'js-elements'

// internal imports
import { Localizer } from '../../utils/i18n'

// @ts-ignore
import paginationBarCoreStyles from './pagination-bar.core.css'

// === exports =======================================================

export { PaginationBarCore }

// === constants =====================================================

const ALLOWED_PAGE_SIZES = new Set<PageSize>([10, 25, 50, 100, 250, 500])

// === types =========================================================

type PageSize = 10 | 25 | 50 | 100 | 250 | 500

type PaginationBarProps = {
  pageIndex: number
  pageSize: number
  totalItemCount: number
  disabled: boolean
}

// === PaginationBarCore =============================================

class PaginationBarCore {
  static coreStyles = paginationBarCoreStyles

  props = {
    pageIndex: -1,
    pageSize: -1,
    totalItemCount: -1,
    disabled: false,
  }

  constructor(
    private config: {
      localizer: Localizer
      refresh(): void

      handlePageIndexChangeRequest(pageIdx: number): void
      handlePageSizeChageRequest(pageSize: number): void

      renderTextField(params: { value: string; disabled: boolean }): VNode

      renderSelectField(params: { value: number; options: Set<number> }): VNode
    }
  ) {}

  setProps(props: PaginationBarProps) {
    Object.assign(this.props, props)
    this.config.refresh()
  }

  render(): VNode {
    return this.renderPaginationBar()
  }

  // === private methods =============================================

  private propsValid() {
    return (
      this.props.pageIndex >= 0 &&
      this.props.pageSize > 0 &&
      this.props.totalItemCount >= 0
    )
  }

  private getPageCount() {
    let ret = -1

    if (this.propsValid()) {
      ret = Math.ceil(this.props.totalItemCount / this.props.pageSize)
    }

    return ret
  }

  private getFirstItemIndex() {
    return this.propsValid() ? this.props.pageIndex * this.props.pageSize : -1
  }

  private getLastItemIndex() {
    return this.propsValid()
      ? (this.props.pageIndex + 1) * this.props.pageSize - 1
      : -1
  }

  private renderPaginationBar(): VNode {
    const paginator = this.renderPaginator()
    const pageSizeSelector = this.renderPageSizeSelector()
    const paginationInfo = this.renderPaginationInfo()

    return html`
      <div class="x-paginationBar">
        ${paginator} ${pageSizeSelector} ${paginationInfo}
      </div>
    `
  }

  private renderPaginator() {
    if (!this.propsValid()) {
      return null
    }

    const loc = this.config.localizer
    const props = this.props
    const pageCount = Math.ceil(this.props.totalItemCount / this.props.pageSize)

    const btnFirst = html`
      <button
        class="x-paginationBar-moveToFirstPage"
        disabled=${props.disabled || props.pageIndex < 1}
      />
    `

    const btnPrevious = html`
      <button
        class="x-paginationBar-moveToPreviousPage"
        disabled=${props.disabled || props.pageIndex < 1}
      />
    `

    const btnNext = html`
      <button
        class="x-paginationBar-moveToNextPage"
        disabled=${props.disabled || props.pageIndex >= pageCount}
      />
    `

    const btnLast = html`
      <button
        class="x-paginationBar-moveToLastPage"
        disabled=${props.disabled || props.pageIndex >= pageCount}
      />
    `

    const pageCountStr = loc.format('number', this.getPageCount())
    //const txtPageIdx = html` <input class="x-paginationBar-pageNumberInput" /> `
    const txtPageIdx = html`
      <div class="x-paginationBar-pageInput">
        ${this.config.renderTextField({ value: 'xxx', disabled: false })}
      </div>
    `

    return html`
      <div class="x-paginationBar-paginator">
        ${btnFirst} ${btnPrevious}
        ${loc.translate('ext.paginationBar.page', null, 'Page')} ${txtPageIdx}
        ${loc.translate(
          'ext.paginationBar.ofPageCount',
          { pageCount: pageCountStr },
          'of %{pageCount}'
        )}
        ${btnNext} ${btnLast}
      </div>
    `
  }

  private renderPageSizeSelector() {
    const loc = this.config.localizer
    const options: VNode[] = []

    for (const size of ALLOWED_PAGE_SIZES.values()) {
      options.push(html`<sl-menu-item value=${size}>${size}</sl-menu-item>`)
    }

    const selectBox = html`
      <div class="x-paginationBar-pageSizeSelector">
        ${loc.translate('ext.paginationBar.pageSize', null, 'Page size')}
        ${this.config.renderSelectField({
          value: this.props.pageSize,
          options: ALLOWED_PAGE_SIZES,
        })}
      </div>
    `

    return selectBox
  }

  private renderPaginationInfo() {
    if (!this.propsValid()) {
      return null
    }

    const loc = this.config.localizer
    const firstItemNumber = loc.format('number', this.getFirstItemIndex() + 1)
    const lastItemNumber = loc.format('number', this.getLastItemIndex() + 1)
    const totalItemCount = loc.format('number', this.props.totalItemCount)

    const info = loc.translate(
      'ext.paginationBar.paginationInfo',
      {
        firstItemNumber,
        lastItemNumber,
        totalItemCount,
      },

      '%{firstItemNumber} - %{lastItemNumber} / %{totalItemCount}'
    )

    return html`
      <div class="x-paginationBar-paginationInfo">
        ${info}
      </div>
    `
  }
}
