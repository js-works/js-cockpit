import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, classMap, lit } from 'js-element/lit'

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'

// styles
import dataFormStyles from './data-form.css'
import rightAlignedLabelsStyles from '../../shared/css/right-aligned-labels.css'

// === exports =======================================================

export { DataForm }

// === DataForm ===================================================

@elem({
  tag: 'c-data-form',
  styles: [dataFormStyles, rightAlignedLabelsStyles],
  uses: [SlIcon],
  impl: lit(dataFormImpl)
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
        </div>
        <slot></slot>
      </div>
    `
  }
}
