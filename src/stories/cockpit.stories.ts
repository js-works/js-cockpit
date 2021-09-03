import { h } from '../main/utils/dom'
import { component, elem } from 'js-element'
import { html, lit } from 'js-element/lit'
import { Cockpit } from '../main/components/cockpit/cockpit'
import { Brand } from '../main/components/brand/brand'
import { UserMenu } from '../main/components/user-menu/user-menu'
import { SectionsMenu } from '../main/components/sections-menu/sections-menu'
import { SideMenu } from '../main/components/side-menu/side-menu'
import { DataForm } from '../main/components/data-form/data-form'

export default {
  title: 'cockpit'
}

import theme from '@shoelace-style/shoelace/dist/themes/light.styles'
const themeStyles = theme.toString()

const demo1Styles = `
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
  tag: 'cockpit-demo1',
  styles: [themeStyles, demo1Styles],
  uses: [Cockpit, SectionsMenu],
  impl: lit(cockpitDemo1Impl)
})
class CockpitDemo1 extends component() {}

function cockpitDemo1Impl() {
  return () => html`
    <jsc-cockpit>
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
    </jsc-cockpit>
  `
}

export const cockpit1 = () => h('cockpit-demo1')

// ===============================================================================

@elem({
  tag: 'cockpit-demo2',
  styles: [themeStyles],
  uses: [Brand, Cockpit, DataForm, SectionsMenu, SideMenu, UserMenu],
  impl: lit(cockpitDemo2Impl)
})
class CockpitDemo2 extends component() {}

function cockpitDemo2Impl() {
  return () => html`
    <jsc-cockpit>
      <jsc-brand
        slot="header-start"
        class="orangered"
        vendor="my-company"
        title="Back Office"
        multi-color
      ></jsc-brand>
      <jsc-sections-menu
        slot="header"
        class="orange"
        .sections=${[
          {
            id: 1,
            title: 'Dashboard'
          },
          {
            id: 2,
            title: 'User management'
          },
          {
            id: 3,
            title: 'Catalog'
          },
          {
            id: 4,
            title: 'CMS'
          }
        ]}
        .activeSection=${2}
      ></jsc-sections-menu>
      <jsc-user-menu slot="header-end"></jsc-user-menu>
      <div slot="sidebar" class="lightgreen full-height">
        <jsc-side-menu></jsc-side-menu>
      </div>
      <div slot="main" class="yellow full-height">${createDataForm()}</div>
    </jsc-cockpit>
  `
}

export const cockpit2 = () => h('cockpit-demo2')

function createDataForm() {
  return html`<div><jsc-data-form></jsc-data-form></div>`
}
