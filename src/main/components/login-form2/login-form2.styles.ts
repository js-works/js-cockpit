import { css } from 'lit';
import componentStyles from '../../styles/component.styles';

export default css`
  ${componentStyles}

  :host {
  }

  .base {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr;
    justify-content: stretch;
    align-content: stretch;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    min-height: 100%;
  }

  .header {
    grid-column: 1 / span 2;
    background-color: var(--sl-color-neutral-0);
  }

  .header > div {
    box-shadow: var(--sl-shadow-large);
    padding: 0.5rem 2rem;
    margin: 0 0 3px 0;
  }

  .column-a {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    background-color: var(--sl-color-neutral-50);
    padding-top: 2rem;
  }

  .column-b {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    background-color: var(--sl-color-neutral-0);
    padding-top: 2rem;
  }

  .intro {
    margin: 0 2rem;
  }

  .intro-headline {
    color: var(--sl-color-primary-500);
    font-family: var(--sl-font-serif);
    font-size: var(--sl-font-size-3x-large);
    font-weight: 400;
    margin: 1rem 0;
  }

  .intro-text {
    color: var(--sl-color-neutral-1000);
    font-size: var(--sl-font-size-large);
  }

  .form {
    width: 80%;
  }

  .submit-button {
    margin-top: 5rem;
    width: 100%;
  }
`;
