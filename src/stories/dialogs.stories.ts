import { h } from '../main/utils/dom'
import { component, elem } from 'js-element'
import { createRef, html, lit, ref } from 'js-element/lit'
import { Brand, Dialogs, ThemeProvider, Theme } from 'js-cockpit'

export default {
  title: 'dialogs'
}

const styles = `
  sl-button {
    width: 100px;
    margin: 4px 2px;
  }
`

@elem({
  tag: 'dialogs-demo',
  styles: styles,
  impl: lit(dialogDemoImpl),
  uses: [ThemeProvider]
})
class DialogsDemo extends component() {}

function dialogDemoImpl(self: DialogsDemo) {
  const onInfo1Click = () => {
    Dialogs.info(
      self,
      'Your question has been submitted successfully',
      'Submit'
    )
  }

  const onInfo2Click = () => {
    Dialogs.info(self, {
      message: 'Your question has been submitted successfully',
      title: 'Submit',
      okText: 'Thanks :-)'
    })
  }

  const onWarn1Click = () => {
    Dialogs.warn(self, 'This is your last warning')
  }

  const onWarn2Click = () => {
    Dialogs.warn(self, {
      message: 'This is your last warning',
      title: 'Important!!!',
      okText: 'OK - I understand'
    })
  }

  const onError1Click = () => {
    Dialogs.error(self, 'The form could not be submitted')
  }

  const onError2Click = () => {
    Dialogs.error(self, {
      message: 'The form could not be submitted',
      title: 'Form error',
      okText: 'OK - I understand'
    })
  }

  const onConfirm1Click = () => {
    Dialogs.confirm(self, 'Do you really want to log out?', 'Logout').then(
      (confirmed) =>
        void (confirmed && Dialogs.info(self, "You've been logged out"))
    )
  }

  const onConfirm2Click = () => {
    Dialogs.confirm(self, {
      message: 'Do you really want to log out?',
      okText: 'Log out'
    }).then(
      (confirmed) =>
        void (confirmed && Dialogs.info(self, "You've been logged out"))
    )
  }

  const onApprove1Click = () => {
    Dialogs.approve(self, 'Do you really want to delete the project?').then(
      (approved) =>
        void (approved && Dialogs.info(self, 'Project has been deleted'))
    )
  }

  const onApprove2Click = () => {
    Dialogs.approve(self, {
      message: 'Do you really want to delete the project?',
      title: 'Are you sure?',
      okText: 'Delete project'
    }).then(
      (approved) =>
        void (approved && Dialogs.info(self, 'Project has been deleted'))
    )
  }

  const onPrompt1Click = () => {
    Dialogs.prompt(self, 'Please enter your name').then(
      (name) => void (name && Dialogs.info(self, `Hello, ${name}!`))
    )
  }

  const onPrompt2Click = () => {
    Dialogs.prompt(self, {
      message: 'Please enter your name',
      title: 'Input required',
      cancelText: 'No way!'
    }).then((name) => void (name && Dialogs.info(self, `Hello, ${name}!`)))
  }

  return () => html`
    <c-theme-provider>
      <div>
        <sl-button @click=${onInfo1Click}>Info 1</sl-button>
        <sl-button @click=${onInfo2Click}>Info 2</sl-button>
      </div>
      <div>
        <sl-button @click=${onWarn1Click}>Warn 1</sl-button>
        <sl-button @click=${onWarn2Click}>Warn 2</sl-button>
      </div>
      <div>
        <sl-button @click=${onError1Click}>Error 1</sl-button>
        <sl-button @click=${onError2Click}>Error 2</sl-button>
      </div>
      <div>
        <sl-button @click=${onConfirm1Click}>Confirm 1</sl-button>
        <sl-button @click=${onConfirm2Click}>Confirm 2</sl-button>
      </div>
      <div>
        <sl-button @click=${onApprove1Click}>Approve 1</sl-button>
        <sl-button @click=${onApprove2Click}>Approve 2</sl-button>
      </div>
      <div>
        <sl-button @click=${onPrompt1Click}>Prompt 1</sl-button>
        <sl-button @click=${onPrompt2Click}>Prompt 2</sl-button>
      </div>
    </c-theme-provider>
  `
}

export const dialogs = () => h('c-theme-provider', null, h('dialogs-demo'))
