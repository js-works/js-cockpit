import { h } from '../main/utils/dom'
import { component, elem } from 'js-element'
import { html, lit } from 'js-element/lit'
import { AppLayout } from '../main/components/app-layout/app-layout'

export default {
  title: 'app-layout'
}

import theme from '@shoelace-style/shoelace/dist/themes/light.styles'
const themeStyles = theme.toString()

const styles = `
  .orange {
    padding: 4px 8px;
    background-color: orange;
  }
  
  .orangered {
    padding: 4px 8px;
    background-color: orangered;
  }

  .green {
    padding: 4px 8px;
    background-color: green;
  }
  
  .lightgreen {
    padding: 4px 8px;
    background-color: lightgreen;
  }

  .gold {
    padding: 4px 8px;
    background-color: gold;
  }
  
  .yellow {
    padding: 4px 8px;
    background-color: yellow;
  }

  .full-height {
    height: 100%;
    box-sizing: border-box;
  }
`

@elem({
  tag: 'app-layout-demo',
  styles: [themeStyles, styles],
  uses: [AppLayout],
  impl: lit(appLayoutDemoImpl)
})
class AppLayoutDemo extends component() {}

function appLayoutDemoImpl() {
  return () => html`
    <cp-app-layout>
      <div slot="header-start" class="orangered">header-start</div>
      <div slot="header" class="orange">header</div>
      <div slot="header-end" class="orangered">header-end</div>
      <div slot="subheader-start" class="orange">subheader-start</div>
      <div slot="subheader" class="orangered">subheader</div>
      <div slot="subheader-end" class="orange">subheader-end</div>
      <div slot="sidebar-start" class="green">sidebar-start</div>
      <div slot="sidebar" class="lightgreen full-height">sidebar</div>
      <div slot="sidebar-end" class="green">sidebar-end</div>
      <div slot="main-start" class="gold">main-start</div>
      <div slot="main" class="yellow full-height">main</div>
      <div slot="main-end" class="gold">main-end</div>
      <div slot="sidebar2-start" class="green">sidebar2-start</div>
      <div slot="sidebar2" class="lightgreen full-height">sidebar2</div>
      <div slot="sidebar2-end" class="green">sidebar2-end</div>
      <div slot="footer-start" class="orangered">footer-start</div>
      <div slot="footer" class="orange">footer</div>
      <div slot="footer-end" class="orangered">footer-end</div>
    </cp-app-layout>
  `
}

export const appLayout = () => h('app-layout-demo')
