import {
  bind,
  elem,
  prop,
  afterInit,
  afterConnect,
  Attrs,
  Component
} from '../../utils/components'

import { createRef, html, classMap, ref } from '../../utils/lit'
import { createLocalizer } from '../../utils/i18n'
import { ActionBar } from '../action-bar/action-bar'
import { DataTable } from '../data-table/data-table'
import { PaginationBar } from '../pagination-bar/pagination-bar'
import { addToDict, TermsOf } from 'js-localize'

// events
import { SelectionChangeEvent } from '../../events/selection-change-event'
import { SortChangeEvent } from '../../events/sort-change-event'
import { PageChangeEvent } from '../../events/page-change-event'
import { PageSizeChangeEvent } from '../../events/page-size-change-event'

// styles
import dataExplorerStyles from './data-explorer.css'

// === exports =======================================================

export { DataExplorer }

// === types =========================================================

namespace DataExplorer {
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

  export type Action = {
    kind: 'action'
    text: string
    actionId: string
    type: 'general' | 'single-row' | 'multi-row'
  }

  export type ActionGroup = {
    kind: 'action-group'
    text: string

    actions: {
      text: string
      actionId: string
      type: 'general' | 'single-row' | 'multi-row'
    }[]
  }

  export type Actions = (Action | ActionGroup)[]

  export type FetchItems = (params: {
    count: number
    offset: number
    sortField: string | number | null
    sortDir: 'asc' | 'desc'
    locale: string
  }) => Promise<{
    items: Record<string, any>[]
    totalItemCount: number
  }>
}

// === translations ==================================================

declare global {
  namespace Localize {
    interface TranslationsMap {
      'jsCockpit.dataExplorer': TermsOf<typeof translations>
    }
  }
}

const translations = {
  en: {
    'jsCockpit.dataExplorer': {
      loadingMessage: 'Loading...'
    }
  }
}

addToDict(translations)

// === DataExplorer ==================================================

@elem({
  tag: 'c-data-explorer',
  styles: [dataExplorerStyles],
  uses: [ActionBar, DataTable, PaginationBar]
})
class DataExplorer extends Component {
  @prop({ attr: Attrs.string })
  title: string = ''

  @prop
  columns: DataExplorer.Column[] | null = null

  @prop
  initialSortField: number | string | null = null

  @prop
  initialSortDir: 'asc' | 'desc' = 'asc'

  @prop({ attr: Attrs.string })
  selectionMode: 'single' | 'multi' | 'none' = 'none'

  @prop({ attr: Attrs.boolean })
  fullSize = false

  @prop
  actions?: DataExplorer.Actions

  @prop
  fetchItems?: DataExplorer.FetchItems

  private _loc = createLocalizer(this, 'jsCockpit.dataExplorer')
  private _pageIndex = 0
  private _pageSize = 50
  private _totalItemCount = -1
  private _sortField: string | number | null = null
  private _sortDir: 'asc' | 'desc' = 'asc'
  private _items: Record<string, any>[] = []
  private _numSelectedRows = 0
  private _showOverlay = false
  private _timeoutId: any = null
  private _actionBarRef = createRef<ActionBar>()
  private _dataTableRef = createRef<DataTable>()
  private _paginationBarRef = createRef<PaginationBar>()
  private _overlayRef = createRef<HTMLElement>()

  private _loadItems(
    params?: Partial<{
      pageIndex: number
      pageSize: number
      sortField: string | number | null
      sortDir: 'asc' | 'desc'
    }>
  ) {
    const par = Object.assign(
      {
        pageIndex: this._pageIndex,
        pageSize: this._pageSize,
        sortField: this._sortField,
        sortDir: this._sortDir
      },
      params
    )

    if (!this.fetchItems) {
      return
    }

    this._timeoutId = setTimeout(() => {
      this._showOverlay = true
      this._overlayRef.value!.classList.replace('overlay-hide', 'overlay-show')
    }, 200)

    this.fetchItems({
      count: par.pageSize,
      locale: this._loc.getLocale(),
      offset: par.pageIndex * par.pageSize,
      sortField: par.sortField,
      sortDir: par.sortDir
    }).then((result) => {
      this._pageIndex = par.pageIndex
      this._pageSize = par.pageSize
      this._totalItemCount = result.totalItemCount
      this._sortField = par.sortField
      this._sortDir = par.sortDir
      this._items = result.items

      Object.assign(this._paginationBarRef.value!, {
        pageIndex: this._pageIndex,
        pageSize: this._pageSize,
        totalItemCount: this._totalItemCount
      })

      this._dataTableRef.value!.sortField = this._sortField
      this._dataTableRef.value!.sortDir = this._sortDir
      this._dataTableRef.value!.items = this._items

      if (this._timeoutId) {
        clearTimeout(this._timeoutId)
        this._timeoutId = null
      }

      this._showOverlay = false
      this._overlayRef.value!.classList.replace('overlay-show', 'overlay-hide')
    })
  }

