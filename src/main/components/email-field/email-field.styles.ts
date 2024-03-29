import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
import controlStyles from '../../styles/control.styles';

export default css`
  ${componentStyles}
  ${controlStyles}

  .base.invalid sl-input::part(form-control-label) {
    color: var(--sl-color-danger-700);
  }

  .base.invalid sl-input::part(base) {
    border-color: var(--sl-color-danger-700);
    --sl-input-focus-ring-color: var(--sl-color-danger-300);
  }

  .icon {
    color: var(--sl-input-icon-color);
  }
`;
