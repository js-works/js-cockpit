import { h, defineElement } from '../main/utils/dom'
import { DataTable } from '../main/core/data-table/data-table'

defineElement('sx-data-table', DataTable)

export default {
  title: 'data-table',
}

const columns = [
  {
    type: 'column-group',
    text: 'Name',
    columns: [
      {
        type: 'column',
        text: 'First name',
        field: 'firstName',
      },
      {
        type: 'column',
        text: 'Last name',
        field: 'lastName',
        sortable: true,
      },
    ],
  },
  {
    text: 'Address',
    type: 'column-group',
    columns: [
      {
        type: 'column',
        text: 'Street',
        field: 'street',
      },
      {
        type: 'column',
        text: 'Postcode',
        field: 'postcode',
        sortable: true,
      },
      {
        type: 'column',
        text: 'City',
        field: 'city',
        sortable: true,
      },
    ],
  },
]

const data = [
  {
    firstName: 'Jane',
    lastName: 'Doe',
    street: 'Golden Avenue 11',
    postcode: 12345,
    city: 'New York',
    country: 'USA',
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    street: 'Golden Avenue 11',
    postcode: 12345,
    city: 'New York',
    country: 'USA',
  },
  {
    firstName: 'Peter',
    lastName: 'Goodyear',
    street: 'Main Street 123',
    postcode: 98765,
    city: 'Los Angeles',
    country: 'USA',
  },
  {
    firstName: 'Mary',
    lastName: 'Smith',
    street: 'Long Road 123',
    postcode: 45678,
    city: 'London',
    country: 'Great Britain',
  },
  {
    firstName: 'Julia',
    lastName: 'Mayfield',
    street: 'Main Road 99',
    postcode: 65432,
    city: 'Sidney',
    country: 'Australia',
  },
]

export const example_1 = () =>
  h('sx-data-table', {
    columns,
    data,
    selectMode: 'mutli',
    sortField: 'lastName',
    sortDir: 'desc',
  })
