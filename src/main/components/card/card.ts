import { elem, prop, Attrs, Component } from '../../utils/components';
import { html, classMap } from '../../utils/lit';

// custom elements
import SlCard from '@shoelace-style/shoelace/dist/components/card/card';

// styles
import cardStyles from './card.styles';

// === exports =======================================================

export { Card };

// === Brand ===================================================

@elem({
  tag: 'cp-card',
  styles: cardStyles,
  uses: [SlCard]
})
class Card extends Component {
  @prop(Attrs.boolean)
  fullSize = false;

  render() {
    return html`
      <sl-card
        class=${classMap({
          'full-size': this.fullSize
        })}
      >
        <div slot="header" class="header">
          <slot name="header"></slot>
        </div>
        <div class="content">
          <slot />
        </div>
      </sl-card>
    `;
  }
}
