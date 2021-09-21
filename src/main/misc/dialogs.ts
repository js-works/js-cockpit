import SlButton from '@shoelace-style/shoelace/dist/components/button/button'
import SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog'
import SlForm from '@shoelace-style/shoelace/dist/components/form/form'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlInput from '@shoelace-style/shoelace/dist/components/input/input'
import { FocusTrap } from '@a11y/focus-trap'
import { detectLocale } from './locales'
import { I18n } from './i18n'

// icons
import infoIcon from '../icons/info-circle.svg'
import warningIcon from '../icons/exclamation-circle.svg'
import errorIcon from '../icons/exclamation-triangle.svg'
import confirmationIcon from '../icons/question-circle.svg'
import approvalIcon from '../icons/question-diamond.svg'
import promptIcon from '../icons/keyboard.svg'

// === texts =========================================================

I18n.addTranslations('en-US', {
  'js-cockpit.dialogs': {
    ok: 'OK',
    cancel: 'Cancel',
    information: 'Information',
    warning: 'Warning',
    error: 'Error',
    input: 'Input',
    confirmation: 'Confirmation',
    approval: 'Approval'
  }
})

// === types =========================================================

type TranslateFn = (textId: string) => string

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

type DialogInit<T> = (translate: TranslateFn) => DialogConfig<T>

type InfoDialogParams = {
  message: string
  title?: string
  okText?: string
}

type WarningDialogParams = InfoDialogParams
type ErrorDialogParams = InfoDialogParams
type ConfirmDialogParams = InfoDialogParams & { cancelText?: string }
type ApproveDialogParams = ConfirmDialogParams
type PromptDialogParams = ConfirmDialogParams & { value?: string }

// === styles ========================================================

const styles = `
  ._base_ {
    position: absolute;
    width: 0;
    max-width: 0;
    height: 0;
    max-height: 0;
    left: -10000px;
    top: -10000px;
    overflow: hidden;
  }

  ._dialog_ {
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    padding: 0;
  }

  ._dialog_::part(title) {
    padding-bottom: 0.5rem;
    user-select: none;
  }
  
  ._dialog_::part(body) {
    padding-top: 0.5rem;
    padding-bottom: 0.25rem;
    user-select: none;
  }
  
  ._dialog_::part(footer) {
    user-select: none;
  }

  ._dialog_::part(close-button) {
    display: none;
  }

  ._buttons_ {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  ._icon_ {
    font-size: var(--sl-font-size-x-large);
  }

  ._icon_._normal_ {
    color: rgb(var(--sl-color-primary-500));
  }
  
  ._icon_._warning_ {
    color: rgb(var(--sl-color-warning-500));
  }
  
  ._icon_._danger_ {
    color: rgb(var(--sl-color-danger-500));
  }
  
  ._header_ {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    font-size: var(--sl-font-size-large);
  }

  ._message_ {
    margin-bottom: 0.5rem;
  }
`

function info(params: InfoDialogParams): Promise<void>

function info(
  parent: HTMLElement | null,
  params: InfoDialogParams
): Promise<void>

function info(message: string, title?: string): Promise<void>

function info(
  parent: HTMLElement | null,
  message: string,
  title?: string
): Promise<void>

function info(arg1: any, arg2?: any, arg3?: any): Promise<void> {
  if (arg1 !== null && !(arg1 instanceof HTMLElement)) {
    return info(null, arg1, arg2)
  }

  if (typeof arg2 === 'string') {
    return info(arg1, {
      message: arg2,
      title: arg3
    })
  }

  const parent: HTMLElement | null = arg1
  const params: InfoDialogParams = arg2

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
}

function warn(params: WarningDialogParams): Promise<void>

function warn(
  parent: HTMLElement | null,
  params: WarningDialogParams
): Promise<void>

function warn(message: string, title?: string): Promise<void>

function warn(
  parent: HTMLElement | null,
  message: string,
  title?: string
): Promise<void>

function warn(arg1: any, arg2?: any, arg3?: any): Promise<void> {
  if (arg1 !== null && !(arg1 instanceof HTMLElement)) {
    return warn(null, arg1, arg2)
  }

  if (typeof arg2 === 'string') {
    return warn(arg1, {
      message: arg2,
      title: arg3
    })
  }

  const parent: HTMLElement | null = arg1
  const params: WarningDialogParams = arg2

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
}

function error(params: ErrorDialogParams): Promise<void>

function error(
  parent: HTMLElement | null,
  params: ErrorDialogParams
): Promise<void>

function error(message: string, title?: string): Promise<void>

function error(
  parent: HTMLElement | null,
  message: string,
  title?: string
): Promise<void>

function error(arg1: any, arg2?: any, arg3?: any): Promise<void> {
  if (arg1 !== null && !(arg1 instanceof HTMLElement)) {
    return error(null, arg1, arg2)
  }

  if (typeof arg2 === 'string') {
    return error(arg1, {
      message: arg2,
      title: arg3
    })
  }

  const parent: HTMLElement | null = arg1
  const params: ErrorDialogParams = arg2

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
}

