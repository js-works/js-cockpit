import { elem, prop, Attrs, Component } from '../../utils/components';
import { html, classMap } from '../../utils/lit';

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';

// icons
import defaultLogoSvg from './assets/default-logo.svg';

// styles
import brandStyles from './brand.css';

// === exports =======================================================

export { Brand };

// === Brand ===================================================

@elem({
  tag: 'cp-brand',
  styles: brandStyles,
  uses: [SlIcon]
})
class Brand extends Component {
  @prop({ attr: Attrs.string })
  logo: String | null = null;

  @prop({ attr: Attrs.string })
  headline = '';

  @prop({ attr: Attrs.string })
  text = '';

  @prop({ attr: Attrs.string })
  size: 'small' | 'medium' | 'large' | 'huge' = 'medium';

  @prop({ attr: Attrs.boolean })
  multiColor = false;

  render() {
    const logo = this.logo === 'default' ? defaultLogoSvg : this.logo || null;
    const size = this.size || 'medium';

    return html`
      <div class="base">
        <div
          class=${classMap({
            'content': true,
            [size]: true,
            'multi-color': this.multiColor
          })}
        >
          ${!logo ? null : html`<sl-icon src=${logo} class="logo"></sl-icon>`}
          <div class="headline-and-text">
            <div class="headline">${this.headline}</div>
            <div class="text">${this.text}</div>
          </div>
        </div>
      </div>
    `;
  }
}
