// external imports
import { component, elem, prop, Attrs } from 'js-element'
import { html, classMap, lit, TemplateResult } from 'js-element/lit'
import { useState } from 'js-element/hooks'

// internal imports
import { ActionBar } from '../action-bar/action-bar'
import { DataTable } from '../data-table/data-table'
import { PaginationBar } from '../pagination-bar/pagination-bar'

// icons
import searchIcon from '../../icons/search.svg'
import filterIcon from '../../icons/filter.svg'

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
  tag: 'c-data-explorer',
  styles: [dataExplorerStyles],
  impl: lit(dataExplorerImpl),
  uses: [ActionBar, DataTable, PaginationBar]
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

  @prop({ attr: Attrs.boolean })
  fullSize = false
}

function dataExplorerImpl(self: DataExplorer) {
  const [state, setState] = useState({
    data: [] as any[][] | object[]
  })

  return () => html`
    <div class="base ${classMap({ 'full-size': self.fullSize })}">
      <div class="header">
        <h3 class="title">${self.title}</h3>
        <div class="actions">
          <c-action-bar></c-action-bar>
        </div>
        <div class="search">
          <sl-input size="small" placeholder="Search...">
            <sl-icon
              src=${searchIcon}
              slot="prefix"
              class="search-icon"
            ></sl-icon>
          </sl-input>
          <sl-button type="primary" size="small" class="filter-button">
            <sl-icon src=${filterIcon} slot="prefix"></sl-icon>
            Filter...
          </sl-button>
        </div>
      </div>
      <c-data-table
        class="table"
        .columns=${self.columns}
        .selectMode=${self.selectMode}
        .data=${[...data, ...data /* , ...data, ...data, ...data*/]}
        .bordered=${false}
        .sortField=${self.sortField}
        .sortDir=${self.sortDir}
      >
      </c-data-table>
      <div class="footer">
        <c-pagination-bar
          page-index="3"
          page-size="500"
          total-item-count="10002"
          .onPageChange=${(ev: any) => console.log(ev)}
          .onPageSizeChange=${(ev: any) => console.log(ev)}
        ></c-pagination-bar>
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
