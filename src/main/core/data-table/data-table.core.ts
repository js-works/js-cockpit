import { h, prop } from '../../utils/dom'

// @ts-ignore
import dataTableCoreStyles from './data-table.core.css'

// === exports =======================================================

export { DataTableCore, DataTableParams as DataTableProps, Column }

// === types =========================================================

type Icons = {
  sortedAsc: Element
  sortedDesc: Element
  sortable?: Element
}

type DataTableParams = {
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
  icons: Icons
  renderCheckbox: ((checked: boolean, onChange: () => void) => Element) | null
}

// === DataTableCore =================================================

class DataTableCore {
  static coreStyles = dataTableCoreStyles

  private props: DataTableParams = {
    columns: [],
    data: [],
    selectMode: 'none',
    sortDir: 'asc',
    sortField: null,
  }

  private element: Element = h('div')
  private selectedRows: Set<number> = new Set()

  constructor(
    private config: {
      onToggleSelectAll: () => void
      onToggleSelectRow: (rowIdx: number) => void
      icons: Icons
      renderCheckbox: (checked: boolean, onChange: () => void) => Element
    }
  ) {}

  refresh() {
    let ignoreChangeEvents = false

    const model = this.buildViewModel({
      onToggleSelectAll: () => {
        if (ignoreChangeEvents) {
          return
        }

        const selectAll = this.selectedRows.size !== this.props.data!.length

        if (!selectAll) {
          this.selectedRows.clear()
        }

        const trs = this.element.querySelectorAll(
          `table:first-of-type > tbody > tr`
        )

        ignoreChangeEvents = true

        trs.forEach((tr, rowIdx) => {
          if (selectAll) {
            this.selectedRows.add(rowIdx)
            tr.classList.add('jsc-dataTable-tr--selected')
            ;(tr.firstChild!.firstChild as any).checked = true
          } else {
            tr.classList.remove('jsc-dataTable-tr--selected')
            ;(tr.firstChild!.firstChild as any).checked = false
          }
        })

        ignoreChangeEvents = false
      },

      onToggleSelectRow: (rowIdx: number) => {
        if (ignoreChangeEvents) {
          return
        }

        const selectAllCheckbox = this.element.querySelector(
          'table:first-of-type > thead > tr:first-child > th:first-child > :first-child'
        ) as HTMLInputElement

        const tr = this.element.querySelector(
          `table:first-of-type > tbody > tr:nth-child(${rowIdx + 1})`
        )!

        if (this.selectedRows.has(rowIdx)) {
          this.selectedRows.delete(rowIdx)
          tr.classList.remove('jsc-dataTable-tr--selected')
        } else {
          this.selectedRows.add(rowIdx)
          tr.classList.add('jsc-dataTable-tr--selected')
        }

        ignoreChangeEvents = true

        selectAllCheckbox.checked =
          this.selectedRows.size === this.props.data!.length

        ignoreChangeEvents = false
      },
    })

    this.element.innerHTML = ''
    this.element.appendChild(renderDataTable(model))
  }

  setProps(props: Partial<DataTableParams>) {
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

  private buildViewModel(params: {
    onToggleSelectAll: () => void
    onToggleSelectRow: (rowIdx: number) => void
  }): DataTableViewModel {
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
      onToggleSelectAll: params.onToggleSelectAll,
      onToggleSelectRow: params.onToggleSelectRow,
      icons: this.config.icons,
      renderCheckbox: this.config.renderCheckbox || null,
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
      propsColumns: Exclude<DataTableParams['columns'], undefined>
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
    { className: 'jsc-dataTable' },
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
        {
          className: 'jsc-dataTable-th jsc-dataTable-selectionColumn',
          rowSpan: model.headerCells.length,
          valign: 'bottom',
        },
        renderSelectAllCheckbox(model)
      )

      row.push(cell)
    }

    for (const headerCol of headerRow) {
      let className = 'jsc-dataTable-th'
      let icon = null

      if (headerCol.sortable) {
        if (headerCol.field === model.sortField) {
          icon =
            model.sortDir === 'asc'
              ? model.icons.sortedAsc.cloneNode(true)
              : model.icons.sortedDesc.cloneNode(true)
          className += ' jsc-dataTable-th--sorted-' + model.sortDir
        } else {
          if (model.icons.sortable) {
            icon = model.icons.sortable.cloneNode(true)
          }

          className += ' jsc-dataTable-th--unsorted'
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

          h('label', null, headerCol.text, icon)
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
      const cell = h(
        'td',
        { className: 'jsc-dataTable-td jsc-dataTable-selectionColumn' },
        renderSelectRowCheckbox(model, idx)
      )
      cells.push(cell)
    }

    for (let colIdx = 0; colIdx < model.columns.length; ++colIdx) {
      const column = model.columns[colIdx]
      const field = column.field
      const content = field ? h('div', null, (rec as any)[field]) : h('span') // TODO

      const className =
        field && model.sortField === field
          ? 'jsc-dataTable-td jsc-dataTable-td--sorted'
          : 'jsc-dataTable-td'

      const cell = h('td', { className }, content)
      cells.push(cell)
    }

    rows.push(h('tr', { className: 'jsc-dataTable-tr' }, cells))
  })

  return h('tbody', null, rows)
}

function renderSelectAllCheckbox(model: DataTableViewModel): Node {
  const checked = model.selectedRows.size === model.data.length

  const checkbox = model.renderCheckbox
    ? model.renderCheckbox(checked, model.onToggleSelectAll)
    : h('input', {
        type: 'checkbox',
        checked,
        onclick: model.onToggleSelectAll,
      })

  checkbox.className = 'jsc-dataTable-checkbox jsc-dataTable-selectAllCheckbox'

  return checkbox
}

function renderSelectRowCheckbox(
  model: DataTableViewModel,
  rowIdx: number
): Node {
  const checked = model.selectedRows.has(rowIdx)

  const checkbox = model.renderCheckbox
    ? model.renderCheckbox(checked, () => model.onToggleSelectRow(rowIdx))
    : h('input', {
        type: 'checkbox',
        checked,
        onclick: () => model.onToggleSelectRow(rowIdx),
      })

  checkbox.className = 'jsc-dataTable-checkbox jsc-dataTable-selectRowCheckbox'
  return checkbox
}
