import { SideMenu2 } from 'js-cockpit';
import { DateField } from 'js-cockpit';

export default {
  title: 'temporary'
};

void (SideMenu2 || DateField);

export const sideMenu2 = () => '<c-side-menu2></c-side-menu>';

export const dateField2 = () => `
    <sl-card style="max-width: 600px; width: 800px">
      <c-date-field label="Start date"></c-date-field>
      <br/>
      <c-date-field label="End date"></c-date-field>
    </sl-card>
  `;