  @bind
  private _onSortChange(ev: SortChangeEvent) {
    this._loadItems({
      pageIndex: 0,
      sortField: ev.detail.sortField,
      sortDir: ev.detail.sortDir
    })
  }

  @bind
  private _onSelectionChange(ev: SelectionChangeEvent) {
    this._numSelectedRows = ev.detail.selection.size
    this._actionBarRef.value!.actions = this._convertActions()
  }

  @bind
  private _onPageChange(ev: PageChangeEvent) {
    this._loadItems({ pageIndex: ev.detail.pageIndex })
  }

  @bind
  private _onPageSizeChange(ev: PageSizeChangeEvent) {
    this._loadItems({ pageIndex: 0, pageSize: ev.detail.pageSize })
  }

  constructor() {
    super()

    afterInit(this, () => {
      this._sortField = this.initialSortField
      this._sortDir = this.initialSortDir
    })

    afterConnect(this, () => {
      this._loadItems()
    })
  }

  private _convertActions(): ActionBar.Actions {
    if (!this.actions) {
      return []
    }

    return this.actions.map((it) => {
      if (it.kind === 'action') {
        return {
          kind: 'action',
          actionId: '',
          text: it.text,
          disabled:
            (it.type === 'single-row' && this._numSelectedRows !== 1) ||
            (it.type === 'multi-row' && this._numSelectedRows === 0)
        }
      } else {
        return {
          kind: 'action-group',
          text: it.text,
          actions: it.actions.map((it) => ({
            kind: 'action',
            text: it.text,
            actionId: '',
            disabled:
              (it.type === 'single-row' && this._numSelectedRows !== 1) ||
              (it.type === 'multi-row' && this._numSelectedRows === 0)
          }))
        }
      }
    })
  }

  render() {
    return html`
      <div class="base ${classMap({ 'full-size': this.fullSize })}">
        <div class="header">
          <h3 class="title">${this.title}</h3>
          <div class="actions">${this._renderActionBar()}</div>
          <div class="search">
            <slot name="search"></slot>
          </div>
        </div>
        <c-data-table
          class="table"
          .columns=${this.columns}
          .selectionMode=${this.selectionMode}
          .data=${this._items}
          .bordered=${false}
          .sortField=${this.initialSortField}
          .sortDir=${this.initialSortDir}
          .onSortChange=${this._onSortChange}
          .onSelectionChange=${this._onSelectionChange}
          ${ref(this._dataTableRef)}
        >
        </c-data-table>
        <div class="footer">
          <c-pagination-bar
            .pageIndex=${this._pageIndex}
            .pageSize=${this._pageSize}
            .totalItemCount=${this._totalItemCount}
            .onPageChange=${this._onPageChange}
            .onPageSizeChange=${this._onPageSizeChange}
            ${ref(this._paginationBarRef)}
          ></c-pagination-bar>
        </div>
        <div
          class="overlay ${classMap({
            'overlay-show': this._showOverlay,
            'overlay-hide': !this._showOverlay
          })}"
          ${ref(this._overlayRef)}
        >
          <div class="overlay-top"></div>
          <div class="overlay-center">
            <div class="loading-message">${this._loc('loadingMessage')}</div>
            <sl-spinner class="loading-spinner"></sl-spinner>
          </div>
          <div class="overlay-bottom"></div>
        </div>
      </div>
    `
  }

  @bind
  private _renderActionBar() {
    if (!this.actions) {
      return null
    }

    return html`
      <c-action-bar
        .actions=${this._convertActions()}
        ${ref(this._actionBarRef)}
      >
      </c-action-bar>
    `
  }
}
