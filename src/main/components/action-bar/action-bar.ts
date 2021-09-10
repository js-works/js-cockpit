import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, classMap, lit } from 'js-element/lit'

// custom elements
import SlButton from '@shoelace-style/shoelace/dist/components/button/button'
import SlButtonGroup from '@shoelace-style/shoelace/dist/components/button-group/button-group'

// styles
import actionBarStyles from './action-bar.css'

// icons
//import newIcon from 'remixicon/icons/System/add-line.svg'
import newIcon from 'bootstrap-icons/icons/plus.svg'
import editIcon from 'bootstrap-icons/icons/pencil-square.svg'
import deleteIcon from 'bootstrap-icons/icons/trash.svg'

// === exports =======================================================

export { ActionBar }

// === ActionBar ===================================================

@elem({
  tag: 'c-action-bar',
  styles: actionBarStyles,
  impl: lit(actionBarImpl),
  uses: [SlButton, SlButtonGroup]
})
class ActionBar extends component() {}

function actionBarImpl(self: ActionBar) {
  return () => {
    return html`
      <div class="base">
        <sl-button-group>
          <sl-button size="small" xpill>New</sl-button>
          <sl-button size="small" xpill>Edit</sl-button>
          <sl-button size="small" xpill>Print</sl-button>
          <sl-button size="small" xpill>Delete</sl-button>
        </sl-button-group>
      </div>
    `
  }
}
