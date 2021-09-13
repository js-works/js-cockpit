import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, classMap, lit, repeat } from 'js-element/lit'

// custom elements
import SlButton from '@shoelace-style/shoelace/dist/components/button/button'
import SlButtonGroup from '@shoelace-style/shoelace/dist/components/button-group/button-group'
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown'
import SlMenu from '@shoelace-style/shoelace/dist/components/menu/menu'
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item'

// styles
import actionBarStyles from './action-bar.css'

// === exports =======================================================

export { ActionBar }

// === types =========================================================

namespace ActionBar {
  export type Action = {
    kind: 'action'
    text: string
    actionId: string
    disabled?: boolean
  }

  export type ActionGroup = {
    kind: 'action-group'
    text: string
    actions: Action[]
    disabled?: boolean
  }

  export type Actions = (Action | ActionGroup)[]
}

// === ActionBar =====================================================

@elem({
  tag: 'c-action-bar',
  styles: actionBarStyles,
  impl: lit(actionBarImpl),
  uses: [SlButton, SlButtonGroup, SlDropdown, SlMenu, SlMenuItem]
})
class ActionBar extends component() {
  @prop
  actions: ActionBar.Actions | null = null

  @prop({ attr: Attrs.string })
  pill = false
}

function actionBarImpl(self: ActionBar) {
  function render() {
    if (!self.actions) {
      return null
    }

    return html`
      <div class="base">
        <sl-button-group>
          ${repeat(
            self.actions,
            (_, idx) => idx,
            (it, idx) => {
              if (it.kind === 'action') {
                return html`
                  <sl-button
                    size="small"
                    ?disabled=${it.disabled}
                    ?pill=${self.pill}
                  >
                    ${it.text}
                  </sl-button>
                `
              } else {
                return html`
                  <sl-dropdown>
                    <sl-button
                      slot="trigger"
                      size="small"
                      caret
                      ?disabled=${!it.actions ||
                      it.actions.length === 0 ||
                      it.actions.every((it) => it.disabled)}
                      ?pill=${self.pill}
                    >
                      ${it.text}</sl-button
                    >
                    <sl-menu>
                      ${repeat(
                        it.actions,
                        (_, idx) => idx,
                        (it) => {
                          return html`
                            <sl-menu-item ?disabled=${it.disabled}>
                              ${it.text}
                            </sl-menu-item>
                          `
                        }
                      )}
                    </sl-menu>
                  </sl-dropdown>
                `
              }
            }
          )}
        </sl-button-group>
      </div>
    `
  }

  return render
}
