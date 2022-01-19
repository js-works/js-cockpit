type PageSizeChangeDetail = {
  pageSize: number
}

export interface PageSizeChangeEvent extends CustomEvent<PageSizeChangeDetail> {
  type: 'c-page-size-change'
}
