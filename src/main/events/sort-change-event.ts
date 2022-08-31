type SortChangeDetail = {
  sortField: string;
  sortDir: 'asc' | 'desc';
};

export interface SortChangeEvent extends CustomEvent<SortChangeDetail> {
  type: 'cp-sort-change';
}
