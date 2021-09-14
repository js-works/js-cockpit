// external imports
import { component, elem, prop, Attrs } from 'js-element'
import { classMap, createRef, html, lit, ref } from 'js-element/lit'
import { useAfterMount, useRefresher } from 'js-element/hooks'

// internal imports
import { ActionBar } from '../action-bar/action-bar'
import { DataTable } from '../data-table/data-table'
import { PaginationBar } from '../pagination-bar/pagination-bar'

// events
import { SelectionChangeEvent } from '../../events/selection-change-event'
import { SortChangeEvent } from '../../events/sort-change-event'
import { PageChangeEvent } from '../../events/page-change-event'
import { PageSizeChangeEvent } from '../../events/page-size-change-event'

// icons
import searchIcon from '../../icons/search.svg'
import filterIcon from '../../icons/filter.svg'

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
    sortField: string
    sortDir: 'asc' | 'desc'
    locale: string
  }) => Promise<{
    items: Record<string, any>[]
    totalItemCount: number
  }>
}

// === DataExplorer ==================================================

@elem({
  tag: 'c-data-explorer',
  styles: [dataExplorerStyles],
  impl: lit(dataExplorerImpl),
  uses: [ActionBar, DataTable, PaginationBar]
})
class DataExplorer extends component() {
  @prop({ attr: Attrs.string })
  title: string = ''

  @prop
  columns: DataExplorer.Column[] | null = null

  @prop
  sortField: number | string | null = null

  @prop
  sortDir: 'asc' | 'desc' = 'asc'

  @prop({ attr: Attrs.string })
  selectionMode: 'single' | 'multi' | 'none' = 'none'

  @prop({ attr: Attrs.boolean })
  fullSize = false

  @prop
  actions?: DataExplorer.Actions

  @prop
  fetchItems?: DataExplorer.FetchItems
}

function dataExplorerImpl(self: DataExplorer) {
  const refresh = useRefresher()

  const actionBarRef = createRef<ActionBar>()
  const dataTableRef = createRef<DataTable>()
  const paginationBarRef = createRef<PaginationBar>()
  const overlayRef = createRef<HTMLElement>()

  let pageIndex = 0
  let pageSize = 50
  let totalItemCount = -1
  let sortField: string | null = null
  let sortDir: 'asc' | 'desc' = 'asc'
  let items: Record<string, any>[] = []
  let numSelectedRows = 0
  let showOverlay = false

  const onSortChange = (ev: SortChangeEvent) => {
    console.log(ev)
  }

  const onSelectionChange = (ev: SelectionChangeEvent) => {
    numSelectedRows = ev.detail.selection.size

    actionBarRef.value!.actions = convertActions()
  }

  const onPageChange = (ev: PageChangeEvent) => {
    pageIndex = ev.detail.pageIndex
    fetchItems()
  }

  const onPageSizeChange = (ev: PageSizeChangeEvent) => {
    pageSize = ev.detail.pageSize
    pageIndex = 0
    fetchItems()
  }

  useAfterMount(() => {
    fetchItems()
  })

  function fetchItems() {
    if (!self.fetchItems) {
      return
    }

    showOverlay = true
    overlayRef.value!.classList.remove('hide')

    self
      .fetchItems({
        count: pageSize,
        locale: 'de',
        offset: pageIndex * pageSize,
        sortField: 'lastName',
        sortDir: 'asc'
      })
      .then(({ items, totalItemCount }) => {
        Object.assign(paginationBarRef.value!, {
          pageIndex,
          pageSize,
          totalItemCount
        })

        dataTableRef.value!.items = items

        showOverlay = false
        overlayRef.value!.classList.add('hide')
      })
  }

  function convertActions(): ActionBar.Actions {
    if (!self.actions) {
      return []
    }

    return self.actions.map((it) => {
      if (it.kind === 'action') {
        return {
          kind: 'action',
          actionId: '',
          text: it.text,
          disabled:
            (it.type === 'single-row' && numSelectedRows !== 1) ||
            (it.type === 'multi-row' && numSelectedRows === 0)
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
              (it.type === 'single-row' && numSelectedRows !== 1) ||
              (it.type === 'multi-row' && numSelectedRows === 0)
          }))
        }
      }
    })
  }

  function render() {
    return html`
      <div class="base ${classMap({ 'full-size': self.fullSize })}">
        <div class="header">
          <h3 class="title">${self.title}</h3>
          <div class="actions">${renderActionBar()}</div>
          <div class="search">
            <sl-input size="small" placeholder="Search...">
              <sl-icon
                src=${searchIcon}
                slot="prefix"
                class="search-icon"
              ></sl-icon>
            </sl-input>
            <sl-button type="primary" size="small" class="filter-button">
              <sl-icon src=${filterIcon} slot="prefix"></sl-icon>
              Filter...
            </sl-button>
          </div>
        </div>
        <slot name="filters"></slot>
        <c-data-table
          class="table"
          .columns=${self.columns}
          .selectionMode=${self.selectionMode}
          .data=${items}
          .bordered=${false}
          .sortField=${self.sortField}
          .sortDir=${self.sortDir}
          .onSortChange=${onSortChange}
          .onSelectionChange=${onSelectionChange}
          ${ref(dataTableRef)}
        >
        </c-data-table>
        <div class="footer">
          <c-pagination-bar
            .pageIndex=${pageIndex}
            .pageSize=${pageSize}
            .totalItemCount=${totalItemCount}
            .onPageChange=${onPageChange}
            .onPageSizeChange=${onPageSizeChange}
            ${ref(paginationBarRef)}
          ></c-pagination-bar>
        </div>
        <div
          class="overlay ${classMap({ hide: !showOverlay })}"
          ${ref(overlayRef)}
        >
          <div class="overlay-top"></div>
          <div class="overlay-center">
            <div class="loading-message">
              Loading data.<br />
              Please wait ...
            </div>
            <sl-spinner class="loading-spinner"></sl-spinner>
          </div>
          <div class="overlay-bottom"></div>
        </div>
      </div>
    `
  }

  function renderActionBar() {
    if (!self.actions) {
      return null
    }

    return html`
      <c-action-bar .actions=${convertActions()} ${ref(actionBarRef)}>
      </c-action-bar>
    `
  }

  return render
}
