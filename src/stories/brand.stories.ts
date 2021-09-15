import { h } from '../main/utils/dom'
import { component, elem } from 'js-element'
import { html, lit } from 'js-element/lit'
import { Brand, ThemeProvider, Theme } from 'js-cockpit'

export default {
  title: 'brand'
}

const brandDemoStyles = `
  .brand-demo {
    display: flex;
    gap: 40px;
  }
`

@elem({
  tag: 'brand-demo',
  uses: [Brand, ThemeProvider],
  styles: [brandDemoStyles],
  impl: lit(brandDemoImpl)
})
class BrandDemo extends component() {}

function brandDemoImpl() {
  return () =>
    html`
      <div class="brand-demo">
        <c-theme-provider .theme=${Theme.apricot}>
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
        </c-theme-provider>
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
