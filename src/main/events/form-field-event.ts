export namespace FormFieldEvent {
  export type Type = 'cp-form-field';

  export type SignalType =
    | 'focus'
    | 'blur'
    | 'input'
    | 'change'
    | 'submit'
    | 'cancel';

  export interface Detail<T = unknown> {
    element: HTMLElement;
    getName: () => string;
    getValue: () => T;
    validate: () => string | null;
    setErrorMsg: (msg: string | null) => void;
    setSendSignal: (sendSignal: (type: SignalType) => void) => void;
  }
}

export interface FormFieldEvent<T = unknown>
  extends CustomEvent<FormFieldEvent.Detail<T>> {
  type: FormFieldEvent.Type;
}

declare global {
  interface HTMLElementEventMap
    extends Record<FormFieldEvent.Type, FormFieldEvent> {}
}
