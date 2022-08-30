import { SideMenu2 } from 'js-cockpit';
import { DateField } from 'js-cockpit';

export default {
  title: 'temporary'
};

void (SideMenu2 || DateField);

export const sideMenu2 = () => '<c-side-menu2></c-side-menu>';

export const dateField2 = () => `
  <sl-card style="max-width: 600px; width: 800px">
    <c-date-field label="Start date" show-week-numbers></c-date-field>
    <br/>
    <c-date-field label="End date"></c-date-field>
  </sl-card>
`;

export const form = () => `
  <form onsubmit="alert(1); event.preventDefault();">
    <c-text-field label="First name"></c-text-field>
    <c-text-field label="Last name"></c-text-field>
    <c-date-field label="Day of birth"></c-date-field>
    <input type="submit" value="Submit"/>
  </form>
`;
