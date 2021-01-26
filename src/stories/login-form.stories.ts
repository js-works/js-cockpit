import { h } from '../main/utils/dom'
import '../main/shoelace/components/login-screen/login-screen.shoelace'

export default {
  title: 'login-form',
}

export const example1 = () =>
  h(
    'jsc-login-screen',
    null,
    h('div', { slot: 'header' }, 'top'),
    h('div', { slot: 'footer' }, 'bottom')
  )
