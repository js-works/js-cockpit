import { Brand } from 'js-cockpit';
import { elem, Component } from '../main/utils/components';
import { html } from '../main/utils/lit';
import { h } from '../main/utils/dom';
import './shared/shared-theme';

export default {
  title: 'brand'
};

const brandDemoStyles = `
  .brand-demo {
    display: flex;
    gap: 40px;
  }
`;

@elem({
  tag: 'brand-demo',
  uses: [Brand],
  styles: [brandDemoStyles]
})
class BrandDemo extends Component {
  render() {
    return html`
      <div class="brand-demo">
        <div>
          <cp-brand
            headline="Size: small"
            text="Back Office"
            size="small"
            logo="default"
          ></cp-brand>
          <br />
          <br />
          <cp-brand
            headline="Size: medium"
            text="Back Office"
            size="medium"
            logo="default"
          ></cp-brand>
          <br />
          <br />
          <cp-brand
            headline="Size: large"
            text="Back Office"
            size="large"
            logo="default"
          ></cp-brand>
          <br />
          <br />
          <cp-brand
            headline="Size: huge"
            text="Back Office"
            size="huge"
            logo="default"
          ></cp-brand>
        </div>

        <div>
          <cp-brand
            headline="Size: small"
            text="Back Office"
            size="small"
            logo="default"
            bicolor
          ></cp-brand>
          <br />
          <br />
          <cp-brand
            headline="Size: medium"
            text="Back Office"
            size="medium"
            logo="default"
            bicolor
          ></cp-brand>
          <br />
          <br />
          <cp-brand
            headline="Size: large"
            text="Back Office"
            size="large"
            logo="default"
            bicolor
          ></cp-brand>
          <br />
          <br />
          <cp-brand
            headline="Size: huge"
            text="Back Office"
            size="huge"
            logo="default"
            bicolor
          ></cp-brand>
        </div>
      </div>
    `;
  }
}

export const brand = () => h('brand-demo');
