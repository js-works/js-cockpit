import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, lit } from 'js-element/lit'

// styles
import tabStyles from './tab.css'

// === exports =======================================================

export { Tab }

// === Tab ===================================================

@elem({
  tag: 'cp-tab',
  styles: tabStyles,
  impl: lit(tabImpl)
})
class Tab extends component() {
  @prop({ attr: Attrs.string })
  caption = ''
}

function tabImpl(self: Tab) {
  return () => html`
    <div class="base">
      <slot></slot>
    </div>
  `
}
