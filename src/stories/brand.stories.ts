import { h } from '../main/utils/dom'
import { component, elem } from 'js-element'
import { html, lit } from 'js-element/lit'
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
  impl: lit(brandDemoImpl)
})
class BrandDemo extends component() {}

function brandDemoImpl() {
  return () =>
    html`
      <div class="brand-demo">
        <div>
          <cp-brand
            vendor="Size: small"
            title="Back Office"
            size="small"
          ></cp-brand>
          <br />
          <br />
          <cp-brand
            vendor="Size: medium"
            title="Back Office"
            size="medium"
          ></cp-brand>
          <br />
          <br />
          <cp-brand
            vendor="Size: large"
            title="Back Office"
            size="large"
          ></cp-brand>
          <br />
          <br />
          <cp-brand
            vendor="Size: huge"
            title="Back Office"
            size="huge"
          ></cp-brand>
        </div>

        <div>
          <cp-brand
            vendor="Size: small"
            title="Back Office"
            size="small"
            multi-color
          ></cp-brand>
          <br />
          <br />
          <cp-brand
            vendor="Size: medium"
            title="Back Office"
            size="medium"
            multi-color
          ></cp-brand>
          <br />
          <br />
          <cp-brand
            vendor="Size: large"
            title="Back Office"
            size="large"
            multi-color
          ></cp-brand>
          <br />
          <br />
          <cp-brand
            vendor="Size: huge"
            title="Back Office"
            size="huge"
            multi-color
          ></cp-brand>
        </div>
      </div>
    `
}

export const brand = () => h('brand-demo')
