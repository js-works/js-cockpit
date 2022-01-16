import { h } from '../main/utils/dom'
import { elem } from 'js-element'
import { html, lit } from 'js-element/lit'
import { sharedTheme } from './shared/shared-theme'

import {
  showApproveDialog,
  showConfirmDialog,
  showErrorDialog,
  showInfoDialog,
  showInputDialog,
  showWarnDialog,
  ThemeProvider
} from 'js-cockpit'

export default {
  title: 'dialogs'
}

const styles = `
  .demo sl-button {
    width: 8rem;
    margin: 4px 2px;
  }
`

@elem({
  tag: 'dialogs-demo',
  styles: styles,
  impl: lit(dialogDemoImpl),
  uses: [ThemeProvider]
})
class DialogsDemo extends HTMLElement {}

function dialogDemoImpl(self: DialogsDemo) {
  const onInfoClick = () => {
    showInfoDialog(self, {
      message: 'Your question has been submitted successfully',
      title: 'Submit',
      okText: 'Thanks :-)'
    })
  }

  const onWarnClick = () => {
    showWarnDialog(self, {
      message: 'This is your last warning',
      title: 'Important!!!',
      okText: 'OK - I understand'
    })
  }

  const onErrorClick = () => {
    showErrorDialog(self, {
      message: 'The form could not be submitted',
      title: 'Form error',
      okText: 'OK - I understand'
    })
  }

  const onConfirmClick = () => {
    showConfirmDialog(self, {
      message: 'Do you really want to log out?',
      okText: 'Log out'
    }).then((confirmed) => {
      if (confirmed) {
        showInfoDialog(self, {
          message: "You've been logged out"
        })
      }
    })
  }

  const onApproveClick = () => {
    showApproveDialog(self, {
      message: 'Do you really want to delete the project?',
      title: 'Are you sure?',
      okText: 'Delete project'
    }).then((approved) => {
      if (approved) {
        showInfoDialog(self, {
          message: 'Project has been deleted'
        })
      }
    })
  }

  const onPromptClick = () => {
    showInputDialog(self, {
      message: 'Please enter your name',
      title: 'Input required',
      cancelText: 'No way!'
    }).then((name) => {
      if (name !== null) {
        showInfoDialog(self, {
          message: `Hello, ${name || 'stranger'}!`
        })
      }
    })
  }

  const onDestroyPlanet = async () => {
    const confirmed = await showConfirmDialog(self, {
      message: 'Are you really sure that the planet shall be destroyed?'
    })

    if (confirmed) {
      const approved = await showApproveDialog(self, {
        message:
          'But this is such a lovely planet. ' +
          'Are you really, really sure it shall be destroyed?',

        okText: 'Destroy!',
        cancelText: 'Abort'
      })

      if (approved) {
        showErrorDialog(self, {
          message:
            'You are not allowed to destroy planets. ' +
            'Only Darth Vader is authorized.'
        })
      }
    }
  }

  return () => html`
    <div class="demo">
      <div>
        <sl-button @click=${onInfoClick}>Info</sl-button>
      </div>
      <div>
        <sl-button @click=${onWarnClick}>Warn</sl-button>
      </div>
      <div>
        <sl-button @click=${onErrorClick}>Error</sl-button>
      </div>
      <div>
        <sl-button @click=${onConfirmClick}>Confirm</sl-button>
      </div>
      <div>
        <sl-button @click=${onApproveClick}>Approve</sl-button>
      </div>
      <div>
        <sl-button @click=${onPromptClick}>Prompt</sl-button>
      </div>
      <br />
      <sl-button @click=${onDestroyPlanet}>Destroy planet</sl-button>
    </div>
  `
}

export const dialogs = () =>
  h('c-theme-provider', { theme: sharedTheme }, h('dialogs-demo'))
