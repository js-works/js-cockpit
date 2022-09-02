import { css } from 'lit';
import componentStyles from '../../styles/component.styles';

export default css`
  ${componentStyles}

  .base {
    display: flex;
    gap: 2px;
    font-family: var(--sl-font-sans);
    user-select: none;
  }

  sl-button:not(:hover)::part(base) {
    xxxborder-color: transparent;
  }

  sl-button::part(base) {
    font-size: var(--sl-font-size-medium);
  }

  sl-button::part(base) {
    border-color: var(--sl-color-neutral-400);
  }

  sl-button:hover::part(base) {
    color: var(--sl-color-primary-900);
    background-color: var(--sl-color-primary-200);
    border-color: var(--sl-color-primary-700);
  }

  sl-icon {
    color: var(--sl-color-primary-500);
    width: 16px;
    height: 16px;
  }
`;
