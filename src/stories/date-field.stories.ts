import { h, defineElement } from '../main/utils/dom'
import { DateField } from '../main/components/date-field/date-field'

defineElement('sx-date-field', DateField)

export default {
  title: 'date-field',
}

export const example_1 = () => h('sx-date-field')
