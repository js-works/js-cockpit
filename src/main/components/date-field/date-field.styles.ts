import { css } from 'lit';
import componentStyles from '../../shared/css/components.styles';
import controlStyles from '../../shared/css/control.styles';

export default css`
  ${componentStyles}
  ${controlStyles}

  .popup::part(arrow) {
    background-color: var(--sl-color-primary-600);
  }
`;
