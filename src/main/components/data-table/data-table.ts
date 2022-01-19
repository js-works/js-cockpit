import {
  afterConnect,
  afterInit,
  afterUpdate,
  beforeUpdate,
  bind,
  createEmitter,
  elem,
  prop,
  Attrs,
  Listener,
  Component
} from '../../utils/components'

import { classMap, createRef, html, ref, TemplateResult } from '../../utils/lit'
import { createLocalizer } from '../../utils/i18n'

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
  uses: [SlCheckbox]
})
class DataTable extends Component {
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

  private _columnSizesStyles = document.createElement('style')
  private _containerRef = createRef<HTMLElement>()
  private _theadRef = createRef<HTMLElement>()
  private _tbodyRef = createRef<HTMLElement>()
  private _scrollPaneRef = createRef<HTMLElement>()
  private _rowsSelectorRef = createRef<SlCheckbox>()
  private _selectedRows = new Set<number>()
  private _emitSortChange = createEmitter(
    this,
    'c-sort-change',
    () => this.onSortChange
  )

  private _emitSelectionChange = createEmitter(
    this,
    'c-selection-change',
    () => this.onSelectionChange
  )

  private _updateColumnSizes() {
    const theadHeight = this._theadRef.value!.offsetHeight

    const newStyles = `
      .xxxxscroll-pane {
        height: ${this.offsetHeight - theadHeight - 1}px;
        max-height: ${this.offsetHeight - theadHeight - 1}px;
      }
    `

    this._columnSizesStyles.innerText = newStyles
  }

  private _dispatchSortChange(
    sortField: number | string,
    sortDir: 'asc' | 'desc'
  ) {
    this._emitSortChange({
      sortField: String(sortField),
      sortDir
    })
  }

  private _toggleRowsSelection() {
    const numRows = this.items!.length

    if (numRows > this._selectedRows.size) {
      for (let i = 0; i < numRows; ++i) {
        this._selectedRows.add(i)
      }
    } else {
      this._selectedRows.clear()
    }

    this._refreshSelection()
    this._dispatchSelectionChange()
  }

  private _toggleRowSelection(idx: number) {
    if (this._selectedRows.has(idx)) {
      this._selectedRows.delete(idx)
    } else {
      this._selectedRows.add(idx)
    }

    this._refreshSelection()
    this._dispatchSelectionChange()
  }

  private _dispatchSelectionChange() {
    const selection = new Set(this._selectedRows)

    this._emitSelectionChange({ selection })
  }

  private _refreshSelection() {
    if (!this.items) {
      return
    }

    const rowsSelector = this._rowsSelectorRef.value!
    const tbody = this._tbodyRef.value!
    const checkboxes = tbody.querySelectorAll('tr > td:first-child sl-checkbox')
    const numRows = this.items!.length
    const numSelectedRows = this._selectedRows.size

    rowsSelector.checked = numSelectedRows === numRows

    for (let i = 0; i < this.items!.length; ++i) {
      const selected = this._selectedRows.has(i)

      if (selected) {
        tbody.children[i].classList.add('selected-row')
        checkboxes[i].setAttribute('checked', '')
      } else {
        tbody.children[i].classList.remove('selected-row')
        checkboxes[i].removeAttribute('checked')
      }
    }
  }

  construtor() {
    this._columnSizesStyles.append(document.createTextNode(''))
    this.shadowRoot!.firstChild!.appendChild(this._columnSizesStyles)

    afterConnect(this, () => {
      const container = this._containerRef.value!
      const resizeObserver = new ResizeObserver(() => this._updateColumnSizes())

      resizeObserver.observe(container)

      return () => resizeObserver.unobserve(container)
    })

    beforeUpdate(this, () => {
      this._selectedRows.clear()
      this._scrollPaneRef.value!.scroll({ top: 0, left: 0 })
    })

    // TODO - this is ugly!!!
    afterUpdate(this, () => {
      this._refreshSelection()
      this._dispatchSelectionChange()
    })
  }

  render() {
    return html`
      <div class="base">
        <div class="container" ${ref(this._containerRef)}>
          ${this._renderTableHeader()} ${this._renderTableBody()}
        </div>
      </div>
    `
  }

  private _renderTableHeader() {
    const rows: TemplateResult[] = []
    const { headerCells } = getTableHeadInfo(this.columns || [])

    const rowsSelector =
      this.selectionMode === 'single' || this.selectionMode === 'multi'
        ? html`
            <th class="selector-column" rowspan=${headerCells.length}>
              <sl-checkbox
                class="checkbox"
                @sl-change=${this._toggleRowsSelection}
                ${ref(this._rowsSelectorRef)}
              ></sl-checkbox>
            </th>
          `
        : null

    headerCells.forEach((row, rowIdx) => {
      const cells: TemplateResult[] = []

      row.forEach((cell, cellIdx) => {
        let icon = ''

        if (cell.sortable) {
          if (cell.field !== this.sortField) {
            icon = downUpArrowsIcon
          } else if (this.sortDir === 'desc') {
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
                  sortField === this.sortField
                    ? this.sortDir === 'asc'
                      ? 'desc'
                      : 'asc'
                    : 'asc'

                this._dispatchSortChange(sortField, sortDir)
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
        <thead ${ref(this._theadRef)}>
          ${rows}
        </thead>
      </table>
    `
  }

  private _renderTableBody() {
    const { columns } = getTableHeadInfo(this.columns || [])
    const rows: TemplateResult[] = []

    if (this.items) {
      this.items.forEach((rec, idx) => {
        const selected = this._selectedRows.has(idx)

        const rowSelector =
          this.selectionMode === 'single' || this.selectionMode === 'multi'
            ? html`
                <td class="selector-column">
                  <sl-checkbox
                    type="checkbox"
                    ?checked=${selected}
                    @sl-change=${() => this._toggleRowSelection(idx)}
                  >
                  </sl-checkbox>
                </td>
              `
            : null

        const cells: TemplateResult[] = []

        columns.forEach((column) => {
          cells.push(html`<td>${this._renderCellContent(column, rec)}</td>`)
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
      <div>
        <div class="scroll-pane" ${ref(this._scrollPaneRef)}>
          <table class="body-table">
            <tbody ${ref(this._tbodyRef)}>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    `
  }

  private _renderCellContent(column: HeaderCell, rec: any) {
    // TODO
    return html`${rec[column.field!]}` // TODO
  }
}

const getTableHeadInfo: (columns: DataTable.Column[]) => {
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
