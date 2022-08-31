type PageSizeChangeDetail = {
  pageSize: number;
};

export interface PageSizeChangeEvent extends CustomEvent<PageSizeChangeDetail> {
  type: 'cp-page-size-change';
}
