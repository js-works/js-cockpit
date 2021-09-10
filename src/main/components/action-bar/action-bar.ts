import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, classMap, lit } from 'js-element/lit'

// custom elements
import SlButton from '@shoelace-style/shoelace/dist/components/button/button'

// styles
import actionBarStyles from './action-bar.css'

// icons
import newIcon from 'remixicon/icons/System/add-line.svg'
import editIcon from 'remixicon/icons/Design/edit-2-line.svg'
import deleteIcon from 'remixicon/icons/System/delete-bin-6-line.svg'

// === exports =======================================================

export { ActionBar }

// === ActionBar ===================================================

@elem({
  tag: 'c-action-bar',
  styles: actionBarStyles,
  impl: lit(actionBarImpl),
  uses: [SlButton]
})
class ActionBar extends component() {}

function actionBarImpl(self: ActionBar) {
  return () => {
    return html`
      <div class="base">
        <sl-button size="small">
          <sl-icon slot="prefix" src=${newIcon}></sl-icon>
          New
        </sl-button>
        <sl-button size="small">
          <sl-icon slot="prefix" src=${editIcon}></sl-icon>
          Edit
        </sl-button>
        <sl-button size="small">
          <sl-icon slot="prefix" src=${deleteIcon}></sl-icon>
          Delete
        </sl-button>
      </div>
    `
  }
}
