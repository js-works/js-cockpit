// external imports
import { define, html } from 'js-elements'
import { useEffect, useOnMount } from 'js-elements/hooks'

import { DataExplorerCore } from '../../../core/data-explorer/data-explorer.core'
import { PaginationBar } from '../../../shoelace/components/pagination-bar/pagination-bar.shoelace'
import { DataTable } from '../../../shoelace/components/data-table/data-table.shoelace'

import '../data-table/data-table.shoelace'

// === types =========================================================

class DataExplorerProps {
  columns: any
}

// === DataExplorer ==================================================

export const DataExplorer = define('sx-data-explorer', DataExplorerProps, (
  p
) => {
  const core = new DataExplorerCore({
    refresh: () => {},

    renderDataTable: ({ columns, data }) => {
      return html`
        <${DataTable}
          columns=${columns}
        >
        </${DataTable}>
      `
    },

    renderPaginationBar: ({ pageIndex, pageSize, totalItemCount }) => {
      return html`
        <${PaginationBar}
          pageIndex=${pageIndex}
          pageSize=${pageSize}
          totalItemCount=${totalItemCount}
        >
        </${PaginationBar}>
      `
    },
  })

  core.setProps(p)

  return () => core.render()
})
