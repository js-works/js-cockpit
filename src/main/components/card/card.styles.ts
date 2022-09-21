import { css, unsafeCSS } from 'lit';
import componentStyles from '../../styles/component.styles';

export default css`
  ${componentStyles}

  :host {
    color: var(--sl-color-neutral-1000);
  }

  .full-size {
    position: absolute;
    margin: 0;
    padding: 0;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
  }

  .full-size::part(base) {
    height: 100%;
  }
`;
