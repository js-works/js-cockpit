import { html, property, LitElement } from 'lit-element'
import { registerElement } from '../../../utils/dom'
import {
  DataExplorerCore,
  DataExplorerProps,
} from '../../../core/data-explorer/data-explorer.core'

import '../data-table/data-table.shoelace'

// === types =========================================================

class DataExplorer extends LitElement {
  private core = new DataExplorerCore({
    refresh: () => {
      this.requestUpdate()
    },
    renderDataTable: () => html`<div>DataTable</div>`,
    renderPaginationBar: () => html`<div>PaginationBar</div>`,
  })

  render() {
    return html`
      <div>
        ${this.core.render()}
      </div>
    `
  }
}

registerElement('sx-data-explorer', DataExplorer)
//registerElement('sx-data-table', DataTable)
