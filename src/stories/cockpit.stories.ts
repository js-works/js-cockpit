import { h } from '../main/utils/dom'
import { component, elem } from 'js-element'
import { html, lit } from 'js-element/lit'

import {
  Brand,
  Cockpit,
  DataForm,
  Fieldset,
  RadioGroup,
  Section,
  SectionsMenu,
  SideMenu,
  Tab,
  Tabs,
  TextArea,
  TextField,
  Theme,
  UserMenu
} from 'js-cockpit'

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
  uses: [Cockpit, SectionsMenu]
})
class CockpitDemo1 extends component() {}

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
    SectionsMenu,
    SideMenu,
    Tab,
    Tabs,
    TextArea,
    TextField,
    UserMenu
  ],
  impl: lit(cockpitDemo2Impl)
})
class CockpitDemo2 extends component() {}

function cockpitDemo2Impl() {
  return () => html`
    <c-cockpit .theme=${Theme.default}>
      <c-brand
        slot="header-start"
        class="orangered"
        headline="my-company"
        subheadline="Back Office"
        multi-color
      ></c-brand>
      <c-sections-menu
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
      ></c-sections-menu>
      <c-user-menu slot="header-end"></c-user-menu>
      <div slot="sidebar" class="lightgreen full-height">
        <c-side-menu></c-side-menu>
      </div>
      <div slot="main" class="yellow full-height">${createDataForm()}</div>
    </c-cockpit>
  `
}

export const cockpit2 = () => h('cockpit-demo2')

function createDataForm() {
  return html`<div>
    <c-data-form headline="Customer">
      <c-section>
        <c-fieldset orient="horizontal">
          <c-text-field label="Customer No." required></c-text-field>
          <c-text-field label="Short name" required></c-text-field>
        </c-fieldset>
      </c-section>
      <c-tabs>
        <c-tab caption="Customer data">
          <c-section caption="Address">
            <c-fieldset>
              <c-select-box label="Salutation"></c-select-box>
              <c-text-field label="First name" required></c-text-field>
              <c-text-field label="Last name" required></c-text-field>
              <c-text-field label="Phone" required></c-text-field>
              <c-text-field label="Mobile"></c-text-field>
            </c-fieldset>
            <c-fieldset>
              <c-text-field label="Company" required></c-text-field>
              <c-text-field label="Alias name"></c-text-field>
              <c-radio-group
                label="Options"
                orient="horizontal"
                required
              ></c-radio-group>
            </c-fieldset>
          </c-section>
          <c-section caption="Contact">
            <c-fieldset>
              <c-text-field label="Phone" required></c-text-field>
              <c-text-field label="Mobile"></c-text-field>
              <c-text-area label="Comments"></c-text-area>
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
