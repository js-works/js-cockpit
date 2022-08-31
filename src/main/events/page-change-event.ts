type PageChangeDetail = {
  pageIndex: number;
};

export interface PageChangeEvent extends CustomEvent<PageChangeDetail> {
  type: 'cp-page-change';
}
