import { component, elem, prop, Attrs } from 'js-element'
import { classMap, createRef, html, lit, ref } from 'js-element/lit'
import { useAfterMount, useOnInit, useRefresher } from 'js-element/hooks'
import { ActionBar } from '../action-bar/action-bar'
import { DataTable } from '../data-table/data-table'
import { PaginationBar } from '../pagination-bar/pagination-bar'
import { useI18n } from '../../utils/hooks'
import { Dialogs } from '../../misc/dialogs'
import { I18n } from '../../misc/i18n'

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

// === DataExplorer ==================================================

I18n.addTranslations('en', {
  'js-cockpit.data-explorer': {
    'loading-message': 'Loading...'
  }
})

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
}

function dataExplorerImpl(self: DataExplorer) {
  const { i18n, t } = useI18n('js-cockpit.data-explorer')
  const actionBarRef = createRef<ActionBar>()
  const dataTableRef = createRef<DataTable>()
  const paginationBarRef = createRef<PaginationBar>()
  const overlayRef = createRef<HTMLElement>()

  let pageIndex = 0
  let pageSize = 50
  let totalItemCount = -1
  let sortField: string | number | null = null
  let sortDir: 'asc' | 'desc' = 'asc'
  let items: Record<string, any>[] = []
  let numSelectedRows = 0
  let showOverlay = false
  let timeoutId: any = null

  const onSortChange = (ev: SortChangeEvent) => {
    sortField = ev.detail.sortField
    sortDir = ev.detail.sortDir

    fetchItems({ pageIndex: 0, sortField, sortDir })
  }

  const onSelectionChange = (ev: SelectionChangeEvent) => {
    numSelectedRows = ev.detail.selection.size

    actionBarRef.value!.actions = convertActions()
  }

  const onPageChange = (ev: PageChangeEvent) => {
    pageIndex = ev.detail.pageIndex
    fetchItems({ pageIndex })
  }

  const onPageSizeChange = (ev: PageSizeChangeEvent) => {
    fetchItems({ pageIndex: 0, pageSize: ev.detail.pageSize })
  }

  useOnInit(() => {
    sortField = self.initialSortField
    sortDir = self.initialSortDir
  })

  useAfterMount(() => {
    fetchItems({
      pageIndex,
      pageSize,
      sortField,
      sortDir
    })
  })

  function fetchItems(
    params: Partial<{
      pageIndex: number
      pageSize: number
      sortField: string | number | null
      sortDir: 'asc' | 'desc'
    }>
  ) {
    const par = Object.assign(
      {
        pageIndex,
        pageSize,
        sortField,
        sortDir
      },
      params
    )

    if (!self.fetchItems) {
      return
    }

    timeoutId = setTimeout(() => {
      showOverlay = true
      overlayRef.value!.classList.replace('overlay-hide', 'overlay-show')
    }, 200)

    self
      .fetchItems({
        count: par.pageSize,
        locale: i18n.getLocale(),
        offset: par.pageIndex * par.pageSize,
        sortField: par.sortField,
        sortDir: par.sortDir
      })
      .then((result) => {
        pageIndex = par.pageIndex
        pageSize = par.pageSize
        totalItemCount = result.totalItemCount
        sortField = par.sortField
        sortDir = par.sortDir
        items = result.items

        Object.assign(paginationBarRef.value!, {
          pageIndex,
          pageSize,
          totalItemCount
        })

        dataTableRef.value!.sortField = sortField
        dataTableRef.value!.sortDir = sortDir
        dataTableRef.value!.items = items

        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }

        showOverlay = false
        overlayRef.value!.classList.replace('overlay-show', 'overlay-hide')
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
            <slot name="search"></slot>
          </div>
        </div>
        <c-data-table
          class="table"
          .columns=${self.columns}
          .selectionMode=${self.selectionMode}
          .data=${items}
          .bordered=${false}
          .sortField=${self.initialSortField}
          .sortDir=${self.initialSortDir}
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
          class="overlay ${classMap({
            'overlay-show': showOverlay,
            'overlay-hide': !showOverlay
          })}"
          ${ref(overlayRef)}
        >
          <div class="overlay-top"></div>
          <div class="overlay-center">
            <div class="loading-message">${t('loading-message')}</div>
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
