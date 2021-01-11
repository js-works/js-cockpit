// external imports
import { attr, define, html, VNode } from 'js-elements'
import { useStyles } from 'js-elements/hooks'

import {
  SlInput,
  SlMenuItem,
  SlSelect,
  SlDropdown,
} from '@shoelace-style/shoelace'

// internal imports
import { PaginationBarCore } from '../../../core/pagination-bar/pagination-bar.core'
import { Localizer } from '../../../utils/i18n'
import { registerElement } from '../../../utils/dom'

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

const PaginationBar = define('sx-pagination-bar', PaginationBarProps, (p) => {
  useStyles([
    defaultTheme,
    PaginationBarCore.coreStyles,
    paginationBarCustomStyles,
  ])

  const core = new PaginationBarCore({
    localizer: Localizer.default,
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
    },
  })

  function syncProps() {
    core.setProps({
      pageIndex: p.pageIndex,
      pageSize: p.pageSize,
      totalItemCount: p.totalItemCount,
      disabled: p.disabled,
    })
  }

  return () => {
    syncProps()

    return core.render()
  }
})

registerElement('sl-input', SlInput)
registerElement('sl-select', SlSelect)
registerElement('sl-menu-item', SlMenuItem)
registerElement('sl-dropdown', SlDropdown)
