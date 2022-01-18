import { LitElement, ReactiveController } from './lit'

// === exports =======================================================

export { FormFieldController }

// === controllers ===================================================

class FormFieldController<T> {
  constructor(
    component: LitElement,

    params: {
      getValue(): T
      validate(): {
        message: string
        anchor: HTMLElement
      } | null
    }
  ) {}

  signalInput(): void {}

  signalUpdate(): void {}

  signalFocus(): void {}

  signalBlur(): void {}

  hasError(): boolean {
    return false
  }

  getErrorMsg(): string | null {
    return null
  }
}
