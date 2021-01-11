// external imports
import { define, html } from 'js-elements'
import { useEffect, useOnMount } from 'js-elements/hooks'

import { DataExplorerCore } from '../../../core/data-explorer/data-explorer.core'

import '../data-table/data-table.shoelace'

// === types =========================================================

class DataExplorerProps {}

// === DataExplorer ==================================================

export const DataExplorer = define('sx-data-explorer', DataExplorerProps, (
  p
) => {
  const core = new DataExplorerCore({
    refresh: () => {},

    renderDataTable: () => {
      return html`<div>DataTable</div>`
    },

    renderPaginationBar: () => {
      return html`<div>PaginationBar</div>`
    },
  })

  return () => core.render()
})
