import { bind, elem, Component } from '../../main/utils/components';
import { html } from '../../main/utils/lit';

import { AppLayout, DataExplorer, SearchBox } from 'js-cockpit';

// @ts-ignore
import { faker } from '@faker-js/faker';

const columns: DataExplorer.Column[] = [
  {
    type: 'column',
    text: 'First name',
    field: 'firstName'
  },
  {
    type: 'column',
    text: 'Last name',
    field: 'lastName',
    sortable: true
  },
  {
    type: 'column',
    text: 'Street',
    field: 'street'
  },
  {
    type: 'column',
    text: 'Zip Code',
    field: 'zipCode',
    sortable: true
  },
  {
    type: 'column',
    text: 'City',
    field: 'city',
    sortable: true
  },
  {
    type: 'column',
    text: 'Country',
    field: 'country',
    sortable: true,
    width: 180
  }
];

@elem({
  tag: 'shared-data-explorer',
  uses: [AppLayout, DataExplorer, SearchBox],

  styles: `
    :host {
      xposition: relative;
      display: flex;
      align-items: stretch;
      justify-content: stretch;
      height: 100%;
      width: 100%;
    }

    jsc-data-explorer {
      flex-grow: 1 !important;
    }
  `
})
export class SharedDataExplorer extends Component {
  render() {
    return html`<cp-data-explorer
      headline="Customer"
      .columns=${columns}
      .fetchItems=${fetchFakeItems}
      initial-sort-field="lastName"
      initial-sort-dir="desc"
      selection-mode="multi"
      full-size
      .actions=${[
        {
          kind: 'action',
          text: '+ New',
          type: 'general',
          variant: 'primary',
          actionId: ''
        },
        {
          kind: 'action',
          text: 'Edit',
          type: 'single-row',
          actionId: ''
        },
        {
          kind: 'action',
          text: 'Delete',
          type: 'multi-row',
          actionId: ''
        },
        {
          kind: 'action-group',
          text: 'Export',
          actions: [
            {
              kind: 'action',
              text: 'Export to CSV',
              type: 'multi-row',
              actionId: ''
            },
            {
              kind: 'action',
              text: 'Export to Excel',
              type: 'multi-row',
              actionId: ''
            }
          ]
        }
      ]}
    >
      <cp-search-box slot="search">
        <cp-text-field label="First name"></cp-text-field>
        <cp-text-field label="Last name"></cp-text-field>
        <cp-text-field label="Zip code"></cp-text-field>
        <cp-text-field label="City"></cp-text-field>
        <cp-text-field label="Country"></cp-text-field>
        <cp-date-field label="Date of birth"></cp-date-range>
      </cp-search-box>
    </cp-data-explorer>
  `;
  }
}

const totalItemCount = 3234;
let fakeItems: Record<string, string>[] = [];

faker.seed(100);

for (let i = 0; i < totalItemCount; ++i) {
  fakeItems.push({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    street: faker.address.streetName(),
    zipCode: faker.address.zipCode(),
    city: faker.address.city(),
    country: faker.address.country()
  });
}

const fetchFakeItems: DataExplorer.FetchItems = (params) => {
  return new Promise((resolve, reject) => {
    let items = [...fakeItems];

    if (params.sortField) {
      const sig = params.sortDir === 'desc' ? -1 : 1;

      items.sort((a, b) =>
        a[params.sortField!] >= b[params.sortField!] ? sig : -sig
      );
    }

    items = items.slice(params.offset, params.offset + params.count);

    setTimeout(() => {
      resolve({ items, totalItemCount });
    }, 1000);
  });
};
