import { elem, prop, Attrs, Component } from '../../utils/components';
import { html, classMap } from '../../utils/lit';

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';

// icons
import defaultLogoSvg from './assets/default-logo.svg';

// styles
import brandStyles from './brand.styles';

// === exports =======================================================

export { Brand };

// === Brand ===================================================

@elem({
  tag: 'cp-brand',
  styles: brandStyles,
  uses: [SlIcon]
})
class Brand extends Component {
  @prop(Attrs.string)
  logo: String | null = null;

  @prop(Attrs.string)
  headline = '';

  @prop(Attrs.string)
  text = '';

  @prop(Attrs.string)
  size: 'small' | 'medium' | 'large' | 'huge' = 'medium';

  @prop(Attrs.boolean)
  flat = false;

  @prop(Attrs.boolean)
  bicolor = false;

  render() {
    const logo = this.logo === 'default' ? defaultLogoSvg : this.logo || null;
    const size = this.size || 'medium';

    return html`
      <div class="base ${classMap({
        [size]: true,
        'bicolor': this.bicolor,
        'no-logo': !logo,
        'flat': this.flat
      })}">
          ${!logo ? null : html`<sl-icon src=${logo} class="logo"></sl-icon>`}
          <div class="headline">${this.headline}</div>
          <div class="text">${this.text}</div>
        </div>
      </div>
    `;
  }
}
