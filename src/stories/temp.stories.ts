import { SideMenu2 } from 'js-cockpit';
import { DateField as OldDateField } from 'js-cockpit';
import { Calendar as OldCalendar } from '../main/utils/__old_cal';
import { DatePicker } from 'js-cockpit';

export default {
  title: 'temporary'
};

const cal = new OldCalendar({});

void (SideMenu2 || OldDateField || DatePicker);

export const datePicker = () => '<cp-date-picker></cp-date-picker>';
export const oldCalendar = () => cal.getElement();
export const sideMenu2 = () => '<cp-side-menu2></cp-side-menu>';

export const dateField2 = () => `
  <sl-card style="max-width: 600px; width: 800px">
    <cp-date-field label="Start date" show-week-numbers></cp-date-field>
    <br/>
    <cp-date-field label="End date"></cp-date-field>
  </sl-card>
`;

export const form = () => `
  <form onsubmit="alert(1); event.preventDefault();">
    <cp-text-field label="First name"></cp-text-field>
    <cp-text-field label="Last name"></cp-text-field>
    <cp-date-field label="Day of birth"></cp-date-field>
    <cp-date-field type="dateTime" label="Date/Time"></cp-date-field>
    <input type="submit" value="Submit"/>
  </form>
`;
