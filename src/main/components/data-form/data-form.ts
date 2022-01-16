import { elem, prop, override, Attrs } from 'js-element'
import { html, classMap, lit } from 'js-element/lit'

// custom elements
import { ActionBar } from 'js-cockpit'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlIconButton from '@shoelace-style/shoelace/dist/components/icon-button/icon-button'
import SlButton from '@shoelace-style/shoelace/dist/components/button/button'

// styles
import dataFormStyles from './data-form.css'
import rightAlignedLabelsStyles from '../../shared/css/label-alignment-aside.css'

// icons
import closeIcon from 'remixicon/icons/System/close-fill.svg'

// === exports =======================================================

export { DataForm }

// === DataForm ===================================================

@elem({
  tag: 'c-data-form',
  styles: [dataFormStyles, rightAlignedLabelsStyles],
  impl: lit(dataFormImpl),
  uses: [ActionBar, SlIcon, SlIconButton]
})
class DataForm extends HTMLElement {
  @prop({ attr: Attrs.string })
  headline = ''
}

function dataFormImpl(self: DataForm) {
  const actions: ActionBar.Actions = [
    {
      kind: 'action',
      actionId: 'edit',
      text: 'Edit'
    },
    {
      kind: 'action',
      actionId: 'deactivate',
      text: 'Deactivate'
    },
    {
      kind: 'action',
      actionId: 'print',
      text: 'Print'
    },
    {
      kind: 'action',
      actionId: 'delete',
      text: 'Delete'
    }
  ]

  return () => {
    return html`
      <div class="base">
        <div class="header">
          <div class="headline">${self.headline}</div>
          <div class="actions">
            <c-action-bar .actions=${actions}></c-action-bar>
          </div>
          <div>
            <sl-button class="close-button" size="small">
              <sl-icon
                src=${closeIcon}
                slot="prefix"
                class="close-icon"
              ></sl-icon>
            </sl-button>
          </div>
        </div>
        <slot></slot>
      </div>
    `
  }
}
