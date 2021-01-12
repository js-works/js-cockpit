// external imports
import { html, VNode } from 'js-elements'

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
  private data: DataTableProps['data'] = []
  private pageIndex = 50
  private pageSize = 50
  private totalItemCount = 1245

  constructor(
    private config: {
      refresh(): void

      renderDataTable(params: {
        columns: DataTableProps['columns']
        data: DataTableProps['data']
      }): VNode

      renderPaginationBar(params: {
        pageIndex: number
        pageSize: number
        totalItemCount: number
      }): VNode
    }
  ) {}

  setProps(props: DataExplorerProps) {
    Object.assign(this.props, props)
  }

  render() {
    return html`
      <div>
        <div>
          ${this.renderHeader()}
        </div>
        <div>
          ${this.renderBody()}
        </div>
        <div>
          ${this.renderFooter()}
        </div>
      </div>
    `
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
        ${this.config.renderDataTable({
          columns: this.props.columns,
          data: this.data,
        })}
      </div>
    `
  }

  renderFooter() {
    return html`
      <div>
        ${this.config.renderPaginationBar({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          totalItemCount: this.totalItemCount,
        })}
      </div>
    `
  }
}
