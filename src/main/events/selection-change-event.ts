type SelectionChangeDetail = {
  selection: Set<number>;
};

export interface SelectionChangeEvent
  extends CustomEvent<SelectionChangeDetail> {
  type: 'cp-selection-change';
}
