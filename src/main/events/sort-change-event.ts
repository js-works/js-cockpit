export namespace SortChangeEvent {
  export type Type = 'cp-sort-change';
  export type SortDir = 'asc' | 'desc';

  export interface Detail {
    sortField: string;
    sortDir: SortDir;
  }
}

export interface SortChangeEvent extends CustomEvent<SortChangeEvent.Detail> {
  type: SortChangeEvent.Type;
}

declare global {
  interface HTMLElementEventMap
    extends Record<SortChangeEvent.Type, SortChangeEvent> {}
}
