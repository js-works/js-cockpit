import { h, prop } from '../../utils/dom'
import { defaultTheme } from '../../themes/default-theme'

// @ts-ignore
import dataTableStyles from './data-table.css'

// @ts-ignore
import dataTableShoelaceStyles from './data-table.shoelace.css'

// === styles ========================================================

const defaultThemeCustomProps = `
  :host {
    ${Object.entries(defaultTheme)
      .map(([k, v]) => `${k}: ${v};`)
      .join('\n')}
  }
`

// === exports =======================================================

export const DataTable = createDataTableClass({
  name: 'sx-data-table',
  styles: [dataTableStyles, defaultThemeCustomProps, dataTableShoelaceStyles],
})

// === types =========================================================

type DataTableConfig = {
  name: string
  styles: string | string[]
}

type DataTableProps = {
  columns?: Column[]
  sortField?: number | string | null
  sortDir?: 'asc' | 'desc'
  selectMode?: 'single' | 'multi' | 'none'
  data?: any[][] | object[] | null
}

type Column =
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

type DataTableViewModel = {
  headerCells: {
    text: string
    colSpan: number
    rowSpan: number
    field: number | string | null
    sortable: boolean
  }[][]

  columns: {
    text: string
    field: number | string | null
    align: 'start' | 'center' | 'end'
    width: number
  }[]

  sortDir: 'asc' | 'desc'
  sortField: number | string | null
  selectMode: 'single' | 'multi' | 'none'
  selectedRows: Set<number | string>
  data: any[][] | object[]
  onToggleSelectAll: () => void
  onToggleSelectRow: (rowIdx: number) => void
}

// === createDataTableClass ==========================================

function createDataTableClass(
  config: DataTableConfig
): CustomElementConstructor {
  const dataTableStyles =
    typeof config.styles === 'string' ? config.styles : config.styles.join('\n')

  class DataTable extends HTMLElement {
    columns?: Column[] = []
    data?: any[] | object[]

    constructor() {
      super()
      this.attachShadow({ mode: 'open' })

      const shadowRoot = this.shadowRoot!
      const selectedRows = new Set<number | string>()

      this.connectedCallback = () => {
        const styleElem = h('style', null, dataTableStyles)
        shadowRoot.appendChild(styleElem)
        refresh()
      }

      const refresh = () => {
        if (shadowRoot.children.length > 1) {
          shadowRoot.removeChild(shadowRoot.children[1])
        }

        const model = buildDataTableViewModel(
          this,
          selectedRows,
          onToggleSelectAll,
          onToggleSelectRow
        )

        console.log('model:', model)
        shadowRoot.appendChild(h('div', null, renderDataTable(model)))
      }

      const onToggleSelectAll = () => {
        if (selectedRows.size === this.data!.length) {
          selectedRows.clear()

          shadowRoot
            .querySelectorAll('table:first-of-type > tbody > tr')
            .forEach((tr) => {
              tr.classList.remove('selected')
              ;(tr.firstChild!.firstChild as any).checked = false
            })
        } else {
          for (let i = 0; i < this.data!.length; ++i) {
            selectedRows.add(i)
          }

          shadowRoot
            .querySelectorAll('table:first-of-type > tbody > tr')
            .forEach((tr) => {
              tr.classList.add('selected')
              ;(tr.firstChild!.firstChild as any).checked = true
            })
        }
      }

      const onToggleSelectRow = (rowIdx: number) => {
        const isSelected = !selectedRows.has(rowIdx)

        if (isSelected) {
          selectedRows.add(rowIdx)
        } else {
          selectedRows.delete(rowIdx)
        }

        const tr = shadowRoot.querySelector(
          `table:first-of-type > tbody > tr:nth-child(${rowIdx + 1})`
        )!

        if (isSelected) {
          tr.classList.add('selected')
        } else {
          tr.classList.remove('selected')
        }

        const selectAllCheckBox: any = shadowRoot.querySelector(
          'table:first-of-type > thead > tr:first-child > th > input'
        )

        if (selectedRows.size === this.data!.length) {
          selectAllCheckBox.checked = true
        } else {
          selectAllCheckBox.checked = false
        }
      }
    }

    connectedCallback() {
      this.connectedCallback()
    }
  }

  return DataTable
}

function buildDataTableViewModel(
  props: DataTableProps,
  selectedRows: Set<number | string>,
  onToggleSelectAll: () => void,
  onToggleSelectRow: (rowIdx: number) => void
): DataTableViewModel {
  const headerCells: DataTableViewModel['headerCells'] = []

  const deepestCells: [
    DataTableViewModel['headerCells'][any][any],
    number
  ][] = []

  const columns: DataTableViewModel['columns'] = []

  if (props.columns) {
    addHeaderCells(headerCells, props.columns, 0, deepestCells)
    addColumns(columns, props.columns)
  }

  for (const [cell, depth] of deepestCells) {
    cell.rowSpan += headerCells.length - depth - 1
  }

  return {
    headerCells,
    columns,
    selectedRows,
    selectMode: props.selectMode || 'none',
    sortDir: props.sortDir || 'asc',
    sortField: props.sortField === undefined ? null : props.sortField,
    data: props.data || [],
    onToggleSelectAll,
    onToggleSelectRow,
  }
}