function confirm(params: ConfirmDialogParams): Promise<boolean>

function confirm(
  parent: HTMLElement | null,
  params: ConfirmDialogParams
): Promise<boolean>

function confirm(message: string, title?: string): Promise<boolean>

function confirm(
  parent: HTMLElement | null,
  message: string,
  title?: string
): Promise<boolean>

function confirm(arg1: any, arg2?: any, arg3?: any): Promise<boolean> {
  if (arg1 !== null && !(arg1 instanceof HTMLElement)) {
    return confirm(null, arg1, arg2)
  }

  if (typeof arg2 === 'string') {
    return confirm(arg1, {
      message: arg2,
      title: arg3
    })
  }

  const parent: HTMLElement | null = arg1
  const params: ConfirmDialogParams = arg2

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
}

function approve(params: ApproveDialogParams): Promise<boolean>

function approve(
  parent: HTMLElement | null,
  params: ApproveDialogParams
): Promise<boolean>

function approve(message: string, title?: string): Promise<boolean>

function approve(
  parent: HTMLElement | null,
  message: string,
  title?: string
): Promise<boolean>

function approve(arg1: any, arg2?: any, arg3?: any): Promise<boolean> {
  if (arg1 !== null && !(arg1 instanceof HTMLElement)) {
    return approve(null, arg1, arg2)
  }

  if (typeof arg2 === 'string') {
    return approve(arg1, {
      message: arg2,
      title: arg3
    })
  }

  const parent: HTMLElement | null = arg1
  const params: ApproveDialogParams = arg2

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
}

function prompt(params: PromptDialogParams): Promise<string | null>

function prompt(
  parent: HTMLElement | null,
  params: PromptDialogParams
): Promise<string | null>

function prompt(
  message: string,
  value?: string,
  title?: string
): Promise<string | null>

function prompt(
  parent: HTMLElement | null,
  message: string,
  value?: string,
  title?: string
): Promise<string | null>

function prompt(
  arg1: any,
  arg2?: any,
  arg3?: any,
  arg4?: any
): Promise<string | null> {
  if (arg1 !== null && !(arg1 instanceof HTMLElement)) {
    return prompt(null, arg1, arg2, arg3)
  }

  if (typeof arg2 === 'string') {
    return prompt(arg1, {
      message: arg2,
      value: arg3,
      title: arg4
    })
  }

  const parent: HTMLElement | null = arg1
  const params: PromptDialogParams = arg2

  const inputField = document.createElement('sl-input')
  inputField.name = 'input'
  inputField.value = params.value || ''
  inputField.size = 'small'
  inputField.setAttribute('autofocus', '')

  return showDialog(parent, (translate) => ({
    type: 'normal',
    icon: promptIcon,
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
}

export const Dialogs = Object.freeze({
  info,
  warn,
  error,
  confirm,
  approve,
  prompt
})

function showDialog<T = void>(
  parent: HTMLElement | null,
  init: DialogInit<T>
): Promise<T> {
  const target =
    parent ||
    document.querySelector('#root') ||
    document.querySelector('#app') ||
    document.body

  const locale = detectLocale(target)
  const facade = I18n.getFacade(locale)

  const translate: TranslateFn = (textId) =>
    facade.translate('js-cockpit.dialogs.' + textId)

  const params = init(translate)
  const container = document.createElement('div')

  const setText = (text: string | undefined, selector: string) => {
    const target: HTMLElement = container.querySelector(selector)!

    if (text) {
      target.innerText = text
    }
  }

  // required custom elements
  void (FocusTrap || SlButton || SlForm || SlIcon || SlInput || SlDialog)

  container.innerHTML = `
    <style></style>
    <sl-form class="_form_">
      <focus-trap>
        <sl-dialog open class="_dialog_">
          <div slot="label" class="_header_">
            <sl-icon class="_icon_"></sl-icon>
            <div class="_title_"></div>
          </div>
          <div class="_message_"></div>
          <div class="_content_"></div>
          <div slot="footer" class="_buttons_"></div>
        </sl-dialog>
      </focus-trap>
    </sl-form>
  `

  setText(params.title, '._title_')
  setText(params.message, '._message_')

  const form: SlForm = container.querySelector('sl-form._form_')!
  const dialog: SlDialog = container.querySelector('sl-dialog._dialog_')!
  const contentBox: HTMLElement = container.querySelector('div._content_')!

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
    container.innerHTML = ''

    emitResult(params.mapResult?.(data))
  })

  dialog.addEventListener('sl-request-close', (ev: Event) => {
    ev.preventDefault()
  })

  const icon: SlIcon = container.querySelector('sl-icon._icon_')!
  icon.classList.add(`_${params.type}_`)
  icon.src = params.icon

  setText(styles, 'style')

  const buttonBox: HTMLElement = container.querySelector('._buttons_')!
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

  const elem: any = dialog.querySelector('[autofocus]')

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
