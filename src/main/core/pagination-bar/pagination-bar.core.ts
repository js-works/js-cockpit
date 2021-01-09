import { html, render, TemplateResult } from 'lit-html'

// @ts-ignore
import paginationBarCoreStyles from './pagination-bar.core.css'

// === exports =======================================================

export { PaginationBarCore }

// === constants =====================================================

const PAGE_SIZES = new Set<PageSize>([10, 25, 50, 100, 250, 500])

// === types =========================================================

type PageSize = 10 | 25 | 50 | 100 | 250 | 500

class PaginationBarCore {
  private disabled = false
  private pageIndex = -1
  private pageSize = -1
  private totalItemCount = -1

  constructor(
    private config: {
      refresh(): void
      onPageIndexChangeRequest(pageIdx: number): void
      onPageSizeChageRequest(pageSize: number): void
    }
  ) {}

  getBaseStyle() {
    return paginationBarCoreStyles()
  }

  setPageIndex(pageIndex: number) {
    this.pageIndex = pageIndex
  }

  setPageSize(pageSize: number) {
    this.pageSize = pageSize
  }

  setTotalItemCount(totalItemCount: number) {
    this.totalItemCount = totalItemCount
  }

  render(): TemplateResult {
    return this.renderPaginationBar()
  }

  // === private methods =============================================

  private renderPaginationBar(): TemplateResult {
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
    const btnFirst = html`
      <button>
        to first
      </button>
    `

    const btnPrevious = html`
      <button>
        to previous
      </button>
    `

    const btnNext = html`
      <button>
        to next
      </button>
    `

    const btnLast = html`
      <button>
        to last
      </button>
    `

    const txtPageIdx = html` <input class="x-paginationBar-pageIndexInput" /> `

    return html`
      <div class="x-paginationBar-paginator">
        ${btnFirst} ${btnPrevious} Page ${txtPageIdx} of 121 ${btnNext}
        ${btnLast}
      </div>
    `
  }

  private renderPageSizeSelector() {
    const options: TemplateResult[] = []

    for (const pageSize of PAGE_SIZES.keys()) {
      options.push(html`<option>${pageSize}</option>`)
    }

    const selectBox = html`
      <div>
        Page size
        <select>
          ${options}
        </select>
      </div>
    `

    return selectBox
  }

  private renderPaginationInfo() {
    return html`
      <div class="x-paginationBar-paginationInfo">
        Item 1 - 49 of 165
      </div>
    `
  }
}
