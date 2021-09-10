import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, classMap, lit } from 'js-element/lit'

// custom elements
import { ActionBar } from 'js-cockpit'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlIconButton from '@shoelace-style/shoelace/dist/components/icon-button/icon-button'
import SlButton from '@shoelace-style/shoelace/dist/components/button/button'

// styles
import dataFormStyles from './data-form.css'
import rightAlignedLabelsStyles from '../../shared/css/right-aligned-labels.css'

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
class DataForm extends component() {
  @prop({ attr: Attrs.string })
  headline = ''
}

function dataFormImpl(self: DataForm) {
  return () => {
    return html`
      <div class="base">
        <div class="header">
          <div class="headline">${self.headline}</div>
          <div class="actions">
            <c-action-bar></c-action-bar>
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
