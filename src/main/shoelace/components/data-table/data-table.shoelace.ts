// external imports
import { createRef, define, html } from 'js-element'
import { useEffect, useOnMount, useStyles } from 'js-element/hooks'

// @ts-ignore
import { SlCheckbox } from '@shoelace-style/shoelace'

// internal imports
import { DataTableCore, Column } from '../../../core/data-table/data-table.core'
import { h } from '../../../utils/dom'
import { register } from '../../../utils/elements'

// @ts-ignore
import dataTableCustomStyles from './data-table.shoelace.css'
import defaultTheme from '../../themes/default-theme'

class DataTableProps {
  columns?: Column[]
  sortField?: number | string | null
  sortDir?: 'asc' | 'desc'
  selectMode?: 'single' | 'multi' | 'none'
  data?: any[][] | object[] | null
}

export const DataTable = define('jsc-data-table', DataTableProps, (p) => {
  const core = new DataTableCore({
    onToggleSelectAll: () => {},
    onToggleSelectRow: () => {},

    icons: {
      sortedAsc: createSortedAscIcon(),
      sortedDesc: createSortedDescIcon(),
      sortable: createSortableIcon()
    },

    renderCheckbox: (checked: boolean, onToggle: () => void) => {
      const checkbox = h('sl-checkbox')
      checkbox.addEventListener('sl-change', () => onToggle())
      return checkbox
    }
  })

  const containerRef = createRef<Node>()

  useStyles(DataTableCore.coreStyles, defaultTheme, dataTableCustomStyles)

  useOnMount(() => {
    containerRef.current!.appendChild(core.getElement())
  })

  useEffect(() => core.setProps(p))

  return () => html`<div ref=${containerRef}></div>`
})

function createSortedAscIcon() {
  const ret = h('div')

  ret.innerHTML = `
    <svg width="20px" height="20px" viewBox="0 0 64 64">
      <g fill="none" stroke="currentColor" stroke-width="2" stroke-miterlimit="10">
        <polyline stroke-linejoin="bevel" points="20,40 32,56 44,40 "/>
        <polyline stroke-miterlimit="10" points="32,16 32,56"/>
      </g>
    </svg>
  `

  return ret
}

function createSortedDescIcon() {
  const ret = h('div')

  ret.innerHTML = `
    <svg width="20px" height="20px" viewBox="0 0 64 64">
      <g fill="none" stroke="currentColor" stroke-width="2" stroke-miterlimit="10">
        <polyline stroke-linejoin="bevel" points="20,32 32,16 44,32 "/>
        <polyline stroke-miterlimit="10" points="32,16 32,56"/>
      </g>
    </svg>  
  `

  return ret
}

function createSortableIcon() {
  const ret = h('div', { style: 'opacity: 0.2' })

  ret.innerHTML = `
    <svg width="20px" height="20px" viewBox="0 0 64 64">
      <g fill="none" stroke="currentColor" stroke-width="2" stroke-miterlimit="10">
        <polyline stroke-linejoin="bevel" points="7,32 19,16 32,32 "/>
        <polyline stroke-miterlimit="10" points="19,16 19,56"/>      
        <polyline stroke-linejoin="bevel" points="33,40 45,56 57,40 "/>
        <polyline stroke-miterlimit="10" points="45,16 45,56"/>
      </g>
    </svg>  
  `

  return ret
}

register('sl-checkbox', SlCheckbox)
