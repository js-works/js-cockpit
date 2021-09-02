// external imports
import { component, elem, prop, Attrs } from 'js-element'

import {
  classMap,
  createRef,
  html,
  ref,
  withLit,
  TemplateResult
} from 'js-element/lit'

import { useAfterMount, useStatus, useState } from 'js-element/hooks'

// custom elements
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox'

// styles
import dataTableStyles from './data-table.css'

// icons
import downArrowSvg from './assets/down-arrow.svg'
import upArrowSvg from './assets/up-arrow.svg'
import downUpArrowsSvg from './assets/down-up-arrows.svg'

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
  tag: 'jsc-data-table',
  styles: [dataTableStyles],
  uses: [SlCheckbox],
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
  bordered = true

  @prop
  data: any[][] | object[] | null = null
}

function dataTableImpl(self: DataTable) {
  const columnSizesStyles = document.createElement('style')
  const containerRef = createRef<HTMLElement>()
  const theadRef = createRef<HTMLElement>()
  const tbodyRef = createRef<HTMLElement>()

  columnSizesStyles.append(document.createTextNode(''))
  self.shadowRoot!.firstChild!.appendChild(columnSizesStyles)

  useAfterMount(() => {
    const container = containerRef.value!
    const resizeObserver = new ResizeObserver(() => updateColumnSizes())

    resizeObserver.observe(container)

    return () => resizeObserver.unobserve(container)
  })

  function updateColumnSizes() {
    const container = containerRef.value!
    const tableWidth = container.clientWidth
    const tableHeight = container.clientHeight
    const theadHeight = theadRef.value!.clientHeight

    const newStyles = `
    `
    console.log(newStyles)
    columnSizesStyles.innerText = newStyles
  }

  function render() {
    //return html`<div class="test">xxx</div>`
    return html`
      <div class="base">
        <div class="container" ${ref(containerRef)}>
          ${renderTableHeader()} ${renderTableBody()}
        </div>
      </div>
    `
  }

  function renderTableHeader() {
    const rows: TemplateResult[] = []
    const { headerCells } = getTableHeadInfo(self.columns || [])

    const rowsSelector =
      self.selectMode === 'single' || self.selectMode === 'multi'
        ? html`
            <th class="selector-column" rowspan=${headerCells.length}>
              <sl-checkbox class="checkbox"></sl-checkbox>
            </th>
          `
        : null

    headerCells.forEach((row, rowIdx) => {
      const cells: TemplateResult[] = []

      row.forEach((cell, cellIdx) => {
        let icon = ''

        if (cell.sortable) {
          if (cell.field !== self.sortField) {
            icon = downUpArrowsSvg
          } else if (self.sortDir !== 'desc') {
            icon = downArrowSvg
          } else {
            icon = upArrowSvg
          }
        }

        cells.push(html`
          <th
            colspan=${cell.colSpan}
            rowspan=${cell.rowSpan}
            class=${classMap({ sortable: cell.sortable })}
          >
            <div class="content">
              ${cell.text}
              ${!icon ? '' : html`<sl-icon src=${icon} class="icon"></sl-icon>`}
            </div>
          </th>
        `)
      })

      rows.push(
        html`<tr>
          ${rowIdx === 0 ? rowsSelector : null}${cells}
        </tr>`
      )
    })

    return html`
      <table class="head-table">
        <thead ${ref(theadRef)}>
          ${rows}
        </thead>
      </table>
    `
  }

  function renderTableBody() {
    const { columns } = getTableHeadInfo(self.columns || [])
    const data = self.data || []
    const rows: TemplateResult[] = []

    const rowSelector =
      self.selectMode === 'single' || self.selectMode === 'multi'
        ? html`
            <td class="selector-column">
              <sl-checkbox></sl-checkbox>
            </td>
          `
        : null

    data.forEach((rec) => {
      const cells: TemplateResult[] = []

      columns.forEach((column) => {
        cells.push(html`<td>${renderCellContent(column, rec)}</td>`)
      })

      rows.push(
        html`<tr>
          ${rowSelector}${cells}
        </tr>`
      )
    })

    return html`
      <div class="scroll-pane">
        <table class="body-table">
          <tbody ${ref(tbodyRef)}>
            ${rows}
          </tbody>
        </table>
      </div>
    `
  }

  function renderCellContent(column: HeaderCell, rec: any) {
    // TODO
    return html`${rec[column.field!]}` // TODO
  }

  return render
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
