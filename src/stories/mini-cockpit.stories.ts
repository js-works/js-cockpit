import { afterConnect, bind, elem, Component } from '../main/utils/components'
import { html } from '../main/utils/lit'
import { h } from '../main/utils/dom'
import { sharedTheme } from './shared/shared-theme'
import { SharedDataExplorer } from './shared/shared-data-explorer'

import { MiniCockpit, SideMenu, ThemeProvider } from 'js-cockpit'

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
      title: 'MyCompany',
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
      activeItem: 'dashboard',

      items: [
        {
          icon: '',
          text: 'Dashboard',
          itemId: 'dashboard'
        },
        {
          icon: '',
          text: 'Sales',
          itemId: 'sales'
        },
        {
          icon: '',
          text: 'Transactions',
          itemId: 'transations'
        },
        {
          icon: '',
          text: 'Reports',
          itemId: 'reports'
        },
        {
          icon: '',
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
