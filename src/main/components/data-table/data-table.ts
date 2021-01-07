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
  }[]

  sortDir: 'asc' | 'desc'
  sortField: number | string | null
  selectMode: 'single' | 'multi' | 'none'
  selectedRows: Set<number | string>
  data: any[][] | object[]
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

      const selectedRows = new Set<number | string>()
      this.attachShadow({ mode: 'open' })

      this.connectedCallback = () => {
        const styleElem = h('style', null, dataTableStyles)
        this.shadowRoot!.appendChild(styleElem)
        refresh()
      }

      const refresh = () => {
        const root = this.shadowRoot!

        if (root.children.length > 1) {
          root.removeChild(root.children[1])
        }

        const model = buildDataTableViewModel(this, selectedRows)

        console.log('model:', model)
        root.appendChild(h('div', null, renderDataTable(model)))
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
  selectedRows: Set<number | string>
): DataTableViewModel {
  console.log(1111, props.data)
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
        field: 'todo',
        sortable: column.sortable || false,
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
      })
    } else {
      addColumns(modelColumns, column.columns)
    }
  }
}

// === render methods ================================================

function renderDataTable(model: DataTableViewModel): Node {
  const ret = h('table', null, renderTableHead(model), renderTableBody(model))

  return ret
}

function renderTableHead(model: DataTableViewModel) {
  let ret = null
  const rows: Node[] = []

  for (const headerRow of model.headerCells) {
    const row: Node[] = []

    for (const headerCol of headerRow) {
      const cell = h('th', null, headerCol.text)
      prop(cell, 'colSpan', headerCol.colSpan)
      prop(cell, 'rowSpan', headerCol.rowSpan)
      row.push(cell)
    }

    rows.push(h('tr', null, row))
  }

  return h('thead', null, rows)
}

function renderTableBody(model: DataTableViewModel): Node {
  const rows: Node[] = []

  for (const rec of model.data) {
    const cells: (Node | null)[] = []

    for (let colIdx = 0; colIdx < model.columns.length; ++colIdx) {
      const column = model.columns[colIdx]
      const field = column.field

      const content = field ? h('div', null, (rec as any)[field]) : h('span') // TODO
      const cell = h('td', null, content)
      cells.push(cell)
    }

    rows.push(h('tr', null, cells))
  }

  return h('tbody', null, rows)
}
