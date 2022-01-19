import {
  afterUpdate,
  bind,
  createEmitter,
  elem,
  prop,
  state,
  Attrs,
  Component,
  Listener
} from '../../utils/components'

import { classMap, createRef, html, ref, repeat } from '../../utils/lit'
import { createLocalizer } from '../../utils/i18n'

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'

// icons
import defautlAvatarSvg from './assets/default-avatar.svg'
import logoutSvg from './assets/logout.svg'

// styles
import userMenuStyles from './user-menu.css'

// === exports =======================================================

export { UserMenu }

// === UserMenu ===================================================

@elem({
  tag: 'c-user-menu',
  styles: userMenuStyles,
  uses: [SlIcon]
})
class UserMenu extends Component {
  @prop({ attr: Attrs.string })
  displayName: string = ''

  render() {
    return html`
      <div part="base" class="base">
        <sl-icon src=${defautlAvatarSvg} class="avatar-icon"></sl-icon>
        Jane Doe
        <a class="logout-button">
          <sl-icon src=${logoutSvg} class="logout-icon"></sl-icon>
        </a>
      </div>
    `
  }
}
