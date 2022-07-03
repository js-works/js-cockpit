import SlButton from '@shoelace-style/shoelace/dist/components/button/button'
import SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlInput from '@shoelace-style/shoelace/dist/components/input/input'
import { FocusTrap } from '@a11y/focus-trap'

import { I18nController } from '../controllers/i18n-controller'
import { addToDict, defineTerms, I18nFacade, TermsOf } from '../i18n/i18n'

// icons
import infoIcon from '../icons/info-circle.svg'
import warningIcon from '../icons/exclamation-circle.svg'
import errorIcon from '../icons/exclamation-triangle.svg'
import confirmationIcon from '../icons/question-circle.svg'
import approvalIcon from '../icons/question-diamond.svg'
import inputIcon from '../icons/keyboard.svg'

// styles
import dialogStyles from './dialogs.css'

// === exports =======================================================

export {
  showApproveDialog,
  showConfirmDialog,
  showErrorDialog,
  showInfoDialog,
  showInputDialog,
  showWarnDialog
}

// required custom element (to prevent too much tree shaking)
void FocusTrap

// === types =========================================================

type DialogConfig<T> = {
  type: 'normal' | 'warning' | 'danger'
  icon: string
  title: string
  message: string

  buttons: {
    text: string
    variant?: 'default' | 'primary' | 'danger'
  }[]

  defaultResult?: T
  content?: HTMLElement | null
  mapResult?: (data: Record<string, string>) => T
}

// === translations ==================================================

declare global {
  namespace Localize {
    interface Translations extends TermsOf<typeof translations> {}
  }
}

const translations = defineTerms({
  en: {
    'jsCockpit.dialogs': {
      ok: 'OK',
      cancel: 'Cancel',
      information: 'Information',
      warning: 'Warning',
      error: 'Error',
      input: 'Input',
      confirmation: 'Confirmation',
      approval: 'Approval'
    }
  }
})

addToDict(translations)

// --- functions -----------------------------------------------------

function createDialogFn<P extends Record<string, any>, R = void>(
  logic: (parent: HTMLElement | null, params: P) => Promise<R>
): {
  (params: P): Promise<R>
  (parent: HTMLElement | null, params: P): Promise<R>
} {
  return (arg1: any, arg2?: any) =>
    arg2 && typeof arg2 === 'object' ? logic(arg1, arg2) : logic(null, arg1)
}

const showInfoDialog = createDialogFn<{
  message: string
  title?: string
  okText?: string
}>((parent, params) => {
  return showDialog(parent, (translate) => ({
    type: 'normal',
    icon: infoIcon,
    title: params.title || translate('information'),
    message: params.message || '',

    buttons: [
      {
        variant: 'primary',
        text: params.okText || translate('ok')
      }
    ]
  }))
})

const showWarnDialog = createDialogFn<{
  message: string
  title?: string
  okText?: string
}>((parent, params) => {
  return showDialog(parent, (translate) => ({
    type: 'warning',
    icon: warningIcon,
    title: params.title || translate('warning'),
    message: params.message || '',

    buttons: [
      {
        variant: 'primary',
        text: params.okText || translate('ok')
      }
    ]
  }))
})

const showErrorDialog = createDialogFn<{
  message: string
  title?: string
  okText?: string
}>((parent, params) => {
  return showDialog(parent, (translate) => ({
    type: 'danger',
    icon: errorIcon,
    title: params.title || translate('error'),
    message: params.message || '',

    buttons: [
      {
        variant: 'primary',
        text: params.okText || translate('ok')
      }
    ]
  }))
})

const showConfirmDialog = createDialogFn<
  {
    message: string
    title?: string
    okText?: string
    cancelText?: string
  },
  boolean
>((parent, params) => {
  return showDialog(parent, (translate) => ({
    type: 'normal',
    icon: confirmationIcon,
    title: params.title || translate('confirmation'),
    message: params.message || '',
    mapResult: ({ button }) => button === '1',

    buttons: [
      {
        text: params.cancelText || translate('cancel')
      },
      {
        variant: 'primary',
        text: params.okText || translate('ok')
      }
    ]
  }))
})

const showApproveDialog = createDialogFn<
  {
    message: string
    title?: string
    okText?: string
    cancelText?: string
  },
  boolean
>((parent, params) => {
  return showDialog(parent, (translate) => ({
    type: 'danger',
    icon: approvalIcon,
    title: params.title || translate('approval'),
    message: params.message || '',
    mapResult: ({ button }) => button === '1',

    buttons: [
      {
        text: params.cancelText || translate('cancel')
      },
      {
        variant: 'danger',
        text: params.okText || translate('ok')
      }
    ]
  }))
})

const showInputDialog = createDialogFn<
  {
    message: string
    title?: string
    okText?: string
    cancelText?: string
    value?: string
  },
  string | null
