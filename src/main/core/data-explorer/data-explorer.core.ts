// external imports
import { html, TemplateResult } from 'lit-html'

// internal imports
import { DataTableProps } from '../../core/data-table/data-table.core'

// @ts-ignore
import dataExplorerCoreStyles from './data-explorer.core.css'

// === exports =======================================================

export { DataExplorerCore, DataExplorerProps }

// === DataExplorerCore ==============================================

type DataExplorerProps = {
  title?: string
  columns?: DataTableProps['columns']
}

class DataExplorerCore {
  static coreStyles = dataExplorerCoreStyles

  private props: DataExplorerProps = {}

  constructor(
    private config: {
      refresh(): void
      renderDataTable(): TemplateResult
      renderPaginationBar(): TemplateResult
    }
  ) {}

  setProps(props: DataExplorerProps) {
    Object.assign(this.props, props)
  }

  render() {
    return html`<div>DataExplorer</div>`
  }

  // --- private methods ---------------------------------------------

  private renderHeader() {
    return html`
      <div>
        Header
      </div>
    `
  }

  private renderBody() {
    return html`
      <div>
        ${this.config.renderDataTable()}
      </div>
    `
  }

  renderFooter() {
    return html`
      <div>
        ${this.config.renderPaginationBar()}
      </div>
    `
  }
}
