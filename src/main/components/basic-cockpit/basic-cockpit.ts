import {
  bind,
  createEmitter,
  elem,
  prop,
  afterInit,
  Attrs,
  Listener,
  Component
} from '../../utils/components';

import { classMap, html, repeat } from '../../utils/lit';
import { ActionEvent } from '../../events/action-event';

import {
  runOpenVerticalTransition,
  runCloseVerticalTransition
} from '../../misc/transitions';

// components
import SlButton from '@shoelace-style/shoelace/dist/components/button/button';
import SlDivider from '@shoelace-style/shoelace/dist/components/divider/divider';
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlMenu from '@shoelace-style/shoelace/dist/components/menu/menu';
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item';

// icons
import avatarIcon from '../../icons/person-fill.svg';
import chevronDownIcon from '../../icons/chevron-down.svg';

// styles
import basicCockpitStyles from './basic-cockpit.styles';

// === exports =======================================================

export { BasicCockpit };

// === types =========================================================

namespace BasicCockpit {
  export type Brand = {
    title: string;
    subtitle?: string;
  };

  export type User = {
    displayName: string;
  };

  export type UserMenu = {
    kind: 'items';

    items: {
      text: string;
      action: string;
    }[];
  };

  export type MainMenu = {
    kind: 'items';
    activeItem?: string;
    items: (MainMenuItem | MainMenuGroup)[];
  };

  export type MainMenuItem = {
    kind: 'item';
    icon: string;
    text: string;
    itemId: string;
    action?: string;
  };

  export type MainMenuGroup = {
    kind: 'group';
    groupId: string;
    icon: string;
    text: string;
    subitems: MainMenuSubitem[];
  };

  export type MainMenuSubitem = {
    kind: 'subitem';
    text: string;
    itemId: string;
    action?: string;
  };

  export type Config = {
    brand: Brand;
    user: User;
    userMenu: UserMenu;
    mainMenu: MainMenu;
  };
}

// === BasicCockpit ===================================================

@elem({
  tag: 'c-basic-cockpit',
  styles: basicCockpitStyles,
  uses: [SlButton, SlDivider, SlDropdown, SlIcon, SlMenu, SlMenuItem]
})
class BasicCockpit extends Component {
  @prop
  config?: BasicCockpit.Config;

  @prop
  onAction?: Listener<ActionEvent>;

  private _emitAction = createEmitter(this, 'c-action', () => this.onAction);
  private _openGroups: Set<string> = new Set();
  private _timeoutId: number | null = null;

  constructor() {
    super();

    afterInit(this, () => {
      const mainMenu = this.config?.mainMenu;
      const activeItem = mainMenu?.activeItem;

      if (!activeItem) {
        return;
      }

      for (const item of mainMenu.items) {
        if (item.kind !== 'group') {
          continue;
        }

        if (item.subitems.some((it) => it.itemId === activeItem)) {
          this._openGroups.add(item.groupId);
        }
      }
    });
  }

  @bind
  private _onGroupToggle(ev: Event) {
    const node = <HTMLElement>(<HTMLElement>ev.currentTarget).parentNode!;
    const groupId = node.getAttribute('data-group')!;
    const open = this._openGroups.has(groupId);

    const contentNode = node.querySelector(
      '.main-menu-group-subitems'
    )! as HTMLElement;

    if (open) {
      this._openGroups.delete(groupId);
      runCloseVerticalTransition(contentNode, 'var(--sl-transition-medium)');
      node.classList.add('main-menu-group--closed');
      node.classList.remove('main-menu-group--open');
    } else {
      this._openGroups.add(groupId);
      runOpenVerticalTransition(contentNode, 'var(--sl-transition-medium)');
      node.classList.add('main-menu-group--open');
      node.classList.remove('main-menu-group--closed');
    }
  }

  @bind
  private _onItemClick(ev: MouseEvent) {
    const target = <HTMLElement>ev.currentTarget;
    const action = target.getAttribute('data-action')!;

    this._emitAction({ action });
  }

  render() {
    if (!this.config) {
      return null;
    }

    return html`
      <!-- TODO -->
      <link
        href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700"
        rel="stylesheet"
        type="text/css"
      />
      <div class="base">
        <div class="sidebar">
          <div class="sidebar-scrollpane">
            ${this._renderBrand()} ${this._renderUserMenu()}
            ${this._renderMainMenu()}
          </div>
        </div>
        <div class="content">
          <slot name="content"></slot>
        </div>
      </div>
    `;
  }

