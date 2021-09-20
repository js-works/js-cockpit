import { component, elem } from 'js-element'
import { html, lit } from 'js-element/lit'
import {
  AppLayout,
  DataExplorer,
  SearchBox,
  ThemeProvider,
  Theme,
  TextField
} from 'js-cockpit'

import faker from 'faker'

export default {
  title: 'data-explorer'
}

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
    sortable: true
  }
]

@elem({
  tag: 'shared-data-explorer',
  uses: [AppLayout, DataExplorer, SearchBox],
  impl: lit(sharedDataExplorerDemoImpl)
})
export class SharedDataExplorer extends component() {}

function sharedDataExplorerDemoImpl() {
  return () => html`
    <c-data-explorer
      .title=${'Customers'}
      .columns=${columns}
      .fetchItems=${fetchFakeItems}
      .initialSortField=${'lastName'}
      .initialSortDir=${'desc'}
      .selectionMode=${'multi'}
      .actions=${[
        {
          kind: 'action',
          text: 'New',
          type: 'general',
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
      <c-search-box slot="search">
        <c-text-field label="First name"></c-text-field>
        <c-text-field label="Last name"></c-text-field>
        <c-text-field label="Zip code"></c-text-field>
        <c-text-field label="City"></c-text-field>
        <c-text-field label="Country"></c-text-field>
      </c-search-box>
    </c-data-explorer>
  `
}

const totalItemCount = 3234
let fakeItems: Record<string, string>[] = []

faker.seed(100)

for (let i = 0; i < totalItemCount; ++i) {
  fakeItems.push({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    street: faker.address.streetName(),
    zipCode: faker.address.zipCode(),
    city: faker.address.city(),
    country: faker.address.country()
  })
}

const fetchFakeItems: DataExplorer.FetchItems = (params) => {
  return new Promise((resolve, reject) => {
    let items = [...fakeItems]

    if (params.sortField) {
      const sig = params.sortDir === 'desc' ? -1 : 1

      items.sort((a, b) =>
        a[params.sortField!] >= b[params.sortField!] ? sig : -sig
      )
    }

    items = items.slice(params.offset, params.offset + params.count)

    setTimeout(() => {
      resolve({ items, totalItemCount })
    }, 1000)
  })
}
