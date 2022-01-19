import { Brand, Theme, ThemeProvider } from 'js-cockpit'
//import { elem, Component } from '../main/utils/components'
//import { html } from '../main/utils/lit'
import { h } from '../main/utils/dom'
import { sharedTheme } from './shared/shared-theme'

import { html, LitElement, unsafeCSS } from 'lit'
import { property } from 'lit/decorators/property.js'
import { customElement } from 'lit/decorators/custom-element.js'

export default {
  title: 'brand'
}

const brandDemoStyles = `
  .brand-demo {
    display: flex;
    gap: 40px;
  }
`

@customElement('my-demo')
class MyDemo extends LitElement {
  @property()
  text = 'waiting...'

  constructor() {
    super()

    setTimeout(() => {
      this.text = 'done'
      //this.requestUpdate()
    }, 3000)
  }

  render() {
    return html`<div>${this.text}</div>`
  }
}

void (Brand || ThemeProvider)

@customElement('brand-demo')
//  tag: 'brand-demo',
//  uses: [Brand, ThemeProvider],
//  styles: [brandDemoStyles]
//})
class BrandDemo extends LitElement {
  static styles = unsafeCSS(brandDemoStyles)

  constructor() {
    super()

    /*
    setTimeout(() => {
      const brandElem = this.shadowRoot!.querySelector<Brand>('c-brand')!
      brandElem.size = 'huge'
      brandElem?.requestUpdate()
    }, 1000)
    */
  }

  render() {
    return html`
      <c-theme-provider .theme=${sharedTheme}>
        <my-demo></my-demo>
        <hr />
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

export const brand = () => h('my-demo')
