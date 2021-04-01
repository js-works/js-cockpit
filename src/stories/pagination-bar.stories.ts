import { h, registerElement } from '../main/utils/dom'
import '../main/shoelace/components/pagination-bar/pagination-bar.shoelace'

export default {
  title: 'pagination-bar'
}

export const example_1 = () =>
  h('jsc-pagination-bar', {
    pageIndex: 13,
    pageSize: 100,
    totalItemCount: 13542
  })
