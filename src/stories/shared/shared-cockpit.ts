import { h } from '../../main/utils/dom'
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

// ===============================================================================

@elem({
  tag: 'shared-cockpit',
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
  impl: lit(sharedCockpitImpl)
})
export class SharedCockpit extends component() {}

function sharedCockpitImpl() {
  return () => html`
    <c-cockpit .theme=${Theme.turquoise}>
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
      <div slot="main" class="yellow full-height"><slot></slot></div>
    </c-cockpit>
  `
}

export const cockpit2 = () => h('cockpit-demo2')
