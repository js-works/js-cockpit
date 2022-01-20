import { h } from '../../main/utils/dom'
import { sharedTheme } from '../shared/shared-theme'
import { elem, Component } from '../../main/utils/components'
import { html } from '../../main/utils/lit'

import {
  showInfoDialog,
  loadTheme,
  Brand,
  Cockpit,
  DataForm,
  RadioGroup,
  Section,
  NavMenu,
  SideMenu,
  Tab,
  Tabs,
  TextArea,
  TextField,
  UserMenu
} from 'js-cockpit'

export default {
  title: 'cockpit'
}

loadTheme(sharedTheme)

// ===============================================================================

@elem({
  tag: 'shared-cockpit',
  uses: [
    Brand,
    Cockpit,
    DataForm,
    RadioGroup,
    Section,
    NavMenu,
    SideMenu,
    Tab,
    Tabs,
    TextArea,
    TextField,
    UserMenu
  ]
})
export class SharedCockpit extends Component {
  render() {
    const menu: SideMenu.Menu = {
      kind: 'groups',
      collapseMode: 'none',
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

    return html`
      <c-theme-provider .theme=${sharedTheme}>
        <c-cockpit>
          <c-brand
            slot="header-start"
            headline="my-company"
            text="Back Office"
            multi-color
          ></c-brand>
          <c-nav-menu
            slot="header"
            .items=${[
              {
                action: '1',
                text: 'Dashboard'
              },
              {
                action: '2',
                text: 'User management'
              },
              {
                action: '3',
                text: 'Catalog'
              },
              {
                action: '4',
                text: 'CMS'
              }
            ]}
            .activeItem=${'2'}
            @c-action=${notSupportedHandler}
          ></c-nav-menu>
          <c-user-menu
            slot="header-end"
            user-name="Jane Doe"
            @c-logout=${notSupportedHandler}
          ></c-user-menu>
          <div slot="sidebar" class="lightgreen full-height">
            <c-side-menu .menu=${menu} .activeItemId=${'3'}></c-side-menu>
          </div>
          <div slot="main" class="yellow full-height"><slot></slot></div>
        </c-cockpit>
      </c-theme-provider>
    `
  }
}

function notSupportedHandler() {
  showInfoDialog({
    title: 'Not implemented',
    message: 'This feature is not implmented as this is just a simple demo.',
    okText: 'Okay, I understand'
  })
}

export const cockpit2 = () => h('cockpit-demo2')
