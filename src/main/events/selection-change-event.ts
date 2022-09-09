export namespace SelectionChangeEvent {
  export type Type = 'cp-selection-change';

  export interface Detail {
    selection: Set<number>;
  }
}

export interface SelectionChangeEvent
  extends CustomEvent<SelectionChangeEvent.Detail> {
  type: SelectionChangeEvent.Type;
}

declare global {
  interface HTMLElementEventMap
    extends Record<SelectionChangeEvent.Type, SelectionChangeEvent> {}
}
