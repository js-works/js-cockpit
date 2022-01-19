import {
  bind,
  createEmitter,
  elem,
  prop,
  Attrs,
  Component,
  Listener
} from '../../utils/components'

import { classMap, createRef, html, ref, repeat } from '../../utils/lit'
import { createLocalizer } from '../../utils/i18n'

// styles
import sectionStyles from './section.css'

// === exports =======================================================

export { Section }

// === Section ===================================================

@elem({
  tag: 'c-section',
  styles: sectionStyles
})
class Section extends Component {
  @prop({ attr: Attrs.string })
  caption = ''

  render() {
    return html`
      <div class="base">
        <div class="caption">${this.caption}</div>
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `
  }
}
