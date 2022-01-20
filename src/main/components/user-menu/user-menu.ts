import { addToDict, defineTerms, TermsOf } from 'js-localize'

import {
  bind,
  createEmitter,
  elem,
  prop,
  Attrs,
  Component,
  Listener
} from '../../utils/components'

import { html } from '../../utils/lit'
import { createLocalizer } from '../../utils/i18n'

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlTooltip from '@shoelace-style/shoelace/dist/components/tooltip/tooltip'

// events
import { LogoutEvent } from '../../events/logout-event'

// icons
import defaultAvatarIcon from './assets/default-avatar.svg'
import logoutIcon from './assets/logout.svg'

// styles
import userMenuStyles from './user-menu.css'

// === exports =======================================================

export { UserMenu }

// === translations ==================================================

declare global {
  namespace Localize {
    interface TranslationsMap {
      'jsCockpit.userMenu': TermsOf<typeof translations>
    }
  }
}

const translations = defineTerms({
  en: {
    'jsCockpit.userMenu': {
      anonymous: 'Anonymous',
      logOut: 'Log out'
    }
  }
})

addToDict(translations)

// === UserMenu ======================================================

@elem({
  tag: 'c-user-menu',
  styles: userMenuStyles,
  uses: [SlIcon, SlTooltip]
})
class UserMenu extends Component {
  @prop({ attr: Attrs.string })
  userName: string = ''

  @prop
  onLogout?: Listener<LogoutEvent>

  private _i18n = createLocalizer(this, 'jsCockpit.userMenu')
  private _emitLogout = createEmitter(this, 'c-logout', () => this.onLogout)

  @bind
  private _onLogoutClick() {
    this._emitLogout()
  }

  render() {
    return html`
      <div part="base" class="base">
        <sl-icon src=${defaultAvatarIcon} class="avatar-icon"></sl-icon>
        ${this.userName || this._i18n.tr('anonymous')}
        <sl-tooltip content=${this._i18n.tr('logOut')} placement="bottom-end">
          <a class="logout-button" @click=${this._onLogoutClick}>
            <sl-icon src=${logoutIcon} class="logout-icon"></sl-icon>
          </a>
        </sl-tooltip>
      </div>
    `
  }
}
