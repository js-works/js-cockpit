export namespace ActionEvent {
  export type Type = 'cp-action';

  export interface Detail {
    action: string;
  }
}

export interface ActionEvent extends CustomEvent<ActionEvent.Detail> {
  type: ActionEvent.Type;
}

declare global {
  interface HTMLElementEventMap extends Record<ActionEvent.Type, ActionEvent> {}
}
