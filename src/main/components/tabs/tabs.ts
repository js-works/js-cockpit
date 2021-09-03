import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, classMap, lit } from 'js-element/lit'

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'

// icons
import defaultLogoSvg from './assets/default-logo.svg'

// styles
import tabsStyles from './tabs.css'

// === exports =======================================================

export { Tabs }

// === Tabs ===================================================

@elem({
  tag: 'jsc-tabs',
  styles: tabsStyles,
  uses: [SlIcon],
  impl: lit(tabsImpl)
})
class Tabs extends component() {}

function tabsImpl(self: Tabs) {
  return () => {
    return html` <div class="base">[Tabs]</div> `
  }
}
