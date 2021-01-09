import { h, prop } from '../../utils/dom'

// @ts-ignore
import dataTableCoreStyles from './data-table.core.css'

// === exports =======================================================

export { DataTableCore, DataTableProps, Column }

// === types =========================================================

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

// === DataTableCore =================================================

class DataTableCore {
  static coreStyles = dataTableCoreStyles

  private props: DataTableProps = {
    columns: [],
    data: [],
    selectMode: 'none',
    sortDir: 'asc',
    sortField: null,
  }

  private element: Element = h('div')
  private selectedRows: Set<number> = new Set()

  constructor(
    private onToggleSelectAll: () => void = () => {},
    private onToggleSelectRow: (rowIdx: number) => void = () => {}
  ) {}

  refresh() {
    const model = this.buildViewModel(
      this.onToggleSelectAll,
      this.onToggleSelectRow
    )

    this.element.innerHTML = ''
    this.element.appendChild(renderDataTable(model))
  }

  setProps(props: Partial<DataTableProps>) {
    Object.assign(this.props, props)
    this.refresh()
  }

  getProps() {
    return this.props
  }

  getElement() {
    return this.element
  }

  // --- private methods ---------------------------------------------

  private buildViewModel(
    onToggleSelectAll: () => void,
    onToggleSelectRow: (rowIdx: number) => void
  ): DataTableViewModel {
    const headerCells: DataTableViewModel['headerCells'] = []

    const deepestCells: [
      DataTableViewModel['headerCells'][any][any],
      number
    ][] = []

    const columns: DataTableViewModel['columns'] = []

    if (this.props.columns) {
      addHeaderCells(headerCells, this.props.columns, 0, deepestCells)
      addColumns(columns, this.props.columns)
    }

    for (const [cell, depth] of deepestCells) {
      cell.rowSpan += headerCells.length - depth - 1
    }

    return {
      headerCells,
      columns,
      selectedRows: this.selectedRows,
      selectMode: this.props.selectMode || 'none',
      sortDir: this.props.sortDir || 'asc',
      sortField:
        this.props.sortField === undefined ? null : this.props.sortField,
      data: this.props.data || [],
      onToggleSelectAll,
      onToggleSelectRow,
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
  }
}

// === render methods ================================================

function renderDataTable(model: DataTableViewModel): Element {
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
          className = 'sortable unsorted'
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
