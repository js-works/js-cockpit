type PageChangeDetail = {
  pageIndex: number
}

export interface PageChangeEvent extends CustomEvent<PageChangeDetail> {
  type: 'c-page-change'
}
