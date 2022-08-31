import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
import labelAlignStyles from '../../styles/label-align.styles';

export default css`
  ${componentStyles}
  ${labelAlignStyles}

  .base {
    display: flex;
    gap: 2px;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    white-space: nowrap;
  }

  sl-button.filter-button::part(prefix) {
    font-size: var(--sl-font-size-large);
  }

  sl-button.filter-button::part(label) {
    font-size: 110%;
  }

  .popup {
    background-color: var(--sl-color-neutral-0);
    border: 2px solid var(--sl-color-primary-600);
    border-radius: 4px;
  }

  .filters-header {
    padding: 0.2rem 0.6rem 0.3rem 1rem;
    color: var(--sl-color-neutral-0);
    background-color: var(--sl-color-primary-600);
  }

  .filters {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 1rem 1rem;
  }

  .filters-actions {
    display: flex;
    gap: 8px;
    justify-content: right;
    padding: 4px 10px 5px 10px;
    background-color: var(--sl-color-neutral-50);
    border: 0 solid var(--sl-color-neutral-300);
    border-width: 1px 0 0 0;
  }

  sl-button.button::part(label) {
    font-size: 120%;
  }

  .search-icon {
    color: var(--sl-color-primary-600);
  }
`;
