import { component, elem, prop, Attrs } from 'js-element'
import { html, lit } from 'js-element/lit'

// components
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'

// icons
import infoIcon from '../../icons/info-circle.svg'
import successIcon from '../../icons/info-circle.svg' // TODO
import warningIcon from '../../icons/exclamation-circle.svg'
import dangerIcon from '../../icons/exclamation-triangle.svg'

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
  impl: lit(messageBarImpl),
  uses: [SlIcon]
})
class MessageBar extends component() {
  @prop({ attr: Attrs.string })
  variant: 'info' | 'success' | 'warning' | 'danger' = 'info'
}

function messageBarImpl(self: MessageBar) {
  function render() {
    const appearance = appearanceByVariant.get(self.variant)

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

  return render
}
