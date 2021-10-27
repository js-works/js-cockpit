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
  Themes,
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
  const menu: SideMenu.Menu = {
    kind: 'groups',
    collapseMode: 'full',
    groups: [
      {
        kind: 'group',
        groupId: 'products',
        title: 'Products',
        items: [
          {
            kind: 'item',
            itemId: 'manage-products',
            title: 'Manage products'
          },
          {
            kind: 'item',
            itemId: 'price-calculation',
            title: 'Price calculation'
          },
          {
            kind: 'item',
            itemId: 'import-products',
            title: 'Import products'
          }
        ]
      },
      {
        kind: 'group',
        groupId: 'services',
        title: 'Services',
        items: [
          {
            kind: 'item',
            itemId: 'assign-services-to-products',
            title: 'Assign services to products'
          },
          {
            kind: 'item',
            itemId: 'export-services',
            title: 'Export services'
          }
        ]
      },
      {
        kind: 'group',
        groupId: 'administration',
        title: 'Administration',
        items: [
          {
            kind: 'item',
            itemId: 'user-management',
            title: 'User management'
          },
          {
            kind: 'item',
            itemId: 'configuration',
            title: 'Configuration'
          },
          {
            kind: 'item',
            itemId: 'cronjobs',
            title: 'Cronjobs'
          }
        ]
      }
    ]
  }

  return () => html`
    <c-cockpit .theme=${Themes.coral}>
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
        <c-side-menu .menu=${menu} .activeItemId=${'3'}></c-side-menu>
      </div>
      <div slot="main" class="yellow full-height"><slot></slot></div>
    </c-cockpit>
  `
}

export const cockpit2 = () => h('cockpit-demo2')
