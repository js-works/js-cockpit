import { afterConnect, bind, elem, Component } from '../main/utils/components'
import { html } from '../main/utils/lit'
import { h } from '../main/utils/dom'
import { sharedTheme } from './shared/shared-theme'
import { SharedDataExplorer } from './shared/shared-data-explorer'
import { SharedDataForm } from './shared/shared-data-form'

import { MicroCockpit, SideMenu, ThemeProvider } from 'js-cockpit'

// icons
import dashboardIcon from 'bootstrap-icons/icons/house-door.svg'
import salesIcon from 'bootstrap-icons/icons/graph-up-arrow.svg'
import transactionsIcon from 'bootstrap-icons/icons/table.svg'
import reportsIcon from 'bootstrap-icons/icons/file-earmark-text.svg'
import scheduleIcon from 'bootstrap-icons/icons/calendar-week.svg'

@elem({
  tag: 'micro-cockpit-demo',
  uses: [MicroCockpit, SharedDataExplorer, SharedDataForm]
})
class MicroCockpitDemo extends Component {
  render() {
    return html`
      <c-micro-cockpit .config=${getCockpitConfig()}>
        <shared-data-explorer slot="content"> </shared-data-explorer>
      </c-micro-cockpit>
    `
  }
}

function getCockpitConfig(): MicroCockpit.Config {
  return {
    brand: {
      title: 'My Company',
      subtitle: 'Back Office'
    },

    user: {
      displayName: 'Jane Doe'
    },

    userMenu: {
      kind: 'items',

      items: [
        {
          action: 'preferences',
          text: 'Preferenes'
        },
        {
          action: 'profile',
          text: 'Profile'
        }
      ]
    },

    mainMenu: {
      kind: 'items',
      activeItem: 'user-groups',

      items: [
        {
          kind: 'item',
          icon: dashboardIcon,
          text: 'Dashboard',
          itemId: 'dashboard'
        },
        {
          kind: 'item',
          icon: salesIcon,
          text: 'Sales',
          itemId: 'sales'
        },
        {
          kind: 'item',
          icon: transactionsIcon,
          text: 'Transactions',
          itemId: 'transactions'
        },
        {
          kind: 'group',
          groupId: 'reports',
          icon: reportsIcon,
          text: 'Reports',
          subitems: [
            {
              kind: 'subitem',
              text: 'Top 10 Customers',
              itemId: 'report1'
            },
            {
              kind: 'subitem',
              text: 'Revenues',
              itemId: 'report2'
            },
            {
              kind: 'subitem',
              text: 'Gains',
              itemId: 'report2'
            }
          ]
        },
        {
          kind: 'group',
          groupId: 'user-management',
          icon: reportsIcon,
          text: 'User management',
          subitems: [
            {
              kind: 'subitem',
              text: 'Users',
              itemId: 'users'
            },
            {
              kind: 'subitem',
              text: 'User groups',
              itemId: 'user-groups'
            },
            {
              kind: 'subitem',
              text: 'Roles',
              itemId: 'roles'
            }
          ]
        },
        {
          kind: 'item',
          icon: scheduleIcon,
          text: 'Schedule',
          itemId: 'schedule'
        }
      ]
    }
  }
}

export default {
  title: 'micro-cockpit'
}

export const microCockpit = () => h('micro-cockpit-demo')
