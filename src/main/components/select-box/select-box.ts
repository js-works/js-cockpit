import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { classMap, html, createRef, repeat, lit, Ref } from 'js-element/lit'
import {} from 'js-element/hooks'
import { useFormCtrl } from '../../ctrls/form-ctrl'

// custom elements
import SlInput from '@shoelace-style/shoelace/dist/components/input/input'

// styles
import controlStyles from '../../shared/css/control.css'
import selectBoxStyles from './select-box.css'

// === exports =======================================================

export { SelectBox }

// === types =========================================================

// === SelectBox =====================================================

@elem({
  tag: 'cp-select-box',
  styles: [controlStyles, selectBoxStyles],
  uses: [SlInput],
  impl: lit(selectBoxImpl)
})
class SelectBox extends component<{
  reset(): void
}>() {
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
}

function selectBoxImpl(self: SelectBox) {
  // const getFormCtrl = useFormCtrl()

  return () => html`
    <div class="base ${classMap({ required: self.required })}">
      <div class="field-wrapper">
        <div class="label">${self.label}</div>
        <div class="control">
          <sl-input class="input" size="small"></sl-input>
          <div class="error">${self.error}</div>
        </div>
      </div>
    </div>
  `
}
