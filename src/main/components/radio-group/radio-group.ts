import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, classMap, lit } from 'js-element/lit'

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
  tag: 'cp-radio-group',
  styles: [radioGroupStyles, controlStyles],
  uses: [SlRadio, SlRadioGroup],
  impl: lit(radioGroupImpl)
})
class RadioGroup extends component() {
  @prop({ attr: Attrs.string })
  label = ''
}

function radioGroupImpl(self: RadioGroup) {
  return () => {
    return html`
      <div class="base">
        <div class="field-wrapper">
          <div class="label">${self.label}</div>
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