  private _renderBrand() {
    const config = this.config!;
    const brand = config.brand;

    const title = !brand.subtitle ? '' : brand.title;
    const subtitle = brand.subtitle || brand.title;

    if (!title && !subtitle) {
      return null;
    }

    const titleContent = title
      ? html`<div class="brand-title">${title}</div>`
      : null;

    return html`
      <div class="brand">
        ${titleContent}
        <div class="brand-subtitle">${subtitle}</div>
      </div>
    `;
  }

  private _renderUserMenu() {
    const config = this.config!;
    const user = config.user;
    const displayName = user.displayName || 'Anonymous'; // TODO

    const userMenuItems = html`
      ${repeat(
        config.userMenu.items,
        (it) =>
          html`<sl-menu-item
            data-action=${it.action}
            @click=${this._onItemClick}
            >${it.text}</sl-menu-item
          >`
      )}
    `;

    return html`
      <sl-dropdown class="user-menu" placement="bottom" distance="10">
        <div slot="trigger" class="user-menu-trigger">
          <div class="avatar">
            <sl-icon src=${avatarIcon} class="default-avatar-icon"></sl-icon>
          </div>
          <div class="user-menu-info">
            <div class="user-display-name">${displayName}</div>
            <sl-icon class="user-menu-caret" src=${chevronDownIcon}></sl-icon>
          </div>
        </div>
        <sl-menu class="user-menu-items">
          ${userMenuItems}
          <sl-divider></sl-divider>
          <sl-menu-item data-action="logOut" @click=${this._onItemClick}>
            Log out
          </sl-menu-item>
        </sl-menu>
      </drop-down>
    `;
  }

  private _renderMainMenu() {
    const mainMenu = this.config!.mainMenu;
    const items = mainMenu.items;

    const menuItems = html`
      ${repeat(items, (it, idx) => {
        return it.kind === 'group'
          ? this._renderMainMenuGroup(it)
          : this._renderMainMenuItem(it);
      })}
    `;

    return html`<div class="main-menu">${menuItems}</div>`;
  }

  _renderMainMenuItem(item: BasicCockpit.MainMenuItem) {
    const config = this.config!;
    const mainMenu = config.mainMenu;
    const activeItem = mainMenu.activeItem;

    const className = classMap({
      'main-menu-item': true,
      'main-menu-item--active': !!activeItem && activeItem === item.itemId
    });

    return html`
      <a
        data-action=${item.action || item.itemId}
        class=${className}
        @click=${this._onItemClick}
      >
        <div class="main-menu-item-icon">
          <sl-icon src=${item.icon}></sl-icon>
        </div>
        <div class="main-menu-item-text">${item.text}</div>
      </a>
    `;
  }

  _renderMainMenuGroup(group: BasicCockpit.MainMenuGroup) {
    const active = group.subitems.some(
      (it) => it.itemId && it.itemId === this.config!.mainMenu.activeItem
    );

    const open = this._openGroups.has(group.groupId);

    const className = classMap({
      'main-menu-group': true,
      'main-menu-group--open': open,
      'main-menu-group--closed': !open,
      'main-menu-group--active': active
    });

    return html`
      <div class=${className} data-group=${group.groupId}>
        <div class="main-menu-group-header" @click=${this._onGroupToggle}>
          <div class="main-menu-group-header-icon">
            <sl-icon src=${group.icon}></sl-icon>
          </div>
          <div class="main-menu-group-header-text">${group.text}</div>
          <div class="main-menu-group-header-chevron">
            <sl-icon src=${chevronDownIcon}></sl-icon>
          </div>
        </div>
        <div class="main-menu-group-subitems">
          ${repeat(group.subitems, (it) => {
            return this._renderMainManuSubitem(it);
          })}
        </div>
      </div>
    `;
  }

  private _renderMainManuSubitem(subitem: BasicCockpit.MainMenuSubitem) {
    const mainMenu = this.config!.mainMenu;
    const action = subitem.action || subitem.itemId;

    const className = classMap({
      'main-menu-subitem': true,

      'main-menu-subitem--active':
        subitem.itemId && subitem.itemId === mainMenu.activeItem
    });

    return html`
      <a data-action=${action} class=${className} @click=${this._onItemClick}
        >${subitem.text}</a
      >
    `;
  }
}
