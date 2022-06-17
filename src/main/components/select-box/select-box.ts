import {
  bind,
  createEmitter,
  elem,
  prop,
  Attrs,
  Component,
  Listener
} from '../../utils/components'

import { classMap, createRef, html, ref, repeat } from '../../utils/lit'

// custom elements
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select'
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item'
import SlDivider from '@shoelace-style/shoelace/dist/components/divider/divider'

// styles
import controlStyles from '../../shared/css/control.css'
import selectBoxStyles from './select-box.css'

// === exports =======================================================

export { SelectBox }

// === types =========================================================

// === SelectBox =====================================================

@elem({
  tag: 'c-select-box',
  styles: [controlStyles, selectBoxStyles],
  uses: [SlDivider, SlMenuItem, SlSelect]
})
class SelectBox extends Component {
  @prop({ attr: Attrs.string })
  value = ''

  @prop({ attr: Attrs.string })
  label = ''

  @prop({ attr: Attrs.boolean })
  disabled = false

  @prop({ attr: Attrs.boolean })
  required = false

  @prop({ attr: Attrs.string })
  error = ''

  reset() {}

  render() {
    return html`
      <div class="base ${classMap({ required: this.required })}">
        <div class="field-wrapper">
          <div class="control">
            <sl-select size="small">
              <div slot="label" class="label">${this.label}</div>
              <sl-menu-item value="option-1">Option 1</sl-menu-item>
              <sl-menu-item value="option-2">Option 2</sl-menu-item>
              <sl-menu-item value="option-3">Option 3</sl-menu-item>
              <sl-divider></sl-divider>
              <sl-menu-item value="option-4">Option 4</sl-menu-item>
              <sl-menu-item value="option-5">Option 5</sl-menu-item>
              <sl-menu-item value="option-6">Option 6</sl-menu-item>
            </sl-select>
          </div>
        </div>
      </div>
    `
  }
}
