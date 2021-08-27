import { component, elem, prop, Attrs } from 'js-element'
import { html, classMap, withLit, TemplateResult } from 'js-element/lit'
import { useState } from 'js-element/hooks'

/** @ts-ignore */
import dataTableStyles from './data-table.css' // TODO!!!

// === exports =======================================================

export { DataTable }

// === types =========================================================

namespace DataTable {
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

type HeaderCell = {
  text: string
  colSpan: number
  rowSpan: number
  field: number | string | null
  sortable: boolean
}

// === DataTable =====================================================

@elem({
  tag: 'sx-data-table',
  styles: [dataTableStyles],
  impl: withLit(dataTableImpl)
})
class DataTable extends component() {
  @prop
  columns: DataTable.Column[] | null = null

  @prop
  sortField: number | string | null = null

  @prop
  sortDir: 'asc' | 'desc' = 'asc'

  @prop
  selectMode: 'single' | 'multi' | 'none' = 'none'

  @prop
  bordered = false

  @prop
  data: any[][] | object[] | null = null
}

function dataTableImpl(self: DataTable) {
  function renderTableHeader() {
    const rows: TemplateResult[] = []
    const { headerCells } = getTableHeadInfo(self.columns || [])

    headerCells.forEach((row) => {
      const cells: TemplateResult[] = []

      row.forEach((cell, cellIdx) => {
        cells.push(
          html`<th
            colspan=${cell.colSpan}
            rowspan=${cell.rowSpan}
            class=${classMap({ sortable: cell.sortable })}
          >
            ${cell.text}
          </th>`
        )
      })

      rows.push(
        html`<tr>
          ${cells}
        </tr>`
      )
    })

    return html`
      <thead>
        ${rows}
      </thead>
    `
  }

  function renderTableBody() {
    const { columns } = getTableHeadInfo(self.columns || [])
    const data = self.data || []
    const rows: TemplateResult[] = []

    data.forEach((rec) => {
      const cells: TemplateResult[] = []

      columns.forEach((column) => {
        cells.push(html`<td>${renderCellContent(column, rec)}</td>`)
      })

      rows.push(
        html`<tr>
          ${cells}
        </tr>`
      )
    })

    return html`
      <tbody>
        ${rows}
      </tbody>
    `
  }

  function renderCellContent(column: HeaderCell, rec: any) {
    // TODO
    return html`${rec[column.field!]}` // TODO
  }

  return () => html`
    <div class="base">
      <table class=${classMap({ bordered: self.bordered })}>
        ${renderTableHeader()} ${renderTableBody()}
      </table>
    </div>
  `
}

const getTableHeadInfo: (
  columns: DataTable.Column[]
) => {
  headerCells: HeaderCell[][]
  columns: HeaderCell[]
} = (() => {
  function addHeaderCells(
    columns: DataTable.Column[] | undefined,
    headerCells: HeaderCell[][],
    depth: number,
    deepestCells: [HeaderCell, number][]
  ): void {
    if (!columns || columns.length === 0) {
      return
    }

    if (!headerCells[depth]) {
      headerCells.push([])
    }

    for (const column of columns) {
      if (column.type === 'column') {
        const cell = {
          text: column.text || '',
          colSpan: 1,
          rowSpan: 1, // might be updated later
          field: column.field || '',
          sortable: (column.field && column.sortable) || false
        }

        headerCells[depth].push(cell)
        deepestCells.push([cell, depth])
      } else {
        const cell = {
          text: column.text || '',
          colSpan: column.columns.length,
          rowSpan: 1, // will be set below
          field: null,
          sortable: false
        }

        headerCells[depth].push(cell)
        addHeaderCells(column.columns, headerCells, depth + 1, deepestCells)
      }
    }
  }

  return (columns?: DataTable.Column[]) => {
    const ret: HeaderCell[][] = []
    const deepestCells: [HeaderCell, number][] = []

    addHeaderCells(columns, ret, 0, deepestCells)

    for (const [cell, depth] of deepestCells) {
      cell.rowSpan += ret.length - depth - 1
    }

    return {
      headerCells: ret,
      columns: deepestCells.map((it) => it[0])
    }
  }
})()
