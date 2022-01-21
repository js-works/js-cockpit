import {
  afterConnect,
  afterDisconnect,
  afterFirstUpdate,
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

// === constants =====================================================

const widthOfRowSelectorColumn = '0'

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
  width?: number
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
  data: any[][] | object[] | null = null

  @prop
  onSortChange?: Listener<SortChangeEvent>

  @prop
  onSelectionChange?: Listener<SelectionChangeEvent>

  clearSelection() {
    if (this._selectedRows.size > 0) {
      this._selectedRows.clear()
      this._refreshSelection()
      this._completeSelectionChange()
    }
  }

  private _containerRef = createRef<HTMLElement>()
  private _theadRef = createRef<HTMLElement>()
  private _tbodyRef = createRef<HTMLElement>()
  private _scrollPaneRef = createRef<HTMLElement>()
  private _rowsSelectorRef = createRef<SlCheckbox>()
  private _selectedRows = new Set<number>()
  private _tableHeadInfo: ReturnType<typeof getTableHeadInfo> | undefined

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
    if (!this.columns) {
      return
    }

    const thead = this._theadRef.value!
    const tbody = this._tbodyRef.value!

    const colgroup = tbody.parentNode!.querySelector('colgroup')!
    const cols = colgroup.querySelectorAll('col')
    const ths = thead.querySelectorAll('th')
    let widthSum = 0

    for (let i = 0; i < cols.length - 1; ++i) {
      const width = cols[i].offsetWidth
      ths[i].style.width = `${width}px`
      widthSum += width
    }

    ths[ths.length - 1].style.width = `${thead.offsetWidth - widthSum}px`
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
    const numRows = this.data!.length

    if (numRows > this._selectedRows.size) {
      for (let i = 0; i < numRows; ++i) {
        this._selectedRows.add(i)
      }
    } else {
      this._selectedRows.clear()
    }

    this._refreshSelection()
    this._completeSelectionChange()
  }

  private _toggleRowSelection(idx: number) {
    if (this._selectedRows.has(idx)) {
      this._selectedRows.delete(idx)
    } else {
      this._selectedRows.add(idx)
    }

    this._refreshSelection()
    this._completeSelectionChange()
  }

  private _completeSelectionChange() {
    this._emitSelectionChange({
      selection: new Set(this._selectedRows)
    })
  }

  private _refreshSelection() {
    if (!this.data) {
      return
    }

    const rowsSelector = this._rowsSelectorRef.value!
    const tbody = this._tbodyRef.value!
    const checkboxes = tbody.querySelectorAll('tr > td:first-child sl-checkbox')
    const numRows = this.data!.length
    const numSelectedRows = this._selectedRows.size

    rowsSelector.checked = numSelectedRows === numRows

    for (let i = 0; i < this.data!.length; ++i) {
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

  constructor() {
    super()

    const resizeObserver = new ResizeObserver(() => this._updateColumnSizes())

    afterFirstUpdate(this, () => {
      resizeObserver.observe(this._containerRef.value!)
    })

    afterDisconnect(this, () => {
      resizeObserver.unobserve(this._containerRef.value!)
    })

    afterUpdate(this, () => {
      this._updateColumnSizes()
    })
  }

  render() {
    const tbody = this._renderTableBody()

    return html`
      <div class="base">
        <div
          class="container ${classMap({ bordered: this.bordered })}"
          ${ref(this._containerRef)}
        >
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
    this._tableHeadInfo = getTableHeadInfo(this.columns || [])
    const columns = this._tableHeadInfo!.columns
    const rows: TemplateResult[] = []
    let colgroup: TemplateResult | null = null

    if (this.data) {
      this.data.forEach((rec, idx) => {
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
          cells.push(
            html`<td>
              <div class="content">${this._renderCellContent(column, rec)}</div>
            </td>`
          )
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

      const cols: TemplateResult[] = []

      if (this.selectionMode === 'single' || this.selectionMode === 'multi') {
        cols.push(html`<col />`)
      }

      const sum = columns.reduce((acc, column) => acc + column.width!, 0)

      for (const column of columns) {
        cols.push(html`<col width=${(column.width! / sum) * 100 + '%'} />`)
      }

      colgroup = html`
        <colgroup>
          ${cols}
        </colgroup>
      `
    }

    return html`
      <div class="scrollpane-container">
        <div class="scrollpane" ${ref(this._scrollPaneRef)}>
          <table class="body-table">
            ${colgroup}
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
        const cell: HeaderCell = {
          text: column.text || '',
          colSpan: 1,
          rowSpan: 1, // might be updated later
          field: column.field || '',
          sortable: (column.field && column.sortable) || false
        }

        const width = column.width

        cell.width =
          typeof width !== 'number' || isNaN(width) || !isFinite(width)
            ? 100
            : width

        headerCells[depth].push(cell)
        deepestCells.push([cell, depth])
      } else {
        const cell: HeaderCell = {
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
