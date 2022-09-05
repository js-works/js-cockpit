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
    background-color: var(--sl-color-neutral-0);
  }

  .header {
    display: flex;
    position: relative;
    z-index: 1;
    background-color: var(--sl-color-neutral-0);

    border-bottom: var(--sl-light, none)
      var(--sl-dark, 1px dotted var(--sl-color-primary-500));

    box-shadow: var(--sl-light, #e8e8e8 0px 4px 16px) var(--sl-dark, none);
    padding: 0.75rem 1.5rem;
  }

  .header-main {
    flex-grow: 1;
  }

  .header-end {
    justify-self: flex-end;
  }

  .main {
    display: flex;
    flex-grow: 1;
    justify-content: stretch;
    width: 100%;
  }

  .column-a,
  .column-b {
    padding: 3rem 2rem;
  }

  .column-a {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-start;
    background-color: rgb(249, 250, 251); /* var(--sl-color-neutral-50); */
    width: 33%;
  }

  .column-b {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 67%;
  }

  .intro {
    margin: 0 3rem;
    width: 25rem;
  }

  .intro-headline {
    color: var(--sl-color-primary-500);
    font-family: var(--sl-font-sans);
    font-size: 250%;
    font-weight: var(--sl-font-weight-normal);
    margin: 0 1rem 1rem 0;
  }

  .intro-text {
    color: var(--sl-color-neutral-1000);
    font-size: 125%;
  }

  .form {
    display: flex;
    flex-direction: column;
    margin: 0 3rem;
    min-width: 30rem;
    min-height: min(80%, 30rem);
    box-sizing: border-box;
  }

  .form-fields {
    flex-grow: 1;
  }

  .form-footer {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 2rem;
  }

  .remember-login-checkbox {
    margin: 0.5rem 0;
  }

  .submit-button {
    width: 100%;
  }

  .links {
    display: flex;
    gap: 2rem;
    justify-content: center;
  }

  .link {
    font-weight: var(--sl-font-weight-semibold);
    color: var(--sl-color-primary-500);
  }
`;
