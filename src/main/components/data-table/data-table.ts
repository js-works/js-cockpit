// external imports
import { component, elem, prop, setMethods, Attrs, Listener } from 'js-element'

import {
  classMap,
  createRef,
  html,
  ref,
  lit,
  TemplateResult
} from 'js-element/lit'

import { useAfterMount, useEmitter, useState } from 'js-element/hooks'

// custom elements
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox'

// events
import { SelectionChangeEvent } from '../../events/selection-change-event'
import { SortChangeEvent } from '../../events/sort-change-event'

// styles
import dataTableStyles from './data-table.css'

// icons
import downArrowIcon from './assets/down-arrow.svg'
import upArrowIcon from './assets/up-arrow.svg'
import downUpArrowsIcon from './assets/down-up-arrows.svg'

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
  tag: 'c-data-table',
  styles: [dataTableStyles],
  impl: lit(dataTableImpl),
  uses: [SlCheckbox]
})
class DataTable extends component<{
  reset(): void
}>() {
  @prop
  columns: DataTable.Column[] | null = null

  @prop
  sortField: number | string | null = null

  @prop
  sortDir: 'asc' | 'desc' = 'asc'

  @prop
  selectionMode: 'single' | 'multi' | 'none' = 'none'

  @prop
  bordered = true

  @prop
  items: any[][] | object[] | null = null

  @prop
  onSortChange?: Listener<SortChangeEvent>

  @prop
  onSelectionChange?: Listener<SelectionChangeEvent>
}

function dataTableImpl(self: DataTable) {
  const columnSizesStyles = document.createElement('style')
  const containerRef = createRef<HTMLElement>()
  const theadRef = createRef<HTMLElement>()
  const tbodyRef = createRef<HTMLElement>()
  const rowsSelectorRef = createRef<SlCheckbox>()
  const selectedRows = new Set<number>()
  const emitSortChange = useEmitter('c-sort-change', () => self.onSortChange)

  const emitSelectionChange = useEmitter(
    'c-selection-change',
    () => self.onSelectionChange
  )

  columnSizesStyles.append(document.createTextNode(''))
  self.shadowRoot!.firstChild!.appendChild(columnSizesStyles)

  useAfterMount(() => {
    const container = containerRef.value!
    const resizeObserver = new ResizeObserver(() => updateColumnSizes())

    resizeObserver.observe(container)

    return () => resizeObserver.unobserve(container)
  })

  setMethods(self, {
    reset() {
      if (selectedRows.size > 0) {
        selectedRows.clear()
        refreshSelection()
      }
    }
  })

  function updateColumnSizes() {
    const theadHeight = theadRef.value!.offsetHeight

    const newStyles = `
      .xxxxscroll-pane {
        height: ${self.offsetHeight - theadHeight - 1}px;
        max-height: ${self.offsetHeight - theadHeight - 1}px;
      }
    `

    columnSizesStyles.innerText = newStyles
  }

  function dispatchSortChange(
    sortField: number | string,
    sortDir: 'asc' | 'desc'
  ) {
    emitSortChange({
      sortField: String(sortField),
      sortDir
    })
  }

  function toggleRowsSelection() {
    const numRows = self.items!.length

    if (numRows > selectedRows.size) {
      for (let i = 0; i < numRows; ++i) {
        selectedRows.add(i)
      }
    } else {
      selectedRows.clear()
    }

    refreshSelection()
    dispatchRowsSelectionChange()
  }

  function toggleRowSelection(idx: number) {
    if (selectedRows.has(idx)) {
      selectedRows.delete(idx)
    } else {
      selectedRows.add(idx)
    }

    refreshSelection()
    dispatchRowsSelectionChange()
  }

  function dispatchRowsSelectionChange() {
    const selection = new Set(selectedRows)

    emitSelectionChange({ selection })
  }

  function refreshSelection() {
    if (!self.items) {
      return
    }

    const rowsSelector = rowsSelectorRef.value!
    const tbody = tbodyRef.value!
    const checkboxes = tbody.querySelectorAll('tr > td:first-child sl-checkbox')
    const numRows = self.items!.length
    const numSelectedRows = selectedRows.size

    rowsSelector.checked = numSelectedRows === numRows

    for (let i = 0; i < self.items!.length; ++i) {
      const selected = selectedRows.has(i)

      if (selected) {
        tbody.children[i].classList.add('selected-row')
        checkboxes[i].setAttribute('checked', '')
      } else {
        tbody.children[i].classList.remove('selected-row')
        checkboxes[i].removeAttribute('checked')
      }
    }
  }

  function render() {
    console.log('render datatable')
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
      self.selectionMode === 'single' || self.selectionMode === 'multi'
        ? html`
            <th class="selector-column" rowspan=${headerCells.length}>
              <sl-checkbox
                class="checkbox"
                @sl-change=${toggleRowsSelection}
                ${ref(rowsSelectorRef)}
              ></sl-checkbox>
            </th>
          `
        : null

    headerCells.forEach((row, rowIdx) => {
      const cells: TemplateResult[] = []

      row.forEach((cell, cellIdx) => {
        let icon = ''

        if (cell.sortable) {
          if (cell.field !== self.sortField) {
            icon = downUpArrowsIcon
          } else if (self.sortDir === 'desc') {
            icon = downArrowIcon
          } else {
            icon = upArrowIcon
          }
        }

        const onClick =
          cell.sortable && cell.field != null
            ? () => {
                const sortField = cell.field!

                const sortDir =
                  sortField === self.sortField
                    ? self.sortDir === 'asc'
                      ? 'desc'
                      : 'asc'
                    : 'asc'

                dispatchSortChange(sortField, sortDir)
              }
            : null

        cells.push(html`
          <th
            colspan=${cell.colSpan}
            rowspan=${cell.rowSpan}
            class=${classMap({ sortable: cell.sortable })}
            @click=${onClick}
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
    console.log('renderTableBody')
    const { columns } = getTableHeadInfo(self.columns || [])
    const rows: TemplateResult[] = []

    if (self.items) {
      self.items.forEach((rec, idx) => {
        const selected = selectedRows.has(idx)

        const rowSelector =
          self.selectionMode === 'single' || self.selectionMode === 'multi'
            ? html`
                <td class="selector-column">
                  <sl-checkbox
                    type="checkbox"
                    ?checked=${selected}
                    @sl-change=${() => toggleRowSelection(idx)}
                  >
                  </sl-checkbox>
                </td>
              `
            : null

        const cells: TemplateResult[] = []

        columns.forEach((column) => {
          cells.push(html`<td>${renderCellContent(column, rec)}</td>`)
        })

        rows.push(
          html`<tr
            class="row ${classMap({
              'selected-row': selected
            })}"
          >
            ${rowSelector}${cells}
          </tr>`
        )
      })
    }

    return html`
      <div class="xxx yyy">
        <div class="scroll-pane">
          <table class="body-table">
            <tbody ${ref(tbodyRef)}>
              ${rows}
            </tbody>
          </table>
        </div>
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
