import { h } from '../main/utils/dom'
import { component, elem } from 'js-element'
import { html, lit } from 'js-element/lit'
import { Brand } from 'js-cockpit'

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
          <c-brand
            headline="Size: small"
            subheadline="Back Office"
            size="small"
          ></c-brand>
          <br />
          <br />
          <c-brand
            headline="Size: mediume"
            subheadline="Back Office"
            size="medium"
          ></c-brand>
          <br />
          <br />
          <c-brand
            headline="Size: large"
            subheadline="Back Office"
            size="large"
          ></c-brand>
          <br />
          <br />
          <c-brand
            headline="Size: huge"
            subheadline="Back Office"
            size="huge"
          ></c-brand>
        </div>

        <div>
          <c-brand
            headline="Size: small"
            subheadline="Back Office"
            size="small"
            multi-color
          ></c-brand>
          <br />
          <br />
          <c-brand
            headline="Size: medium"
            subheadline="Back Office"
            size="medium"
            multi-color
          ></c-brand>
          <br />
          <br />
          <c-brand
            headline="Size: large"
            subheadline="Back Office"
            size="large"
            multi-color
          ></c-brand>
          <br />
          <br />
          <c-brand
            headline="Size: huge"
            subheadline="Back Office"
            size="huge"
            multi-color
          ></c-brand>
        </div>
      </div>
    `
}

export const brand = () => h('brand-demo')
/*
document.documentElement.lang = 'de'
Dialogs.error('Please enter your telephone number').then((result) =>
  alert(result)
)
*/
