// external imports
import { component, elem, prop, Attrs } from 'js-element'
import { html, classMap, withLit, TemplateResult } from 'js-element/lit'
import { useState } from 'js-element/hooks'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlInput from '@shoelace-style/shoelace/dist/components/input/input'

// styles
import paginationBarStyles from './pagination-bar.css'

// icons
import chevronDoubleLeftSvg from '../../icons/chevron-double-left.svg'
import chevronLeftSvg from '../../icons/chevron-left.svg'
import chevronRightSvg from '../../icons/chevron-right.svg'
import chevronDoubleRightSvg from '../../icons/chevron-double-right.svg'

console.log(11111, chevronDoubleLeftSvg)

// === exports =======================================================

export { PaginationBar }

// === types =========================================================

// === Paginator =====================================================

@elem({
  tag: 'sx-pagination-bar',
  styles: paginationBarStyles,
  uses: [SlIcon, SlInput],
  impl: withLit(paginationBarImpl)
})
class PaginationBar extends component() {
  @prop({ attr: Attrs.number })
  pageIndex = 0

  @prop({ attr: Attrs.number })
  pageSize = 50

  @prop({ attr: Attrs.number })
  totalItemCount = -1

  @prop({ attr: Attrs.boolean })
  disabled = false
}

function paginationBarImpl(self: PaginationBar) {
  return () => html`
    <div class="base">
      <a>
        <sl-icon src=${chevronDoubleLeftSvg}></sl-icon>
      </a>
      <a>
        <sl-icon src=${chevronLeftSvg}></sl-icon>
      </a>

      Page
      <sl-input size="small" class="page-number-input"></sl-input>
      of 123

      <a>
        <sl-icon src=${chevronRightSvg}></sl-icon>
      </a>
      <a>
        <sl-icon src=${chevronDoubleRightSvg}></sl-icon>
      </a>
    </div>
  `
}
