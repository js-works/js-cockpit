import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, classMap, lit } from 'js-element/lit'

// styles
import actionBarStyles from './action-bar.css'

// === exports =======================================================

export { ActionBar }

// === ActionBar ===================================================

@elem({
  tag: 'c-action-bar',
  styles: actionBarStyles,
  impl: lit(actionBarImpl)
})
class ActionBar extends component() {}

function actionBarImpl(self: ActionBar) {
  return () => {
    return html`<div class="base">[ActionBar]</div>`
  }
}
