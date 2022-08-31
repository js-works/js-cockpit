import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
import controlStyles from '../../styles/control.styles';

export default css`
  ${componentStyles}
  ${controlStyles}

  .popup::part(popup) {
    z-index: 32000;
  }

  .popup::part(arrow) {
    background-color: var(--sl-color-neutral-500);
  }
`;
