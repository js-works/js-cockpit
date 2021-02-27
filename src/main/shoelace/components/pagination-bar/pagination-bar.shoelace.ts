// external imports
import { attr, component, html, VNode } from 'js-elements'
import { useStyles } from 'js-elements/hooks'

import {
  SlInput,
  SlMenuItem,
  SlSelect,
  SlDropdown
  // @ts-ignore
} from '@shoelace-style/shoelace'

// internal imports
import { PaginationBarCore } from '../../../core/pagination-bar/pagination-bar.core'
import { useLocalizer } from '../../../hooks/hooks'
import { register } from '../../../utils/elements'

// @ts-ignore
import paginationBarCustomStyles from './pagination-bar.shoelace.css'
import defaultTheme from '../../themes/default-theme'

// === exports =======================================================

export { PaginationBar }

// === PaginationBar =================================================

class PaginationBarProps {
  @attr(Number)
  pageIndex = -1

  @attr(Number)
  pageSize = -1

  @attr(Number)
  totalItemCount = -1

  @attr(Boolean)
  disabled = false
}

const PaginationBar = component(
  'jsc-pagination-bar',
  PaginationBarProps,
  initPaginationBar
)

function initPaginationBar(p: PaginationBarProps) {
  useStyles(
    defaultTheme,
    PaginationBarCore.coreStyles,
    paginationBarCustomStyles
  )

  const core = new PaginationBarCore({
    localizer: useLocalizer(),
    refresh: () => {},
    handlePageIndexChangeRequest: () => {},
    handlePageSizeChageRequest: () => {},

    renderTextField: () => {
      return html`<sl-input type="text" size="small">123</sl-input>`
    },

    renderSelectField: ({ options }) => {
      const items: VNode[] = []

      for (const option of options.values()) {
        items.push(html`<sl-menu-item value=${option}>${option}</sl-menu-item>`)
      }

      return html`<sl-select size="small">${items}</sl-select>`
    }
  })

  function syncProps() {
    core.setProps({
      pageIndex: p.pageIndex,
      pageSize: p.pageSize,
      totalItemCount: p.totalItemCount,
      disabled: p.disabled
    })
  }

  return () => {
    syncProps()

    return core.render()
  }
}

register('sl-input', SlInput)
register('sl-select', SlSelect)
register('sl-menu-item', SlMenuItem)
register('sl-dropdown', SlDropdown)
