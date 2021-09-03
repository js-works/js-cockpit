import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, classMap, lit } from 'js-element/lit'

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'

// styles
import dataFormStyles from './data-form.css'

// === exports =======================================================

export { DataForm }

// === DataForm ===================================================

@elem({
  tag: 'jsc-data-form',
  styles: dataFormStyles,
  uses: [SlIcon],
  impl: lit(dataFormImpl)
})
class DataForm extends component() {
  @prop({ attr: Attrs.string })
  title = ''
}

function dataFormImpl(self: DataForm) {
  return () => {
    return html` <div class="base">DataForm<br /><slot></slot></div> `
  }
}
