// external imports
import { component, elem, prop, Attrs } from 'js-element'
import { html, classMap, withLit, TemplateResult } from 'js-element/lit'
import { useState } from 'js-element/hooks'

// internal imports
import { DataTable } from '../data-table/data-table'
import { PaginationBar } from '../pagination-bar/pagination-bar'

// styles
import dataExplorerStyles from './data-explorer.css'

// === exports =======================================================

export { DataExplorer }

// === types =========================================================

namespace DataExplorer {
  export type Column =
    | {
        type: 'column'
        text?: string
        field?: number | string | null
        width?: number
        align?: 'start' | 'center' | 'end'
        sortable?: boolean
      }
    | {
        type: 'column-group'
        text?: string
        columns: Column[]
      }
}

// === DataExplorer ==================================================

@elem({
  tag: 'jsc-data-explorer',
  styles: [dataExplorerStyles],
  uses: [DataTable, PaginationBar],
  impl: withLit(dataExplorerImpl)
})
class DataExplorer extends component() {
  @prop({ attr: Attrs.string })
  title: string = ''

  @prop
  columns: DataExplorer.Column[] | null = null

  @prop
  sortField: number | string | null = null

  @prop
  sortDir: 'asc' | 'desc' = 'asc'

  @prop({ attr: Attrs.string })
  selectMode: 'single' | 'multi' | 'none' = 'none'
}

function dataExplorerImpl(self: DataExplorer) {
  const [state, setState] = useState({
    data: [] as any[][] | object[]
  })

  return () => html`
    <div class="base">
      <div class="header">
        <h3 class="title">${self.title}</h3>
      </div>
      <div class="table">
        <jsc-data-table
          .columns=${self.columns}
          .selectMode=${self.selectMode}
          .data=${data}
          .bordered=${false}
          .sortField=${self.sortField}
          .sortDir=${self.sortDir}
        >
        </jsc-data-table>
      </div>
      <div class="footer">
        <jsc-pagination-bar></jsc-pagination-bar>
      </div>
    </div>
  `
}

// TODO: get rid of this ==================================================

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
