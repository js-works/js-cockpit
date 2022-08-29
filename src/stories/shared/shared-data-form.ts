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
        <c-data-form headline="Customer" lang="de-DE">
          <c-form-section>
            <c-fieldset>
              <c-text-field label="Customer No." required></c-text-field>
            </c-fieldset>
            <c-fieldset>
              <c-text-field label="Short name" required></c-text-field>
            </c-fieldset>
          </c-form-section>
          <c-form-section caption="Customer address">
            <c-fieldset>
              <c-select-box label="Salutation"></c-select-box>
              <c-text-field label="First name" required></c-text-field>
              <c-text-field label="Last name" required></c-text-field>
              <c-text-field label="Phone" required></c-text-field>
            </c-fieldset>
            <c-fieldset>
              <c-text-field label="Company" required></c-text-field>
              <c-text-field label="Display name"></c-text-field>
              <c-text-field label="Alias name"></c-text-field>
              <c-date-field
                label="Day of birth"
                value="2017-01-01"
                required
              ></c-date-field>
              <!--
              <c-date-range label="Date range" required></c-date-range>
              <c-radio-group
                label="Options"
                orient="horizontal"
                required
              ></c-radio-group>
              -->
            </c-fieldset>
          </c-form-section>
          <c-form-section caption="Contact information">
            <c-fieldset>
              <c-text-field label="Phone" required></c-text-field>
              <c-text-field label="Mobile"></c-text-field>
              <c-text-area label="Comments"></c-text-area>
              <c-date-field label="Day of birth" required></c-date-field>
              <c-date-range label="Date range" required></c-date-range>
            </c-fieldset>
          </c-form-section>
        </c-data-form>
      </div>
    `;
  }
}
