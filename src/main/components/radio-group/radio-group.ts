import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, classMap, lit } from 'js-element/lit'

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'

// icons
import defaultLogoSvg from './assets/default-logo.svg'

// styles
import radioGroupStyles from './radio-group.css'

// === exports =======================================================

export { RadioGroup }

// === RadioGroup ===================================================

@elem({
  tag: 'cp-radio-group',
  styles: radioGroupStyles,
  uses: [SlIcon],
  impl: lit(radioGroupImpl)
})
class RadioGroup extends component() {
  @prop({ attr: Attrs.string, refl: true })
  label = ''
}

function radioGroupImpl(self: RadioGroup) {
  return () => {
    return html` <div class="base">Radio Group</div> `
  }
}
