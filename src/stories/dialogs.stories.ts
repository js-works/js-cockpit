import { bind, elem, Component } from '../main/utils/components'
import { html } from '../main/utils/lit'
import { h } from '../main/utils/dom'
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
  :host {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    padding: 3rem;
    box-sizing: border-box;
    background-color: var(--sl-color-neutral-0);
  }

  .demo sl-button {
    width: 8rem;
    margin: 4px 2px;
  }
`

@elem({
  tag: 'dialogs-demo',
  styles: styles,
  uses: [ThemeProvider]
})
class DialogsDemo extends Component {
  @bind
  private _onInfoClick() {
    showInfoDialog(this, {
      message: 'Your question has been submitted successfully',
      title: 'Submit',
      okText: 'Thanks :-)'
    })
  }

  @bind
  private _onWarnClick() {
    showWarnDialog(this, {
      message: 'This is your last warning',
      title: 'Important!!!',
      okText: 'OK - I understand'
    })
  }

  @bind
  private _onErrorClick() {
    showErrorDialog(this, {
      message: 'The form could not be submitted',
      title: 'Form error',
      okText: 'OK - I understand'
    })
  }

  @bind
  private _onConfirmClick() {
    showConfirmDialog(this, {
      message: 'Do you really want to log out?',
      okText: 'Log out'
    }).then((confirmed) => {
      if (confirmed) {
        showInfoDialog(this, {
          message: "You've been logged out"
        })
      }
    })
  }

  @bind
  private _onApproveClick() {
    showApproveDialog(this, {
      message: 'Do you really want to delete the project?',
      title: 'Are you sure?',
      okText: 'Delete project'
    }).then((approved) => {
      if (approved) {
        showInfoDialog(this, {
          message: 'Project has been deleted'
        })
      }
    })
  }

  @bind
  private _onPromptClick() {
    showInputDialog(this, {
      message: 'Please enter your name',
      title: 'Input required',
      cancelText: 'No way!'
    }).then((name) => {
      if (name !== null) {
        showInfoDialog(this, {
          message: `Hello, ${name || 'stranger'}!`
        })
      }
    })
  }

  @bind
  private async _onDestroyPlanet() {
    const confirmed = await showConfirmDialog(this, {
      message: 'Are you really sure that the planet shall be destroyed?'
    })

    if (confirmed) {
      const approved = await showApproveDialog(this, {
        message:
          'But this is such a lovely planet. ' +
          'Are you really, really sure it shall be destroyed?',

        okText: 'Destroy!',
        cancelText: 'Abort'
      })

      if (approved) {
        showErrorDialog(this, {
          message:
            'You are not allowed to destroy planets. ' +
            'Only Darth Vader is authorized.'
        })
      }
    }
  }

  render() {
    return html`
      <div class="demo">
        <div>
          <sl-button @click=${this._onInfoClick}>Info</sl-button>
        </div>
        <div>
          <sl-button @click=${this._onWarnClick}>Warn</sl-button>
        </div>
        <div>
          <sl-button @click=${this._onErrorClick}>Error</sl-button>
        </div>
        <div>
          <sl-button @click=${this._onConfirmClick}>Confirm</sl-button>
        </div>
        <div>
          <sl-button @click=${this._onApproveClick}>Approve</sl-button>
        </div>
        <div>
          <sl-button @click=${this._onPromptClick}>Prompt</sl-button>
        </div>
        <br />
        <sl-button @click=${this._onDestroyPlanet}>Destroy planet</sl-button>
      </div>
    `
  }
}

export const dialogs = () =>
  h(
    'c-theme-provider',
    { theme: sharedTheme },
    h('dialogs-demo', { lang: 'en' })
  )
