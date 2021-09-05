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
  tag: 'cp-data-form',
  styles: [dataFormStyles, rightAlignedLabelsStyles],
  uses: [SlIcon],
  impl: lit(dataFormImpl)
})
class DataForm extends component() {
  @prop({ attr: Attrs.string })
  title = ''
}

function dataFormImpl(self: DataForm) {
  return () => {
    return html`
      <div class="base">
        <div class="header">
          <div class="title">DataForm</div>
        </div>
        <slot></slot>
      </div>
    `
  }
}
