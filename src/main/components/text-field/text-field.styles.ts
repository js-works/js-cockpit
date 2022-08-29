import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
import controlStyles from '../../styles/control.styles';

export default css`
  ${componentStyles}
  ${controlStyles}

  .base {
  }

  .base.has-error sl-input::part(base) {
    border-color: var(--sl-color-danger-600);
    --sl-focus-ring: 0 0 0 var(--sl-focus-ring-width) var(--sl-color-danger-700);
  }
`;