function addHeaderCells(
  headerCells: DataTableViewModel['headerCells'],
  columns: Column[] | undefined,
  depth: number,
  deepestCells: [DataTableViewModel['headerCells'][any][any], number][]
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
        sortable: (column.field && column.sortable) || false,
      }

      headerCells[depth].push(cell)
      deepestCells.push([cell, depth])
    } else {
      const cell = {
        text: column.text || '',
        colSpan: column.columns.length,
        rowSpan: 1, // will be set below
        field: null,
        sortable: false,
      }

      headerCells[depth].push(cell)
      addHeaderCells(headerCells, column.columns, depth + 1, deepestCells)
    }
  }
}

function addColumns(
  modelColumns: DataTableViewModel['columns'],
  propsColumns: Exclude<DataTableProps['columns'], undefined>
) {
  for (const column of propsColumns) {
    if (column.type === 'column') {
      modelColumns.push({
        text: column.text || '',
        field: column.field || null,
        align: column.align || 'start',

        width:
          typeof column.width !== 'number' || column.width < 0
            ? 100
            : column.width,
      })
    } else {
      addColumns(modelColumns, column.columns)
    }
  }
}

// === render methods ================================================

function renderDataTable(model: DataTableViewModel): Node {
  const ret = h(
    'table',
    null,
    renderTableHead(model),
    renderColGroup(model),
    renderTableBody(model)
  )

  return ret
}

function renderTableHead(model: DataTableViewModel) {
  let ret = null
  const rows: Node[] = []

  for (const headerRow of model.headerCells) {
    const row: Node[] = []

    if (model.selectMode !== 'none' && rows.length === 0) {
      const cell = h(
        'th',
        { rowSpan: model.headerCells.length, valign: 'bottom' },
        renderSelectAllCheckBox(model)
      )

      row.push(cell)
    }

    for (const headerCol of headerRow) {
      let className = null
      console.log(headerCol.field, model.sortField)
      if (headerCol.sortable) {
        if (headerCol.field === model.sortField) {
          className = 'sortable sorted sorted-' + model.sortDir
        } else {
          className = 'sortable '
        }
      }

      row.push(
        h(
          'th',
          {
            colSpan: headerCol.colSpan,
            rowSpan: headerCol.rowSpan,
            className,
          },

          h('label', null, headerCol.text)
        )
      )
    }

    rows.push(h('tr', null, row))
  }

  return h('thead', null, rows)
}

function renderColGroup(model: DataTableViewModel) {
  const cols: Node[] = []

  const totalWidth = model.columns.reduce(
    (prev, column) => prev + column.width,
    0
  )

  if (model.selectMode !== 'none') {
    cols.push(h('col', { style: 'width: 0' }))
  }

  for (const column of model.columns) {
    cols.push(
      h('col', { style: `width: ${(column.width * 100) / totalWidth}%` })
    )
  }

  return h('colgroup', null, cols)
}

function renderTableBody(model: DataTableViewModel): Node {
  const rows: Node[] = []

  model.data.forEach((rec, idx) => {
    const cells: (Node | null)[] = []

    if (model.selectMode !== 'none') {
      const cell = h('td', null, renderSelectRowCheckBox(model, idx))
      cells.push(cell)
    }

    for (let colIdx = 0; colIdx < model.columns.length; ++colIdx) {
      const column = model.columns[colIdx]
      const field = column.field
      const content = field ? h('div', null, (rec as any)[field]) : h('span') // TODO
      const className = field && model.sortField === field ? 'sorted' : null
      const cell = h('td', { className }, content)
      cells.push(cell)
    }

    rows.push(h('tr', null, cells))
  })

  return h('tbody', null, rows)
}

function renderSelectAllCheckBox(model: DataTableViewModel): Node {
  const checkBox = h('input', {
    type: 'checkbox',
    className: 'select-all-checkbox',
    checked: model.selectedRows.size === model.data.length,
    onclick: () => model.onToggleSelectAll(),
  })

  return checkBox
}

function renderSelectRowCheckBox(
  model: DataTableViewModel,
  rowIdx: number
): Node {
  const checkBox = h('input', {
    type: 'checkbox',
    className: 'select-row-checkbox',
    onclick: () => model.onToggleSelectRow(rowIdx),
  })

  return checkBox
}
