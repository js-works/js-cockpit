import { h } from '../main/utils/dom';
import { elem, Component } from '../main/utils/components';
import { html } from '../main/utils/lit';

import {
  Brand,
  Cockpit,
  DateField,
  DataForm,
  Fieldset,
  RadioGroup,
  FormSection,
  NavMenu,
  SideMenu,
  Tab,
  Tabs,
  TextArea,
  TextField,
  ThemeProvider,
  UserMenu
} from 'js-cockpit';

import { SharedCockpit } from './shared/shared-cockpit';
import { SharedDataExplorer } from './shared/shared-data-explorer';
import { SharedDataForm } from './shared/shared-data-form';

export default {
  title: 'cockpit'
};

const demo1Styles = `
  .orange {
    padding: 4px 8px;
    background-color: orange;
  }
  
  .orangered {
    padding: 4px 8px;
    background-color: orangered;
  }

  .green {
    padding: 4px 8px;
    background-color: green;
  }
  
  .lightgreen {
    padding: 4px 8px;
    background-color: lightgreen;
  }

  .gold {
    padding: 4px 8px;
    background-color: gold;
  }
  
  .yellow {
    padding: 4px 8px;
    background-color: yellow;
  }

  .full-height {
    height: 100%;
    box-sizing: border-box;
  }
`;

@elem({
  tag: 'cockpit-demo1',
  styles: demo1Styles,
  uses: [Cockpit, DateField, NavMenu, SharedCockpit, ThemeProvider]
})
class CockpitDemo1 extends Component {
  render() {
    return html`
      <cp-cockpit>
        <div slot="header-start" class="orangered">header-start</div>
        <div slot="header" class="orange">header</div>
        <div slot="header-end" class="orangered">header-end</div>
        <div slot="subheader-start" class="orange">subheader-start</div>
        <div slot="subheader" class="orangered">subheader</div>
        <div slot="subheader-end" class="orange">subheader-end</div>
        <div slot="sidebar-start" class="green">sidebar-start</div>
        <div slot="sidebar" class="lightgreen full-height">sidebar</div>
        <div slot="sidebar-end" class="green">sidebar-end</div>
        <div slot="main-start" class="gold">main-start</div>
        <div slot="main" class="yellow full-height">main</div>
        <div slot="main-end" class="gold">main-end</div>
      </cp-cockpit>
    `;
  }
}

export const cockpit1 = () => h('cockpit-demo1');

// ===============================================================================

@elem({
  tag: 'cockpit-demo2',
  uses: [
    Brand,
    Cockpit,
    DataForm,
    Fieldset,
    RadioGroup,
    FormSection,
    NavMenu,
    SideMenu,
    SharedDataExplorer,
    Tab,
    Tabs,
    TextArea,
    TextField,
    UserMenu
  ]
})
class CockpitDemo2 extends Component {
  render() {
    return html`
      <shared-cockpit>
        <shared-data-explorer></shared-data-explorer>
      </shared-cockpit>
    `;
  }
}

export const cockpit2 = () => h('cockpit-demo2', { lang: 'en-US' });

@elem({
  tag: 'cockpit-demo3',
  uses: [
    Brand,
    Cockpit,
    DataForm,
    Fieldset,
    RadioGroup,
    FormSection,
    NavMenu,
    SideMenu,
    SharedDataExplorer,
    SharedDataForm,
    Tab,
    Tabs,
    TextArea,
    TextField,
    UserMenu
  ]
})
class CockpitDemo3 extends Component {
  render() {
    return html`
      <shared-cockpit>
        <shared-data-form></shared-data-form>
      </shared-cockpit>
    `;
  }
}

export const cockpit3 = () => h('cockpit-demo3');
