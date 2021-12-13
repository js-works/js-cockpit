import SlButton from '@shoelace-style/shoelace/dist/components/button/button'
import SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog'
import SlForm from '@shoelace-style/shoelace/dist/components/form/form'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlInput from '@shoelace-style/shoelace/dist/components/input/input'
import { FocusTrap } from '@a11y/focus-trap'
import { detectLocale } from '../i18n/locale-detection'
import { addToDict, localize, TermsOf } from 'js-localize'

// icons
import infoIcon from '../icons/info-circle.svg'
import warningIcon from '../icons/exclamation-circle.svg'
import errorIcon from '../icons/exclamation-triangle.svg'
import confirmationIcon from '../icons/question-circle.svg'
import approvalIcon from '../icons/question-diamond.svg'
import inputIcon from '../icons/keyboard.svg'

// === exports =======================================================

export {
  showApproveDialog,
  showConfirmDialog,
  showErrorDialog,
  showInfoDialog,
  showInputDialog,
  showWarnDialog
}

// === translations ===================================================

declare global {
  namespace Localize {
    interface TranslationsMap {
      'jsCockpit.dialogs': TermsOf<typeof translations>
    }
  }
}

const translations = {
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
}

addToDict(translations)

// === types =========================================================

type DialogConfig<T> = {
  type: 'normal' | 'warning' | 'danger'
  icon: string
  title: string
  message: string

  buttons: {
    text: string
    type?: 'default' | 'primary' | 'danger'
  }[]

  defaultResult?: T
  content?: HTMLElement | null
  mapResult?: (data: Record<string, string>) => T
}

// === styles ========================================================

const styles = `
  .base {
    position: absolute;
    width: 0;
    max-width: 0;
    height: 0;
    max-height: 0;
    left: -10000px;
    top: -10000px;
    overflow: hidden;
  }

  .dialog {
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    padding: 0;
  }

  .dialog::part(title) {
    padding-bottom: 0.5rem;
    user-select: none;
  }
  
  .dialog::part(body) {
    padding-top: 0.5rem;
    padding-bottom: 0.25rem;
    user-select: none;
  }
  
  .dialog::part(footer) {
    user-select: none;
  }

  .dialog::part(close-button) {
    display: none;
  }

  .buttons {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  .icon {
    font-size: var(--sl-font-size-x-large);
  }

  .icon.normal {
    color: var(--sl-color-primary-500);
  }
  
  .icon.warning {
    color: var(--sl-color-warning-500);
  }
  
  .icon.danger {
    color: var(--sl-color-danger-500);
  }
  
  .header {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    font-size: var(--sl-font-size-large);
  }

  .message {
    margin-bottom: 0.5rem;
  }
`

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
        type: 'primary',
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
        type: 'primary',
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
        type: 'primary',
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
        type: 'primary',
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
        type: 'danger',
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
        type: 'primary',
        text: params.okText || translate('ok')
      }
    ]
  }))
})

function showDialog<T = void>(
  parent: HTMLElement | null,
  init: (
    translate: (textId: keyof TermsOf<'jsCockpit.dialogs'>) => string
  ) => DialogConfig<T>
): Promise<T> {
  const target =
    parent ||
    document.querySelector('#root') ||
    document.querySelector('#app') ||
    document.body

  const locale = detectLocale(target)
  const localizer = localize(locale)

  const translate = (textId: keyof TermsOf<'jsCockpit.dialogs'>) =>
    localizer.translate('jsCockpit.dialogs', textId)

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
  void (FocusTrap || SlButton || SlForm || SlIcon || SlInput || SlDialog)

  containerShadow.innerHTML = `
    <style>
    </style>
    <sl-form class="form">
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
    </sl-form>
  `

  setText(params.title, '.title')
  setText(params.message, '.message')

  const form = containerShadow.querySelector<SlForm>('sl-form.form')!
  const dialog = containerShadow.querySelector<SlDialog>('sl-dialog.dialog')!
  const contentBox = containerShadow.querySelector<HTMLDivElement>(
    'div.content'
  )!

  if (params.content) {
    contentBox.append(params.content)
  }

  form.addEventListener('sl-submit', (ev: any) => {
    ev.preventDefault()
    const formData = ev.detail.formData
    const data: Record<string, string> = {}

    formData.forEach((value: string, key: string) => {
      data[key] = value
    })

    contentBox.removeEventListener('keydown', onKeyDown)
    buttonBox.removeEventListener('keydown', onKeyDown)
    container.remove()
    containerShadow.innerHTML = ''

    emitResult(params.mapResult?.(data))
  })

  dialog.addEventListener('sl-request-close', (ev: Event) => {
    ev.preventDefault()
  })

  const icon = containerShadow.querySelector<SlIcon>('sl-icon.icon')!
  icon.classList.add(`${params.type}`)
  icon.src = params.icon

  setText(styles, 'style')

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

  const hasPrimaryButton = params.buttons.some((it) => it.type === 'primary')

  params.buttons.forEach(({ text, type = 'default' }, idx) => {
    const button: SlButton = document.createElement('sl-button')
    button.type = type
    button.innerText = text

    if (type === 'primary' || (!hasPrimaryButton && idx === 0)) {
      button.setAttribute('autofocus', '')
    }

    button.onclick = () => {
      hiddenField.value = String(idx)

      try {
        form.submit()
      } finally {
        hiddenField.value = ''
      }
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
