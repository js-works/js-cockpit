import { afterConnect, bind, elem, Component } from '../main/utils/components'
import { html } from '../main/utils/lit'
import { h } from '../main/utils/dom'
import { sharedTheme } from './shared/shared-theme'
import { SharedDataExplorer } from './shared/shared-data-explorer'

import { MiniCockpit, SideMenu, ThemeProvider } from 'js-cockpit'

// icons
import dashboardIcon from 'bootstrap-icons/icons/house-door.svg'
import salesIcon from 'bootstrap-icons/icons/graph-up-arrow.svg'
import transactionsIcon from 'bootstrap-icons/icons/table.svg'
import reportsIcon from 'bootstrap-icons/icons/file-earmark-text.svg'
import scheduleIcon from 'bootstrap-icons/icons/calendar-week.svg'

@elem({
  tag: 'mini-cockpit-demo',
  uses: [MiniCockpit, SharedDataExplorer]
})
class MiniCockpitDemo extends Component {
  render() {
    return html`
      <c-mini-cockpit .config=${getCockpitConfig()}>
        <shared-data-explorer slot="content"></shared-data-explorer>
      </c-mini-cockpit>
    `
  }
}

function getCockpitConfig(): MiniCockpit.Config {
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
      activeItem: 'sales',

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
          itemId: 'transations'
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
  title: 'mini-cockpit'
}

export const miniCockpit = () => h('mini-cockpit-demo')
