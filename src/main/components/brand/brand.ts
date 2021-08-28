// external imports
import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, createRef, repeat, withLit, Ref } from 'js-element/lit'

// custom elements
import SlButton from '@shoelace-style/shoelace/dist/components/button/button'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'

// styles
import brandStyles from './brand.css'

// === exports =======================================================

export { Brand }

// === constants =====================================================

// === types =========================================================

// === Brand ===================================================

@elem({
  tag: 'sx-brand',
  styles: brandStyles,
  uses: [SlButton, SlIcon],
  impl: withLit(loginScreenImpl)
})
class Brand extends component() {
  @prop({ attr: Attrs.string })
  vendor = ''

  @prop({ attr: Attrs.string })
  title = ''
}

function loginScreenImpl(self: Brand) {
  return () => html`
    <div class="base">
      <div class="logo">x</div>
      <div class="vendor">meet&greet</div>
      <div class="title">Back Office</div>
    </div>
  `
}
