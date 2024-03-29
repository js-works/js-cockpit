import { h } from '../main/utils/dom'
import { elem } from 'js-element'
import { html, lit } from 'js-element/lit'
import { DataTable } from 'js-cockpit'

import theme from '@shoelace-style/shoelace/dist/themes/light.styles'
const themeStyles = theme.toString()

export default {
  title: 'data-table'
}

const columns: DataTable.Column[] = [
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
      },
      {
        type: 'column',
        text: 'City2',
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
  tag: 'data-table-demo',
  uses: [DataTable],
  styles: themeStyles,
  impl: lit(dataTableDemoImpl)
})
class DataTableDemo extends HTMLElement {}

function dataTableDemoImpl() {
  return () => html`
    <div style="max-height: 200px; border: 1px solid red">
      <c-data-table
        bordered
        .columns=${columns}
        .data=${[...data, ...data]}
      ></c-data-table>
    </div>
  `
}

export const dataTable = () => h('data-table-demo')
