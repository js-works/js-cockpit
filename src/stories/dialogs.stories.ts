import { elem, Component } from '../main/utils/components';
import { html } from '../main/utils/lit';
import { h } from '../main/utils/dom';

import {
  showApproveDialog,
  showConfirmDialog,
  showCustomInputDialog,
  showErrorDialog,
  showInfoDialog,
  showInputDialog,
  showSuccessDialog,
  showWarnDialog,
  TextField,
  DateField
} from 'js-cockpit';

export default {
  title: 'dialogs'
};

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
`;

@elem({
  tag: 'dialogs-demo',
  styles: styles
})
class DialogsDemo extends Component {
  private _onInfoClick = () => {
    showInfoDialog(this, {
      message: 'Your question has been submitted successfully',
      title: 'Submit',
      okText: 'Thanks :-)'
    });
  };

  private _onSuccessClick = () => {
    showSuccessDialog(this, {
      message: 'Your question has been submitted successfully',
      title: 'Submit',
      okText: 'Good to know'
    });
  };

  private _onWarnClick = () => {
    showWarnDialog(this, {
      message: 'This is your last warning',
      title: 'Important!!!',
      okText: 'OK - I understand'
    });
  };

  private _onErrorClick = () => {
    showErrorDialog(this, {
      message: 'The form could not be submitted',
      title: 'Form error',
      okText: 'OK - I understand'
    });
  };

  private _onConfirmClick = () => {
    showConfirmDialog(this, {
      message: 'Do you really want to log out?',
      okText: 'Log out'
    }).then(async (confirmed) => {
      if (confirmed) {
        showInfoDialog(this, {
          message: "You've been logged out"
        });
      }
    });
  };

  private _onApproveClick = () => {
    showApproveDialog(this, {
      message: 'Do you really want to delete the project?',
      title: 'Are you sure?',
      okText: 'Delete project'
    }).then((approved) => {
      if (approved) {
        showInfoDialog(this, {
          message: 'Project has been deleted'
        });
      }
    });
  };

  private _onInputClick = () => {
    showInputDialog(this, {
      message: 'Please enter your name',
      title: 'Input required',
      cancelText: 'No way!'
    }).then(async (name) => {
      if (name !== null) {
        showInfoDialog(this, {
          message: `Hello, ${name || 'stranger'}!`
        });
      }
    });
  };

  private _onCustomInputClick = () => {
    showCustomInputDialog(this, {
      title: 'New user',
      okText: 'Add user',
      uses: [TextField, DateField],
      minHeight: '29rem',
      content: html`
        <cp-text-field
          name="firstName"
          label="First name"
          required
        ></cp-text-field>
        <cp-text-field
          name="lastName"
          label="Last name"
          required
        ></cp-text-field>
        <cp-date-field
          name="dayOfBirth"
          label="Day of birth"
          required
        ></cp-date-field>
      `
    }).then((data) => {
      if (data !== null) {
        showSuccessDialog(this, {
          message:
            'Successfully added new user to database:\n\n' +
            JSON.stringify(data, null, 2)
        });
      }
    });
  };

  private _onDestroyPlanet = async () => {
    const confirmed = await showConfirmDialog(this, {
      message: 'Are you really sure that the planet shall be destroyed?'
    });

    if (confirmed) {
      const approved = await showApproveDialog(this, {
        message:
          'But this is such a lovely planet. ' +
          'Are you really, really sure it shall be destroyed?',

        okText: 'Destroy!',
        cancelText: 'Abort'
      });

      if (approved) {
        showErrorDialog(this, {
          message:
            'You are not allowed to destroy planets. ' +
            'Only Darth Vader is authorized.'
        });
      }
    }
  };

  render() {
    return html`
      <div class="demo">
        <div>
          <sl-button @click=${this._onInfoClick}>Info</sl-button>
        </div>
        <div>
          <sl-button @click=${this._onSuccessClick}>Success</sl-button>
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
          <sl-button @click=${this._onInputClick}>Input</sl-button>
        </div>
        <div>
          <sl-button @click=${this._onCustomInputClick}>Custom input</sl-button>
        </div>
        <br />
        <sl-button @click=${this._onDestroyPlanet}>Destroy planet</sl-button>
      </div>
    `;
  }
}

export const dialogs = () => h('dialogs-demo');
