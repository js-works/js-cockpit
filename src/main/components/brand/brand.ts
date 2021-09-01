import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, classMap, withLit } from 'js-element/lit'

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'

// icons
import defaultLogoSvg from './assets/default-logo.svg'

// styles
import brandStyles from './brand.css'

// === exports =======================================================

export { Brand }

// === Brand ===================================================

@elem({
  tag: 'jsc-brand',
  styles: brandStyles,
  uses: [SlIcon],
  impl: withLit(loginScreenImpl)
})
class Brand extends component() {
  @prop({ attr: Attrs.string })
  logo = ''

  @prop({ attr: Attrs.string })
  vendor = ''

  @prop({ attr: Attrs.string })
  title = ''

  @prop({ attr: Attrs.string })
  size: 'small' | 'medium' | 'large' | 'huge' = 'medium'

  @prop({ attr: Attrs.boolean })
  multiColor = false
}

function loginScreenImpl(self: Brand) {
  return () => {
    const logo = self.logo?.trim() || defaultLogoSvg
    const size = self.size || 'medium'

    return html`
      <div class="base">
        <div
          class=${classMap({
            content: true,
            [size]: true,
            'multi-color': self.multiColor
          })}
        >
          <sl-icon src=${logo} class="logo"></sl-icon>
          <div class="vendor-and-title">
            <div class="vendor">${self.vendor}</div>
            <div class="title">${self.title}</div>
          </div>
        </div>
      </div>
    `
  }
}
