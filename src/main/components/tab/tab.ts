import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, classMap, lit } from 'js-element/lit'

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'

// icons

// styles
import tabStyles from './tab.css'

// === exports =======================================================

export { Tab }

// === Tab ===================================================

@elem({
  tag: 'jsc-tab',
  styles: tabStyles,
  uses: [SlIcon],
  impl: lit(tabImpl)
})
class Tab extends component() {
  @prop({ attr: Attrs.string })
  title = ''
}

function tabImpl(self: Tab) {
  return () => {
    return html` <div class="base">[Tab:${self.title}]</div> `
  }
}
