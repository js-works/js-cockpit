import { SideMenu2 } from 'js-cockpit';
import { DateField2 } from 'js-cockpit';

export default {
  title: 'temporary'
};

void (SideMenu2 || DateField2);

export const sideMenu2 = () => '<c-side-menu2></c-side-menu>';

export const dateField2 = () => `
    <sl-card style="max-width: 600px; width: 800px">
      <c-date-field2 label="Start date"></c-date-field2>
      <br/>
      <c-date-field2 label="End date"></c-date-field2>
    </sl-card>
  `;
