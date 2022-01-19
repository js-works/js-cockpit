import {
  bind,
  elem,
  prop,
  Attrs,
  Component,
  Listener
} from '../../utils/components'

import { classMap, createRef, html, ref, repeat } from '../../utils/lit'

// custom elements
import SlRadio from '@shoelace-style/shoelace/dist/components/radio/radio'
import SlRadioGroup from '@shoelace-style/shoelace/dist/components/radio-group/radio-group'

// styles
import radioGroupStyles from './radio-group.css'
import controlStyles from '../../shared/css/control.css'

// === exports =======================================================

export { RadioGroup }

// === RadioGroup ===================================================

@elem({
  tag: 'c-radio-group',
  styles: [radioGroupStyles, controlStyles],
  uses: [SlRadio, SlRadioGroup]
})
class RadioGroup extends Component {
  @prop({ attr: Attrs.string })
  label = ''

  render() {
    return html`
      <div class="base">
        <div class="field-wrapper">
          <div class="label">${this.label}</div>
          <div class="control">
            <sl-radio-group>
              <sl-radio value="1" checked>Item 1</sl-radio>
              <sl-radio value="2">Item 2</sl-radio>
              <sl-radio value="3">Item 3</sl-radio>
            </sl-radio-group>
          </div>
        </div>
      </div>
    `
  }
}
