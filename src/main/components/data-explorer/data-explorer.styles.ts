import { css } from 'lit';
import componentStyles from '../../styles/component.styles';

export default css`
  :host {
    display: flex;
    flex-grow: 1;
  }

  .base {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 2px 6px;
    margin: 2px;
    color: var(--sl-color-neutral-1000);
    background-color: var(--sl-color-neutral-0);
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    user-select: none;
    box-sizing: border-box;
  }

  .base.full-size {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .header {
    display: flex;
    gap: 1.25rem;
    margin: 0 0 6px 0;
    padding: 12px 0 4px 0;
    xxxborder: 0 solid var(--sl-color-neutral-300);
    xxxborder-width: 0 0 1px 0;
    color: var(--sl-color-neutral-1000);
  }

  .headline {
    margin: 0 1.5rem 0 0.75rem;
    padding: 0.125rem 0.25rem;
    font-family: var(--sl-font-sans);
    font-size: 1.6rem;
    font-weight: 400; //var(--sl-font-weight-light);
    color: var(--sl-color-neutral-800);
  }

  .actions {
    flex-grow: 1;
    margin-top: 0.25rem;
  }

  .search {
    display: flex;
    flex-direction: row;
    gap: 4px;
    align-items: center;
    justify-content: center;
  }

  .search-icon {
    color: var(--sl-color-neutral-800);
  }

  .filter-button::part(label) {
    font-size: var(--sl-font-size-medium);
  }

  .table {
    flex-grow: 1;
    margin-top: 0.1rem;
  }

  .footer {
    border: 0 solid var(--sl-color-neutral-300);
    border-width: 1px 0 0 0;
    padding: 3px 0 0px 0;
  }

  .overlay {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    left: 0;
    height: 0;
    width: 100%;
    height: 100%;
    z-index: 30000;
    background-color: rgba(0 0 0 / 10%);
  }

  .overlay-top {
    flex-grow: 3;
  }

  .overlay-center {
    display: flex;
    align-items: center;
    gap: 1.5rem;

    background-color: var(--sl-light, var(--sl-color-neutral-800))
      var(--sl-dark, var(--sl-color-neutral-300));

    padding: 1.4rem 2.3rem;
    border-radius: 4px;
    opacity: 0.9;
  }

  .overlay-bottom {
    flex-grow: 4;
  }

  .loading-message {
    color: var(--sl-light, var(--sl-color-neutral-0))
      var(--sl-dark, var(--sl-color-neutral-1000));

    font-size: var(--sl-font-size-medium);
  }

  .loading-spinner {
    font-size: 1.8rem;
    --indicator-color: var(--sl-light, var(--sl-color-neutral-100))
      var(--sl-dark, var(--sl-color-neutral-900));
  }

  .overlay-show {
    display: flex;
  }

  .overlay-hide {
    display: none;
  }
`;
