import {
  bind,
  elem,
  prop,
  afterInit,
  afterUpdate,
  Attrs,
  Component
} from '../../utils/components'

import { html } from '../../utils/lit'

// components
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'

// icons
import infoIcon from '../../icons/info-circle.svg'
import successIcon from '../../icons/check-circle.svg' // TODO
import warningIcon from '../../icons/exclamation-circle.svg'
import dangerIcon from '../../icons/exclamation-diamond.svg'

// styles
import messageBarStyles from './message-bar.css'

// === exports =======================================================

export { MessageBar }

// === constants =====================================================

const appearanceByVariant = new Map([
  ['info', { className: 'variant-info', icon: infoIcon }],
  ['success', { className: 'variant-success', icon: successIcon }],
  ['warning', { className: 'variant-warning', icon: warningIcon }],
  ['danger', { className: 'variant-danger', icon: dangerIcon }]
])

// === MessageBar ====================================================

/**
 * slots: default
 */
@elem({
  tag: 'c-message-bar',
  styles: messageBarStyles,
  uses: [SlIcon]
})
class MessageBar extends Component {
  @prop({ attr: Attrs.string })
  variant: 'info' | 'success' | 'warning' | 'danger' = 'info'

  render() {
    const appearance = appearanceByVariant.get(this.variant)

    if (!appearance) {
      return null
    }

    const { icon, className } = appearance

    return html`
      <div class="base ${className}">
        <div class="column1">
          <sl-icon class="icon" src=${icon}></sl-icon>
        </div>
        <div class="column2">
          <slot></slot>
        </div>
      </div>
    `
  }
}
