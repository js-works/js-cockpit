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
  ) {
    const getLabel = () => (component as any).label
    let hasRendered = false

    component.addController({
      hostConnected() {
        hasRendered = false
        console.log(`host ${getLabel()},  ${component.localName} connected`)
      },

      hostDisconnected() {},

      hostUpdate() {
        if (!hasRendered) {
          hasRendered = true
          console.log('dispatch')
          component.dispatchEvent(
            new CustomEvent('xxx', {
              bubbles: true,
              composed: true,

              detail: {
                kind: 'formField',

                init(params: {
                  submitForm: () => void //
                  cancel: () => void
                }): {
                  getName: () => string
                  getValue: () => any
                  validate: (data: Record<string, any>) => Error | null
                  reset: () => void
                } {
                  return null as any // TODO
                }
              }
            })
          )
        }
      },

      hostUpdated() {}
    })
  }

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
