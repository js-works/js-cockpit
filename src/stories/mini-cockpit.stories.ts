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
      <c-mini-cockpit
        brand-title="my company"
        brand-subtitle="Back Office"
        user-display-name="Jane Doe"
      >
        <shared-data-explorer slot="content"></shared-data-explorer>
      </c-mini-cockpit>
    `
  }
}

const menu: MiniCockpit.Menu = {
  kind: 'items',
  items: [
    {
      icon: '',
      text: '',
      actionId: ''
    }
  ]
}

export default {
  title: 'mini-cockpit'
}

export const miniCockpit = () => h('mini-cockpit-demo')
