import { h } from '../main/utils/dom'
import { component, elem } from 'js-element'
import { html, lit } from 'js-element/lit'
import { Dialogs, ThemeProvider } from 'js-cockpit'

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
class DialogsDemo extends component() {}

function dialogDemoImpl(self: DialogsDemo) {
  const onInfoClick = () => {
    Dialogs.info(self, {
      message: 'Your question has been submitted successfully',
      title: 'Submit',
      okText: 'Thanks :-)'
    })
  }

  const onWarnClick = () => {
    Dialogs.warn(self, {
      message: 'This is your last warning',
      title: 'Important!!!',
      okText: 'OK - I understand'
    })
  }

  const onErrorClick = () => {
    Dialogs.error(self, {
      message: 'The form could not be submitted',
      title: 'Form error',
      okText: 'OK - I understand'
    })
  }

  const onConfirmClick = () => {
    Dialogs.confirm(self, {
      message: 'Do you really want to log out?',
      okText: 'Log out'
    }).then((confirmed) => {
      if (confirmed) {
        Dialogs.info(self, {
          message: "You've been logged out"
        })
      }
    })
  }

  const onApproveClick = () => {
    Dialogs.approve(self, {
      message: 'Do you really want to delete the project?',
      title: 'Are you sure?',
      okText: 'Delete project'
    }).then((approved) => {
      if (approved) {
        Dialogs.info(self, {
          message: 'Project has been deleted'
        })
      }
    })
  }

  const onPromptClick = () => {
    Dialogs.prompt(self, {
      message: 'Please enter your name',
      title: 'Input required',
      cancelText: 'No way!'
    }).then((name) => {
      if (name !== null) {
        Dialogs.info(self, {
          message: `Hello, ${name || 'stranger'}!`
        })
      }
    })
  }

  const onDestroyPlanet = async () => {
    const confirmed = await Dialogs.confirm(self, {
      message: 'Are you really sure that the planet shall be destroyed?'
    })

    if (confirmed) {
      const approved = await Dialogs.approve(self, {
        message:
          'But this is such a lovely planet. ' +
          'Are you really, really sure it shall be destroyed?',

        okText: 'Destroy!',
        cancelText: 'Abort'
      })

      if (approved) {
        Dialogs.error(self, {
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

export const dialogs = () => h('c-theme-provider', null, h('dialogs-demo'))
