import { css } from 'lit';
import componentStyles from '../../styles/component.styles';

export default css`
  ${componentStyles}

  :host {
  }

  .base {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    justify-content: auto;
    align-content: stretch;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    min-height: 100%;
  }

  .header {
    background-color: var(--sl-color-neutral-0);
    box-shadow: #e8e8e8 0px 4px 16px;
    padding: 0.75rem 1rem;
  }

  .main-content {
    display: flex;
    padding: 4rem;
    flex-grow: 1;
    justify-content: center;
  }

  .column-a {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    border: 0px solid var(--sl-color-primary-500);
    border-right-width: 1px;
    width: 30rem;
  }

  .column-b {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    background-color: var(--sl-color-neutral-0);
    width: 40rem;
  }

  .intro {
    margin: 0 2rem;
  }

  .intro-headline {
    color: var(--sl-color-primary-500);
    font-family: var(--sl-font-serif);
    font-size: var(--sl-font-size-3x-large);
    font-weight: 400;
    margin: 0 1rem 1rem 0;
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
