// external imports
import { html, TemplateResult } from 'lit-html'

import {
  SlInput,
  SlMenuItem,
  SlSelect,
  SlDropdown,
} from '@shoelace-style/shoelace'

// internal imports
import { property, unsafeCSS, LitElement } from 'lit-element'
import { PaginationBarCore } from '../../../core/pagination-bar/pagination-bar.core'
import { Localizer } from '../../../utils/i18n'
import { registerElement } from '../../../utils/dom'

// @ts-ignore
import paginationBarCustomStyles from './pagination-bar.shoelace.css'
import defaultTheme from '../../themes/default-theme'

export class PaginationBar extends LitElement {
  private core: PaginationBarCore

  static styles = [
    unsafeCSS(defaultTheme),
    unsafeCSS(PaginationBarCore.coreStyles),
    unsafeCSS(paginationBarCustomStyles),
  ]

  @property()
  pageIndex = -1

  @property()
  pageSize = -1

  @property()
  totalItemCount = -1

  @property()
  disabled = false

  constructor() {
    super()

    this.core = new PaginationBarCore({
      localizer: Localizer.default,
      refresh: () => this.requestUpdate(),
      handlePageIndexChangeRequest: () => {},
      handlePageSizeChageRequest: () => {},

      renderTextField: () => {
        return html`<sl-input type="text" size="small">123</sl-input>`
      },

      renderSelectField: ({ options }) => {
        const items: TemplateResult[] = []

        for (const option of options.values()) {
          items.push(
            html`<sl-menu-item value=${option}>${option}</sl-menu-item>`
          )
        }

        return html`<sl-select size="small">${items}</sl-select>`
      },
    })

    this.syncProps()
  }

  private syncProps() {
    this.core.setProps({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      totalItemCount: this.totalItemCount,
      disabled: this.disabled,
    })
  }

  render() {
    this.syncProps()

    return this.core.render()
  }
}

registerElement('sl-input', SlInput)
registerElement('sl-select', SlSelect)
registerElement('sl-menu-item', SlMenuItem)
registerElement('sl-dropdown', SlDropdown)
registerElement('sx-pagination-bar', PaginationBar)
