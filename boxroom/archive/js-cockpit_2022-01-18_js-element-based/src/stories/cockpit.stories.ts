import { h } from '../main/utils/dom'
import { elem } from 'js-element'
import { html, lit } from 'js-element/lit'

import {
  Brand,
  Cockpit,
  DateField,
  DataForm,
  Fieldset,
  RadioGroup,
  Section,
  NavMenu,
  SideMenu,
  Tab,
  Tabs,
  TextArea,
  TextField,
  ThemeProvider,
  UserMenu
} from 'js-cockpit'

import { SharedCockpit } from './shared/shared-cockpit'
import { SharedDataExplorer } from './shared/shared-data-explorer'

export default {
  title: 'cockpit'
}

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
  styles: demo1Styles,
  impl: lit(cockpitDemo1Impl),
  uses: [Cockpit, DateField, NavMenu, SharedCockpit, ThemeProvider]
})
class CockpitDemo1 extends HTMLElement {}

function cockpitDemo1Impl() {
  return () => html`
    <c-cockpit>
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
    </c-cockpit>
  `
}

export const cockpit1 = () => h('cockpit-demo1')

// ===============================================================================

@elem({
  tag: 'cockpit-demo2',
  uses: [
    Brand,
    Cockpit,
    DataForm,
    Fieldset,
    RadioGroup,
    Section,
    NavMenu,
    SideMenu,
    SharedDataExplorer,
    Tab,
    Tabs,
    TextArea,
    TextField,
    UserMenu
  ],
  impl: lit(cockpitDemo2Impl)
})
class CockpitDemo2 extends HTMLElement {}

function cockpitDemo2Impl() {
  return () => html`
    <shared-cockpit>
      <shared-data-explorer></shared-data-explorer>
    </shared-cockpit>
  `
}

export const cockpit2 = () => h('cockpit-demo2', { lang: 'en-US' })

@elem({
  tag: 'cockpit-demo3',
  uses: [
    Brand,
    Cockpit,
    DataForm,
    Fieldset,
    RadioGroup,
    Section,
    NavMenu,
    SideMenu,
    SharedDataExplorer,
    Tab,
    Tabs,
    TextArea,
    TextField,
    UserMenu
  ],
  impl: lit(cockpitDemo3Impl)
})
class CockpitDemo3 extends HTMLElement {}

function cockpitDemo3Impl() {
  return () => html` <shared-cockpit>${createDataForm()}</shared-cockpit> `
}

export const cockpit3 = () => h('cockpit-demo3')

function createDataForm() {
  return html`<div>
    <c-data-form headline="Customer" lang="de-DE">
      <c-section>
        <c-fieldset orient="horizontal">
          <c-text-field label="Customer No." required></c-text-field>
          <c-text-field label="Short name" required></c-text-field>
        </c-fieldset>
      </c-section>
      <c-tabs>
        <c-tab caption="Customer data">
          <c-section caption="Customer address">
            <c-fieldset>
              <c-select-box label="Salutation"></c-select-box>
              <c-text-field label="First name" required></c-text-field>
              <c-text-field label="Last name" required></c-text-field>
              <c-text-field label="Phone" required></c-text-field>
            </c-fieldset>
            <c-fieldset>
              <c-text-field label="Company" required></c-text-field>
              <c-text-field label="Display name"></c-text-field>
              <c-text-field label="Alias name"></c-text-field>
              <c-date-field
                label="Day of birth"
                value="2017-01-01"
                required
                lang="en-US"
              ></c-date-field>
              <c-date-field
                label="Day of birth 2"
                value="2017-01-01"
                required
                lang="de-DE"
              ></c-date-field>
              <c-date-range label="Date range" required></c-date-range>
              <!--
              <c-radio-group
                label="Options"
                orient="horizontal"
                required
              ></c-radio-group>
              -->
            </c-fieldset>
          </c-section>
          <c-section caption="Contact information">
            <c-fieldset>
              <c-text-field label="Phone" required></c-text-field>
              <c-text-field label="Mobile"></c-text-field>
              <c-text-area label="Comments"></c-text-area>
              <c-date-field label="Day of birth" required></c-date-field>
              <c-date-range label="Date range" required></c-date-range>
            </c-fieldset>
          </c-section>
        </c-tab>
        <c-tab caption="Documents">Tab2</c-tab>
        <c-tab caption="Images">Tab3</c-tab>
        <c-tab caption="Settings">Tab3</c-tab>
        <c-tab caption="Permissions">Tab3</c-tab>
      </c-tabs>
    </c-data-form>
  </div>`
}