>((parent, params) => {
  const inputField = document.createElement('sl-input')
  inputField.name = 'input'
  inputField.value = params.value || ''
  inputField.size = 'small'
  inputField.setAttribute('autofocus', '')

  return showDialog(parent, (translate) => ({
    type: 'normal',
    icon: inputIcon,
    title: params.title || translate('input'),
    message: params.message || '',
    content: inputField,
    mapResult: ({ button, input }) => (button === '0' ? null : input),

    buttons: [
      {
        text: params.cancelText || translate('cancel')
      },
      {
        variant: 'primary',
        text: params.okText || translate('ok')
      }
    ]
  }))
})

function showDialog<T = void>(
  parent: HTMLElement | null,
  init: (
    translate: (
      textId: keyof Localize.Translations['jsCockpit.dialogs']
    ) => string
  ) => DialogConfig<T>
): Promise<T> {
  const target =
    parent ||
    document.querySelector('#app') ||
    document.querySelector('#root') ||
    document.body

  const lang = new I18nController({ element: target }).getLocale()
  const i18nFacade = new I18nFacade(() => lang)
  const translate = i18nFacade.translate('jsCockpit.dialogs')

  const params = init(translate)
  const container = document.createElement('div')
  container.attachShadow({ mode: 'open' })
  const containerShadow = container.shadowRoot!

  const setText = (text: string | undefined, selector: string) => {
    const target = containerShadow.querySelector<HTMLElement>(selector)!

    if (text) {
      target.innerText = text
    }
  }

  // required custom elements
  void (FocusTrap || SlButton || SlIcon || SlInput || SlDialog)

  containerShadow.innerHTML = `
    <style>
    </style>
    <form class="form" dir=${i18nFacade.getDirection()}>
      <focus-trap>
        <sl-dialog open class="dialog">
          <div slot="label" class="header">
            <sl-icon class="icon"></sl-icon>
            <div class="title"></div>
          </div>
          <div class="message"></div>
          <div class="content"></div>
          <div slot="footer" class="buttons"></div>
        </sl-dialog>
      </focus-trap>
    </form>
  `

  setText(params.title, '.title')
  setText(params.message, '.message')

  const form = containerShadow.querySelector<HTMLFormElement>('form.form')!
  const dialog = containerShadow.querySelector<SlDialog>('sl-dialog.dialog')!
  const contentBox =
    containerShadow.querySelector<HTMLDivElement>('div.content')!

  if (params.content) {
    contentBox.append(params.content)
  }

  form.addEventListener('submit', (ev: any) => {
    ev.preventDefault()

    // This will be run before the button submit event is dispatched.
    // That's why the logic logic here will be deferred.

    setTimeout(() => {
      const formData = new FormData(form)
      const data: Record<string, string> = {}

      formData.forEach((value: FormDataEntryValue, key: string) => {
        data[key] = value.toString()
      })

      contentBox.removeEventListener('keydown', onKeyDown)
      buttonBox.removeEventListener('keydown', onKeyDown)
      container.remove()
      containerShadow.innerHTML = ''

      emitResult(params.mapResult?.(data))
    }, 0)
  })

  dialog.addEventListener('sl-request-close', (ev: Event) => {
    ev.preventDefault()
  })

  const icon = containerShadow.querySelector<SlIcon>('sl-icon.icon')!
  icon.classList.add(`${params.type}`)
  icon.src = params.icon

  setText(dialogStyles, 'style')

  const buttonBox: HTMLElement = containerShadow.querySelector('.buttons')!
  const hiddenField = document.createElement('input')

  const onKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') {
      container.remove()
      emitResult(params.defaultResult)
    }
  }

  contentBox.addEventListener('keydown', onKeyDown)
  buttonBox.addEventListener('keydown', onKeyDown)

  hiddenField.type = 'hidden'
  hiddenField.name = 'button'
  buttonBox.append(hiddenField)

  const hasPrimaryButton = params.buttons.some((it) => it.variant === 'primary')

  params.buttons.forEach(({ text, variant = 'default' }, idx) => {
    const button: SlButton = document.createElement('sl-button')
    button.type = 'submit'
    button.className = 'button'
    button.variant = variant
    button.innerText = text

    if (variant === 'primary' || (!hasPrimaryButton && idx === 0)) {
      button.setAttribute('autofocus', '')
    }

    button.onclick = () => {
      // This will be run after an submit event will be
      // dispatched for the corresponding form element.
      // That's why the form submit event handler logic
      // will be deferred.
      hiddenField.value = String(idx)
    }

    buttonBox.append(button)
  })
  ;(target.shadowRoot || target).appendChild(container)

  const elem = dialog.querySelector<HTMLElement>('[autofocus]')

  if (elem && typeof elem.focus === 'function') {
    setTimeout(() => elem.focus())
  }

  let emitResult: (result: any) => void

  return new Promise((resolve) => {
    emitResult = (result: any) => {
      setTimeout(() => resolve(result), 50)
    }
  })
}
