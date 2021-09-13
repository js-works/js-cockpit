type RowsSelectionChangeDetail = {
  rows: Set<number>
}

export interface RowsSelectionChangeEvent
  extends CustomEvent<RowsSelectionChangeDetail> {
  type: 'c-rows-selection-change'
}
