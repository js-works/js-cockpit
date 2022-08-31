import {
  bind,
  createEmitter,
  elem,
  prop,
  Attrs,
  Component,
  Listener
} from '../../utils/components';

import { html } from '../../utils/lit';
import { I18nController } from '../../i18n/i18n';

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlTooltip from '@shoelace-style/shoelace/dist/components/tooltip/tooltip';

// events
import { LogoutEvent } from '../../events/logout-event';

// icons
import defaultAvatarIcon from './assets/default-avatar.svg';
import logoutIcon from './assets/logout.svg';

// styles
import userMenuStyles from './user-menu.css';

// === exports =======================================================

export { UserMenu };

// === UserMenu ======================================================

@elem({
  tag: 'cp-user-menu',
  styles: userMenuStyles,
  uses: [SlIcon, SlTooltip]
})
class UserMenu extends Component {
  @prop({ attr: Attrs.string })
  userName: string = '';

  @prop
  onLogout?: Listener<LogoutEvent>;

  private _i18n = new I18nController(this);
  private _t = this._i18n.translate('jsCockpit.userMenu');
  private _emitLogout = createEmitter(this, 'cp-logout', () => this.onLogout);

  @bind
  private _onLogoutClick() {
    this._emitLogout();
  }

  render() {
    return html`
      <div part="base" class="base">
        <sl-icon src=${defaultAvatarIcon} class="avatar-icon"></sl-icon>
        ${this.userName || this._t('anonymous')}
        <sl-tooltip
          content=${this._t('logOut')}
          placement="top-end"
          skidding="-5"
        >
          <a class="logout-button" @click=${this._onLogoutClick}>
            <sl-icon src=${logoutIcon} class="logout-icon"></sl-icon>
          </a>
        </sl-tooltip>
      </div>
    `;
  }
}
