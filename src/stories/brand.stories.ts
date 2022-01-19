import { Brand, Theme, ThemeProvider } from 'js-cockpit'
import { elem, Component } from '../main/utils/components'
import { html } from '../main/utils/lit'
import { h } from '../main/utils/dom'
import { sharedTheme } from './shared/shared-theme'

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
  styles: [brandDemoStyles]
})
class BrandDemo extends Component {
  render() {
    return html`
      <c-theme-provider .theme=${sharedTheme}>
        <div class="brand-demo">
          <div>
            <c-brand
              headline="Size: small"
              text="Back Office"
              size="small"
            ></c-brand>
            <br />
            <br />
            <c-brand
              headline="Size: medium"
              text="Back Office"
              size="medium"
            ></c-brand>
            <br />
            <br />
            <c-brand
              headline="Size: large"
              text="Back Office"
              size="large"
            ></c-brand>
            <br />
            <br />
            <c-brand
              headline="Size: huge"
              text="Back Office"
              size="huge"
            ></c-brand>
          </div>

          <div>
            <c-brand
              headline="Size: small"
              text="Back Office"
              size="small"
              multi-color
            ></c-brand>
            <br />
            <br />
            <c-brand
              headline="Size: medium"
              text="Back Office"
              size="medium"
              multi-color
            ></c-brand>
            <br />
            <br />
            <c-brand
              headline="Size: large"
              text="Back Office"
              size="large"
              multi-color
            ></c-brand>
            <br />
            <br />
            <c-brand
              headline="Size: huge"
              text="Back Office"
              size="huge"
              multi-color
            ></c-brand>
          </div>
        </div>
      </c-theme-provider>
    `
  }
}

export const brand = () => h('brand-demo')
