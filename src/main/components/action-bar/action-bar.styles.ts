import { css } from 'lit';
import componentStyles from '../../styles/component.styles';

export default css`
  ${componentStyles}

  .base {
    display: flex;
    gap: 0.8px;
    font-family: var(--sl-font-sans);
    user-select: none;
  }

  sl-button::part(base) {
    font-size: var(--sl-font-size-small);
  }

  .button:first-child::part(base),
  sl-dropdown:first-child sl-button::part(base) {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  .button:last-child::part(base),
  sl-dropdown:last-child sl-button::part(base) {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  sl-icon {
    color: var(--sl-color-primary-500);
    width: 16px;
    height: 16px;
  }
`;
