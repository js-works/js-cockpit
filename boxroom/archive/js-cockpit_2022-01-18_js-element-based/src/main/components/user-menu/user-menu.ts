import { elem, prop, override, Attrs } from 'js-element'
import { html, classMap, lit } from 'js-element/lit'

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
  uses: [SlIcon],
  impl: lit(userMenuImpl)
})
class UserMenu extends HTMLElement {
  @prop({ attr: Attrs.string })
  displayName: string = ''
}

function userMenuImpl(self: UserMenu) {
  return () => {
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
