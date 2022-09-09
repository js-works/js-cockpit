export namespace PageSizeChangeEvent {
  export type Type = 'cp-page-size-change';

  export interface Detail {
    pageSize: number;
  }
}

export interface PageSizeChangeEvent
  extends CustomEvent<PageSizeChangeEvent.Detail> {
  type: PageSizeChangeEvent.Type;
}

declare global {
  interface HTMLElementEventMap
    extends Record<PageSizeChangeEvent.Type, PageSizeChangeEvent> {}
}
