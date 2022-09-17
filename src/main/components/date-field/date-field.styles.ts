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

  .popup-content {
    box-shadow: var(--sl-shadow-large);
    border: 1px solid var(--sl-color-primary-500);
    border-radius: 0 0 4px 4px;
  }

  .popup-footer {
    display: flex;
    gap: 6px;
    justify-content: center;
    box-sizing: border-box;
    padding: 0.25rem 0.25rem 0.5rem 0.25rem;
    background-color: var(--sl-color-primary-50);
    border-top: 1px solid var(--sl-color-primary-400);
    border-radius: 0 0 4px 4px;
  }

  .button::part(base) {
    margin: 0;
    height: auto;
    line-height: unset;
  }
`;
