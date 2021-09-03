import { h } from '../main/utils/dom'
import { component, elem } from 'js-element'
import { html, lit } from 'js-element/lit'
import { AppLayout } from '../main/components/app-layout/app-layout'
import { DataExplorer } from '../main/components/data-explorer/data-explorer'
export default {
  title: 'data-explorer'
}

import theme from '@shoelace-style/shoelace/dist/themes/light.styles'
const themeStyles = theme.toString()

const columns: DataExplorer.Column[] = [
  {
    type: 'column-group',
    text: 'Name',
    columns: [
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
      }
    ]
  },
  {
    text: 'Address',
    type: 'column-group',
    columns: [
      {
        type: 'column',
        text: 'Street',
        field: 'street'
      },
      {
        type: 'column',
        text: 'Postcode',
        field: 'postcode',
        sortable: true
      },
      {
        type: 'column',
        text: 'City',
        field: 'city',
        sortable: true
      }
    ]
  }
]

const data = [
  {
    firstName: 'Jane',
    lastName: 'Doe',
    street: 'Golden Avenue 11',
    postcode: 12345,
    city: 'New York',
    country: 'USA'
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    street: 'Golden Avenue 11',
    postcode: 12345,
    city: 'New York',
    country: 'USA'
  },
  {
    firstName: 'Peter',
    lastName: 'Goodyear',
    street: 'Main Street 123',
    postcode: 98765,
    city: 'Los Angeles',
    country: 'USA'
  },
  {
    firstName: 'Mary',
    lastName: 'Smith',
    street: 'Long Road 123',
    postcode: 45678,
    city: 'London',
    country: 'Great Britain'
  },
  {
    firstName: 'Julia',
    lastName: 'Mayfield',
    street: 'Main Road 99',
    postcode: 65432,
    city: 'Sidney',
    country: 'Australia'
  }
]

@elem({
  tag: 'data-explorer-demo',
  uses: [AppLayout, DataExplorer],
  styles: themeStyles,
  impl: lit(dataExplorerDemoImpl)
})
class DataExplorerDemo extends component() {}

function dataExplorerDemoImpl() {
  return () => html`
    <jsc-data-explorer
      slot="main"
      .title=${'Customers'}
      .columns=${columns}
      .data=${data.slice(0, 5)}
      .sortField=${'lastName'}
      .selectMode=${'multi'}
    ></jsc-data-explorer>
  `
}

export const dataExplorer = () => h('data-explorer-demo')
