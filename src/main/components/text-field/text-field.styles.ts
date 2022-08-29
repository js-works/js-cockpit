import { css } from 'lit';
import componentStyles from '../../shared/css/components.styles';
import controlStyles from '../../shared/css/control.styles';

export default css`
  ${componentStyles}
  ${controlStyles}

  .base {
    position: relative;
    display: flex;
  }

  .base.has-error sl-input::part(base) {
    border-color: var(--sl-color-danger-600);
    --sl-focus-ring: 0 0 0 var(--sl-focus-ring-width) var(--sl-color-danger-700);
  }
`;
