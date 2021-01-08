import { h, defineElement } from '../../utils/dom'

// @ts-ignore
import paginationBarStyles from './pagination-bar.css'

export const PaginationBar = createPaginationBarClass({
  name: 'sx-pagination-bar'
})

// === types =========================================================

type PaginationBarConfig = {
  name: `${string}-${string}`
}


// === createPaginationBarClass ==========================================

function createPaginationBarClass(
  config: PaginationBarConfig
): CustomElementConstructor {
  class PaginationBar extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })

      const shadowRoot = this.shadowRoot!

      this.connectedCallback = () => {
        const styleElem = h('style', null, paginationBarStyles)
        shadowRoot.appendChild(styleElem)
        refresh()
      }

      const refresh = () => {
        shadowRoot.innerHTML = 'Juhu'
      }
    }

    connectedCallback() {
      this.connectedCallback()
    }
  }
  return PaginationBar
}