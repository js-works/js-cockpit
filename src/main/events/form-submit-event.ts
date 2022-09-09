export namespace FormSubmitEvent {
  export type Type = 'cp-form-submit';

  export interface Detail {
    data: Record<string, any> | null;
  }
}

export interface FormSubmitEvent extends CustomEvent<FormSubmitEvent.Detail> {
  type: FormSubmitEvent.Type;
}

declare global {
  interface HTMLElementEventMap
    extends Record<FormSubmitEvent.Type, FormSubmitEvent> {}
}
