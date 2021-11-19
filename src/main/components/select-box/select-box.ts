import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { classMap, html, createRef, repeat, lit, Ref } from 'js-element/lit'
import {} from 'js-element/hooks'

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
  uses: [SlDivider, SlMenuItem, SlSelect],
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
          <sl-select size="small">
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
