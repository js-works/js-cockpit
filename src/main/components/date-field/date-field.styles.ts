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
    background-color: var(--sl-color-primary-500);
  }

  .date-picker {
    box-shadow: var(--sl-shadow-large);
    border: 1px solid var(--sl-color-primary-500);
    border-radius: 0 0 4px 4px;
  }
`;
