import { createCtx } from 'js-element'
import { hook, useCtx } from 'js-element/hooks'

// === exports =======================================================

export { formCtrlCtx, useFormCtrl, FormCtrl }

// === types =========================================================

type FormCtrl = {
  submit(handler: (data: any) => void): void

  subscribeField(
    subscriber: (fieldCtrl: {
      getName(): string
      getValue(): any
      validate(): string | null
      clearError(): void
    }) => void
  ): () => void
}

// === formCtrlCtx ===================================================

const formCtrlCtx = createCtx<FormCtrl>({
  submit: () => {},
  subscribeField: () => () => {}
})

// === useFormCtrl ===================================================

const useFormCtrl = hook('useFormCtrl', () => {
  return useCtx(formCtrlCtx)
})
