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
      activeItem: 'transactions',

      items: [
        {
          icon: dashboardIcon,
          text: 'Dashboard',
          itemId: 'dashboard'
        },
        {
          icon: salesIcon,
          text: 'Sales',
          itemId: 'sales'
        },
        {
          icon: transactionsIcon,
          text: 'Transactions',
          itemId: 'transactions'
        },
        {
          icon: reportsIcon,
          text: 'Reports',
          itemId: 'reports'
        },
        {
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
