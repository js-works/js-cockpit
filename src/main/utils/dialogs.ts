import SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlButton from '@shoelace-style/shoelace/dist/components/button/button'
import { ThemeProvider } from '../components/theme-provider/theme-provider'

import infoIcon from '../icons/info-circle.svg'
import warningIcon from '../icons/exclamation-circle.svg'
import errorIcon from '../icons/exclamation-triangle.svg'
import questionIcon from '../icons/question-circle.svg'

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
    --header-spacing: 1rem;
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

  ._info-icon_ {
    color: rgb(var(--sl-color-primary-500));
  }
  
  ._warning-icon_ {
    color: rgb(var(--sl-color-warning-500));
  }
  
  ._error-icon_ {
    color: rgb(var(--sl-color-danger-500));
  }
  
  ._question-icon_ {
    color: rgb(var(--sl-color-success-500));
  }

  ._header_ {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: var(--sl-font-size-large);
  }

  ._message_ {
    font-size: 110%;
  }
`

export const Dialogs = Object.freeze({
  info(params: {
    icon?: string
    title?: string
    message?: string
    parent?: HTMLElement
    okayText?: string
  }): Promise<void> {
    return showDialog({
      type: 'info',
      icon: params.icon || infoIcon,
      title: params.title || 'Information',
      message: params.message || '',
      parent: params.parent || document.body,
      buttons: [params.okayText || 'Okay']
    })
  },

  warning(params: {
    icon?: string
    title?: string
    message?: string
    parent?: HTMLElement
    okayText?: string
  }): Promise<void> {
    return showDialog({
      type: 'warning',
      icon: params.icon || warningIcon,
      title: params.title || 'Warning',
      message: params.message || '',
      parent: params.parent || document.body,
      buttons: [params.okayText || 'Okay']
    })
  },

  error(params: {
    icon?: string
    title?: string
    message?: string
    parent?: HTMLElement
    okayText?: string
  }): Promise<void> {
    return showDialog({
      type: 'error',
      icon: params.icon || errorIcon,
      title: params.title || 'Error',
      message: params.message || '',
      parent: params.parent || document.body,
      buttons: [params.okayText || 'Okay']
    })
  },

  confirm(params: {
    icon?: string
    title?: string
    message?: string
    parent?: HTMLElement
    okayText?: string
    cancelText?: string
  }): Promise<boolean> {
    return showDialog({
      type: 'question',
      icon: params.icon || questionIcon,
      title: params.title || 'Confirmation',
      message: params.message || '',
      parent: params.parent || document.body,
      buttons: [params.cancelText || 'Cancel', params.okayText || 'Okay'],
      defaultResult: false,
      mapResult: Boolean
    })
  }
})

function showDialog<T = void>(params: {
  type: 'info' | 'question' | 'warning' | 'error'
  icon: string
  title: string
  message: string
  parent: HTMLElement
  buttons: string[]
  defaultResult?: T
  mapResult?: (idx: number) => T
}): Promise<T> {
  const container = document.createElement('div')

  const setText = (text: string | undefined, selector: string) => {
    const target: HTMLElement = container.querySelector(selector)!

    if (text) {
      target.innerText = text
    }
  }

  // required custom elements
  void (SlButton || SlIcon || SlDialog || ThemeProvider)

  container.innerHTML = `
    <c-theme-provider>
      <style></style>
      <sl-dialog open class="_dialog_">
        <div slot="label" class="_header_">
          <sl-icon class="_icon_"></sl-icon>
          <div class="_title_"></div>
        </div>
        <div class="_message_"></div>
        <div slot="footer" class="_buttons_">
        </div>
      </sl-dialog>
    </c-theme-provider>
  `

  setText(params.title, '._title_')
  setText(params.message, '._message_')

  const dialog: SlDialog = container.querySelector('sl-dialog._dialog_')!

  dialog.addEventListener('sl-request-close', (ev: Event) => {
    ev.preventDefault()
  })

  const onKeyDown = (ev: KeyboardEvent) => {
    console.log(ev)
    if (ev.key === 'Escape') {
      container.remove()
      emitResult(params.defaultResult)
    }
  }

  params.parent.addEventListener('keydown', onKeyDown)

  const icon: SlIcon = container.querySelector('sl-icon._icon_')!
  icon.classList.add(`_${params.type}-icon_`)
  icon.src = params.icon

  setText(styles, 'style')
  params.parent.append(container)

  const buttonBox = container.querySelector('._buttons_')!

  params.buttons.forEach((text, idx) => {
    const button: SlButton = document.createElement('sl-button')
    button.innerText = text

    if (idx === params.buttons.length - 1) {
      button.type = 'primary'
    }

    button.onclick = () => {
      params.parent.removeEventListener('keydown', onKeyDown)
      container.remove()
      emitResult(params.mapResult?.(idx))
    }

    buttonBox.append(button)
  })

  let emitResult: (result: any) => void

  return new Promise((resolve) => {
    emitResult = (result: any) => {
      setTimeout(() => resolve(result))
    }
  })
}
