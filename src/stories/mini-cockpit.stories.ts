import { afterConnect, bind, elem, Component } from '../main/utils/components'
import { html } from '../main/utils/lit'
import { h } from '../main/utils/dom'
import { sharedTheme } from './shared/shared-theme'
import { SharedDataExplorer } from './shared/shared-data-explorer'

import { Cockpit, SideMenu, ThemeProvider } from 'js-cockpit'

@elem({
  tag: 'mini-cockpit',
  uses: [Cockpit, SharedDataExplorer, SideMenu, ThemeProvider]
})
class MiniCockpit extends Component {
  render() {
    return html`
      <c-theme-provider .theme=${sharedTheme}>
        <c-cockpit>
          <c-brand
            slot="sidebar-start"
            headline="my-company"
            text="Back Office"
            size="large"
            multi-color
          ></c-brand>
          <c-side-menu
            slot="sidebar"
            active-item="manage-products"
            .menu=${menu}
          ></c-side-menu>
          <div slot="main">
            <shared-data-explorer></shared-data-explorer>
          </div>
        </c-cockpit>
      </c-theme-provider>
    `
  }
}

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
          itemId: 'database-configuration',
          text: 'Database configuration'
        },
        {
          kind: 'item',
          itemId: 'log-settings',
          text: 'Log setting'
        },
        {
          kind: 'item',
          itemId: 'export-configurations',
          text: 'Export all configurations'
        }
      ]
    }
  ]
}

export default {
  title: 'mini-cockpit'
}

export const miniCockpit = () => h('mini-cockpit')
