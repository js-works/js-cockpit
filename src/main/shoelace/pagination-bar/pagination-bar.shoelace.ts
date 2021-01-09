import { customElement, html, property, LitElement } from 'lit-element'
import { PaginationBarCore } from '../../core/pagination-bar/pagination-bar.core'

@customElement('sx-pagination-bar')
export class CustomElement extends LitElement {
  private core: PaginationBarCore

  @property()
  pageIndex: number = -1

  @property()
  pageSize: number = -1

  @property()
  totalItemCount: number = -1

  constructor() {
    super()

    this.core = new PaginationBarCore({
      refresh: () => this.requestUpdate(),
      onPageIndexChangeRequest: () => {},
      onPageSizeChageRequest: () => {},
    })

    this.core.setPageIndex(this.pageIndex)
    this.core.setPageSize(this.pageSize)
    this.core.setTotalItemCount(this.totalItemCount)
  }

  render() {
    return this.core.render()
  }
}
