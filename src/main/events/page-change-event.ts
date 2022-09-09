export namespace PageChangeEvent {
  export type Type = 'cp-page-change';

  export interface Detail {
    pageIndex: number;
  }
}

export interface PageChangeEvent extends CustomEvent<PageChangeEvent.Detail> {
  type: PageChangeEvent.Type;
}

declare global {
  interface HTMLElementEventMap
    extends Record<PageChangeEvent.Type, PageChangeEvent> {}
}
