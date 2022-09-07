import { h } from '../../main/utils/dom';
import { sharedTheme } from '../shared/shared-theme';
import { elem, Component } from '../../main/utils/components';
import { html } from '../../main/utils/lit';

import {
  showInfoDialog,
  loadTheme,
  Brand,
  Cockpit,
  DataForm,
  RadioGroup,
  FormSection,
  NavMenu,
  SideMenu,
  Tab,
  Tabs,
  TextArea,
  TextField,
  UserMenu
} from 'js-cockpit';

export default {
  title: 'cockpit'
};

loadTheme(sharedTheme);

// ===============================================================================

@elem({
  tag: 'shared-cockpit',
  uses: [
    Brand,
    Cockpit,
    DataForm,
    RadioGroup,
    FormSection,
    NavMenu,
    SideMenu,
    Tab,
    Tabs,
    TextArea,
    TextField,
    UserMenu
  ]
})
export class SharedCockpit extends Component {
  render() {
    const menu: SideMenu.Menu = {
      kind: 'groups',
      groups: [
        {
          kind: 'group',
          groupId: 'products',
          text: 'Products',
          items: [
            {
              kind: 'item',
              itemId: 'manage-products',
              text: 'Manage products'
            },
            {
              kind: 'item',
              itemId: 'price-calculation',
              text: 'Price calculation'
            },
            {
              kind: 'item',
              itemId: 'import-products',
              text: 'Import products'
            }
          ]
        },
        {
          kind: 'group',
          groupId: 'services',
          text: 'Services',
          items: [
            {
              kind: 'item',
              itemId: 'assign-services-to-products',
              text: 'Assign services to products'
            },
            {
              kind: 'item',
              itemId: 'export-services',
              text: 'Export services'
            }
          ]
        },
        {
          kind: 'group',
          groupId: 'administration',
          text: 'Administration',
          items: [
            {
              kind: 'item',
              itemId: 'database-configuration',
              text: 'Database configuration'
            },
            {
              kind: 'item',
              itemId: 'log-settings',
              text: 'Log setting'
            },
            {
              kind: 'item',
              itemId: 'export-configurations',
              text: 'Export all configurations'
            }
          ]
        }
      ]
    };

    return html`
      <cp-theme-provider .theme=${sharedTheme}>
        <cp-cockpit>
          <cp-brand
            slot="header-start"
            headline="my-company"
            text="Back Office"
            logo="default"
            bicolor
          ></cp-brand>
          <cp-nav-menu
            slot="header"
            .items=${[
              {
                itemId: '1',
                text: 'Dashboard'
              },
              {
                itemId: '2',
                text: 'User management'
              },
              {
                itemId: '3',
                text: 'Catalog'
              },
              {
                itemId: '4',
                text: 'CMS'
              }
            ]}
            active-item="2"
            @cp-action=${notImplementedHandler}
          ></cp-nav-menu>
          <cp-user-menu
            slot="header-end"
            user-name="Jane Doe"
            @cp-logout=${notImplementedHandler}
          ></cp-user-menu>
          <div slot="sidebar" class="full-height">
            <cp-side-menu
              header-text="User management"
              .menu=${menu}
              active-item="price-calculation"
              @cp-action=${notImplementedHandler}
              collapse-mode="manual"
            ></cp-side-menu>
          </div>
          <div slot="main" class="full-height"><slot></slot></div>
        </cp-cockpit>
      </cp-theme-provider>
    `;
  }
}

function notImplementedHandler() {
  showInfoDialog({
    title: 'Not implemented',
    message: 'This  is not implemented as this is just a very simple demo.',
    okText: 'Okay, I understand'
  });
}

export const cockpit2 = () => h('cockpit-demo2');
