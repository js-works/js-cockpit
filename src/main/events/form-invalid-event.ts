export namespace FormInvalidEvent {
  export type Type = 'cp-form-invalid';
}

export interface FormInvalidEvent extends CustomEvent<null> {
  type: FormInvalidEvent.Type;
}

declare global {
  interface HTMLElementEventMap
    extends Record<FormInvalidEvent.Type, FormInvalidEvent> {}
}
