import { h } from '../main/utils/dom'
import { component, elem } from 'js-element'
import { html, withLit } from 'js-element/lit'
import { Brand } from '../main/components/brand/brand'

export default {
  title: 'brand'
}

import theme from '@shoelace-style/shoelace/dist/themes/light.styles'
const themeStyles = theme.toString()

const brandDemoStyles = `
  .brand-demo {
    display: flex;
    gap: 40px;
  }
`

@elem({
  tag: 'brand-demo',
  uses: [Brand],
  styles: [themeStyles, brandDemoStyles],
  impl: withLit(brandDemoImpl)
})
class BrandDemo extends component() {}

function brandDemoImpl() {
  return () =>
    html`
      <div class="brand-demo">
        <div>
          <sx-brand
            vendor="Size: small"
            title="Back Office"
            size="small"
          ></sx-brand>
          <br />
          <br />
          <sx-brand
            vendor="Size: medium"
            title="Back Office"
            size="medium"
          ></sx-brand>
          <br />
          <br />
          <sx-brand
            vendor="Size: large"
            title="Back Office"
            size="large"
          ></sx-brand>
          <br />
          <br />
          <sx-brand
            vendor="Size: huge"
            title="Back Office"
            size="huge"
          ></sx-brand>
        </div>

        <div>
          <sx-brand
            vendor="Size: small"
            title="Back Office"
            size="small"
            multi-color
          ></sx-brand>
          <br />
          <br />
          <sx-brand
            vendor="Size: medium"
            title="Back Office"
            size="medium"
            multi-color
          ></sx-brand>
          <br />
          <br />
          <sx-brand
            vendor="Size: large"
            title="Back Office"
            size="large"
            multi-color
          ></sx-brand>
          <br />
          <br />
          <sx-brand
            vendor="Size: huge"
            title="Back Office"
            size="huge"
            multi-color
          ></sx-brand>
        </div>
      </div>
    `
}

export const brand = () => h('brand-demo')
