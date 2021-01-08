import { h, defineElement } from '../main/utils/dom'
import { PaginationBar } from '../main/components/pagination-bar/pagination-bar'

defineElement('sx-pagination-bar', PaginationBar)

export default {
  title: 'pagianation-bar',
}

export const example_1 = () => h('sx-pagination-bar')
