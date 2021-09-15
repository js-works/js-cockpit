import SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlInput from '@shoelace-style/shoelace/dist/components/input/input'
import SlButton from '@shoelace-style/shoelace/dist/components/button/button'
import SlForm from '@shoelace-style/shoelace/dist/components/form/form'
import { ThemeProvider } from '../components/theme-provider/theme-provider'

// icons
import infoIcon from '../icons/info-circle.svg'
import warningIcon from '../icons/exclamation-circle.svg'
import errorIcon from '../icons/exclamation-triangle.svg'
import questionIcon from '../icons/question-circle.svg'
import promptIcon from '../icons/keyboard.svg'

// === types =========================================================

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
  }
  
  ._dialog_::part(body) {
    padding-top: 0.5rem;
    padding-bottom: 0.25rem;
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
  
  ._icon_._error_ {
    color: rgb(var(--sl-color-danger-500));
  }
  
  ._header_ {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: var(--sl-font-size-large);
  }

  ._message_ {
    font-size: 110%;
    margin-bottom: 0.5rem;
  }

  ._content_ {
  }
`
function info(message: string, title?: string): Promise<void>

function info(
  parent: HTMLElement,
  message: string,
  title?: string
): Promise<void>

function info(arg1: any, arg2?: any, arg3?: any): Promise<void> {
  if (typeof arg1 === 'string') {
    return info(undefined as any, arg1, arg2)
  }

  return showDialog({
    type: 'normal',
    icon: infoIcon,
    title: arg3 || 'Information',
    message: arg2 || '',
    parent: arg1 || document.body,
    buttons: ['OK']
  })
}

function warn(message: string, title?: string): Promise<void>

function warn(
  parent: HTMLElement,
  message: string,
  title?: string
): Promise<void>

function warn(arg1: any, arg2?: any, arg3?: any): Promise<void> {
  if (typeof arg1 === 'string') {
    return warn(undefined as any, arg1, arg2)
  }

  return showDialog({
    type: 'warning',
    icon: warningIcon,
    title: arg3 || 'Warning',
    message: arg2 || '',
    parent: arg1 || document.body,
    buttons: ['OK']
  })
}

function error(message: string, title?: string): Promise<void>

function error(
  parent: HTMLElement,
  message: string,
  title?: string
): Promise<void>

function error(arg1: any, arg2?: any, arg3?: any): Promise<void> {
  if (typeof arg1 === 'string') {
    return error(undefined as any, arg1, arg2)
  }

  return showDialog({
    type: 'error',
    icon: errorIcon,
    title: arg3 || 'Error',
    message: arg2 || '',
    parent: arg1 || document.body,
    buttons: ['OK']
  })
}

function confirm(message: string, title?: string): Promise<boolean>

function confirm(
  parent: HTMLElement,
  message: string,
  title?: string
): Promise<boolean>

function confirm(arg1: any, arg2?: any, arg3?: any): Promise<boolean> {
  if (typeof arg1 === 'string') {
    return confirm(undefined as any, arg1, arg2)
  }

  return showDialog({
    type: 'normal',
    icon: questionIcon,
    title: arg3 || 'Confirmation',
    message: arg2 || '',
    parent: arg1 || document.body,
    mapResult: (data) => data.button === '1',
    buttons: ['Cancel', 'OK']
  })
}

function prompt(
  message: string,
  value?: string,
  title?: string
): Promise<string | null>

function prompt(
  parent: HTMLElement,
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
  if (typeof arg1 === 'string') {
    return prompt(undefined as any, arg1, arg2, arg3)
  }

  const inputField = document.createElement('sl-input')
  inputField.name = 'input'
  inputField.value = arg3 || ''

  return showDialog({
    type: 'normal',
    icon: promptIcon,
    title: arg4 || 'Input',
    message: arg2 || '',
    content: inputField,
    parent: arg1 || document.body,
    mapResult: (data) => (data.button === '0' ? null : data.input),
    buttons: ['Cancel', 'OK']
  })
}

export const Dialogs = Object.freeze({
  info,
  warn,
  error,
  confirm,
  prompt
})

function showDialog<T = void>(params: {
  type: 'normal' | 'warning' | 'error'
  icon: string
  title: string
  message: string
  parent: HTMLElement
  buttons: string[]
  defaultResult?: T
  content?: HTMLElement | null
  mapResult?: (data: Record<string, string>) => T
}): Promise<T> {
  const container = document.createElement('div')

  const setText = (text: string | undefined, selector: string) => {
    const target: HTMLElement = container.querySelector(selector)!

    if (text) {
      target.innerText = text
    }
  }

  // required custom elements
  void (SlButton || SlForm || SlIcon || SlInput || SlDialog || ThemeProvider)

  container.innerHTML = `
    <c-theme-provider>
      <style></style>
      <sl-form class="_form_">
        <sl-dialog open class="_dialog_">
          <div slot="label" class="_header_">
            <sl-icon class="_icon_"></sl-icon>
            <div class="_title_"></div>
          </div>
          <div class="_message_"></div>
          <div class="_content_"></div>
          <div slot="footer" class="_buttons_"></div>
        </sl-dialog>
      </sl-form>
    </c-theme-provider>
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

    params.parent.removeEventListener('keydown', onKeyDown)
    container.remove()
    emitResult(params.mapResult?.(data))
  })

  dialog.addEventListener('sl-request-close', (ev: Event) => {
    ev.preventDefault()
  })

  const onKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') {
      container.remove()
      emitResult(params.defaultResult)
    }
  }

  params.parent.addEventListener('keydown', onKeyDown)

  const icon: SlIcon = container.querySelector('sl-icon._icon_')!
  icon.classList.add(`_${params.type}_`)
  icon.src = params.icon

  setText(styles, 'style')
  params.parent.append(container)

  const buttonBox = container.querySelector('._buttons_')!
  const hiddenField = document.createElement('input')

  hiddenField.type = 'hidden'
  hiddenField.name = 'button'
  buttonBox.append(hiddenField)

  params.buttons.forEach((text, idx) => {
    const button: SlButton = document.createElement('sl-button')
    button.innerText = text

    if (idx === params.buttons.length - 1) {
      button.type = 'primary'
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

  let emitResult: (result: any) => void

  return new Promise((resolve) => {
    emitResult = (result: any) => {
      setTimeout(() => resolve(result), 50)
    }
  })
}
