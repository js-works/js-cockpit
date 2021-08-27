import { component, elem, prop, Attrs } from 'js-element'
import { html, classMap, withLit, TemplateResult } from 'js-element/lit'
import { useState } from 'js-element/hooks'
import { DataTable } from '../data-table/data-table'

/** @ts-ignore */
import dataExplorerStyles from './data-explorer.css' // TODO!!!

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
  tag: 'sx-data-explorer',
  styles: [dataExplorerStyles],
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

  @prop
  selectMode: 'single' | 'multi' | 'none' = 'none'
}

function dataExplorerImpl(self: DataExplorer) {
  const [state, setState] = useState({
    data: [] as any[][] | object[]
  })

  return () => html` <div class="base">
    <h3 class="title">${self.title}</h3>
    <sx-data-table .columns=${self.columns} .data=${state.data}>
    </sx-data-table>
  </div>`
}
