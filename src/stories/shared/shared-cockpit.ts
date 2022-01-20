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
      groups: [
        {
          kind: 'group',
          groupId: 'products',
          text: 'Products',
          items: [
            {
              kind: 'item',
              itemId: 'manage-products',
              text: 'Manage products'
            },
            {
              kind: 'item',
              itemId: 'price-calculation',
              text: 'Price calculation'
            },
            {
              kind: 'item',
              itemId: 'import-products',
              text: 'Import products'
            }
          ]
        },
        {
          kind: 'group',
          groupId: 'services',
          text: 'Services',
          items: [
            {
              kind: 'item',
              itemId: 'assign-services-to-products',
              text: 'Assign services to products'
            },
            {
              kind: 'item',
              itemId: 'export-services',
              text: 'Export services'
            }
          ]
        },
        {
          kind: 'group',
          groupId: 'administration',
          text: 'Administration',
          items: [
            {
              kind: 'item',
              itemId: 'user-management',
              text: 'User management'
            },
            {
              kind: 'item',
              itemId: 'configuration',
              text: 'Configuration'
            },
            {
              kind: 'item',
              itemId: 'cronjobs',
              text: 'Cronjobs'
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
                itemId: '1',
                text: 'Dashboard'
              },
              {
                itemId: '2',
                text: 'User management'
              },
              {
                itemId: '3',
                text: 'Catalog'
              },
              {
                itemId: '4',
                text: 'CMS'
              }
            ]}
            active-item="2"
            @c-action=${notImplementedHandler}
          ></c-nav-menu>
          <c-user-menu
            slot="header-end"
            user-name="Jane Doe"
            @c-logout=${notImplementedHandler}
          ></c-user-menu>
          <div slot="sidebar" class="full-height">
            <c-side-menu
              header-text="User management"
              .menu=${menu}
              active-item="export-services"
              @c-action=${notImplementedHandler}
              collapse-mode="manual"
            ></c-side-menu>
          </div>
          <div slot="main" class="yellow full-height"><slot></slot></div>
        </c-cockpit>
      </c-theme-provider>
    `
  }
}

function notImplementedHandler() {
  showInfoDialog({
    title: 'Not implemented',
    message: 'This  is not implemented as this is just a very simple demo.',
    okText: 'Okay, I understand'
  })
}

export const cockpit2 = () => h('cockpit-demo2')
