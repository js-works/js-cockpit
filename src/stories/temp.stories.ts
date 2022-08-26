import { SideMenu2 } from 'js-cockpit';
import { DateField2 } from 'js-cockpit';

export default {
  title: 'temporary'
};

void (SideMenu2 || DateField2);

export const sideMenu2 = () => document.createElement('c-side-menu2');

export const dateField2 = () => document.createElement('c-date-field2');
