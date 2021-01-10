import { define, h } from 'js-elements'
import { useEffect, useOnMount } from 'js-elements/hooks'
import { createRef } from 'js-elements/utils'
import { DataTableCore, Column } from '../../../core/data-table/data-table.core'

class DataTableProps {
  columns?: Column[]
  sortField?: number | string | null
  sortDir?: 'asc' | 'desc'
  selectMode?: 'single' | 'multi' | 'none'
  data?: any[][] | object[] | null
}

define('sx-data-table', DataTableProps, (p) => {
  const core = new DataTableCore()
  const containerRef = createRef<Node>()

  useOnMount(() => {
    containerRef.current!.appendChild(core.getElement())
  })

  useEffect(() => core.setProps(p))

  return () =>
    h(
      'div',
      null,
      h('style', null, DataTableCore.coreStyles),
      h('div', { ref: containerRef })
    )
})
