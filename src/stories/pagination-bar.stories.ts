import { h, registerElement } from '../main/utils/dom'
import '../main/shoelace/components/pagination-bar/pagination-bar.shoelace'

export default {
  title: 'pagianation-bar',
}

export const example_1 = () =>
  h('sx-pagination-bar', {
    pageIndex: 13,
    pageSize: 100,
    totalItemCount: 13542,
  })
