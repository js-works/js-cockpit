import { bind, elem, Component } from '../../main/utils/components';
import { html } from '../../main/utils/lit';

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

@elem({
  tag: 'shared-data-form',
  uses: [
    DataForm,
    DateField,
    Fieldset,
    RadioGroup,
    FormSection,
    NavMenu,
    SideMenu,
    Tab,
    Tabs,
    TextArea,
    TextField,
    UserMenu
  ],

  styles: `
  `
})
export class SharedDataForm extends Component {
  render() {
    return html`
      <div>
        <cp-data-form headline="Customer" lang="de-DE">
          <cp-form-section>
            <cp-fieldset>
              <cp-text-field label="Customer No." required></cp-text-field>
            </cp-fieldset>
            <cp-fieldset>
              <cp-text-field label="Short name" required></cp-text-field>
            </cp-fieldset>
          </cp-form-section>
          <cp-form-section caption="Customer address">
            <cp-fieldset>
              <cp-select-box label="Salutation"></cp-select-box>
              <cp-text-field label="First name" required></cp-text-field>
              <cp-text-field label="Last name" required></cp-text-field>
              <cp-text-field label="Phone" required></cp-text-field>
            </cp-fieldset>
            <cp-fieldset>
              <cp-text-field label="Company" required></cp-text-field>
              <cp-text-field label="Display name"></cp-text-field>
              <cp-text-field label="Alias name"></cp-text-field>
              <cp-date-field
                label="Day of birth"
                value="1980-01-01"
                required
                selection-mode="date"
              ></cp-date-field>
              <!--
              <cp-date-range label="Date range" required></cp-date-range>
              <cp-radio-group
                label="Options"
                orient="horizontal"
                required
              ></cp-radio-group>
              -->
            </cp-fieldset>
          </cp-form-section>
          <cp-form-section caption="Contact information">
            <cp-fieldset>
              <cp-text-field label="Phone" required></cp-text-field>
              <cp-text-field label="Mobile"></cp-text-field>
              <cp-text-area label="Comments"></cp-text-area>
              <cp-date-field label="Day of birth" required></cp-date-field>
              <cp-date-range label="Date range" required></cp-date-range>
            </cp-fieldset>
          </cp-form-section>
        </cp-data-form>
      </div>
    `;
  }
}
