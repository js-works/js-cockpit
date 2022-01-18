import { elem, prop, override, Attrs } from 'js-element'
import { html, classMap, lit } from 'js-element/lit'

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
  tag: 'c-brand',
  styles: brandStyles,
  uses: [SlIcon],
  impl: lit(brandImpl)
})
class Brand extends HTMLElement {
  @prop({ attr: Attrs.string })
  logo = ''

  @prop({ attr: Attrs.string })
  headline = ''

  @prop({ attr: Attrs.string })
  text = ''

  @prop({ attr: Attrs.string })
  size: 'small' | 'medium' | 'large' | 'huge' = 'medium'

  @prop({ attr: Attrs.boolean })
  multiColor = false
}

function brandImpl(self: Brand) {
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
          <div class="headline-and-text">
            <div class="headline">${self.headline}</div>
            <div class="text">${self.text}</div>
          </div>
        </div>
      </div>
    `
  }
}
