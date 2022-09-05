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
    background-color: var(--sl-color-neutral-0);

    border-bottom: var(--sl-light, none)
      var(--sl-dark, 1px dotted var(--sl-color-primary-500));

    box-shadow: var(--sl-light, #e8e8e8 0px 4px 16px) var(--sl-dark, none);
    padding: 0.75rem 1rem;
  }

  .main {
    display: flex;
    padding: 3.5rem;
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
    min-width: 35rem;
  }

  .intro {
    margin: 0 3rem;
  }

  .intro-headline {
    color: var(--sl-color-primary-500);
    font-family: var(--sl-font-serif);
    font-size: 250%;
    font-weight: 400;
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
    width: 100%;
    min-height: 75%;
    box-sizing: border-box;
  }

  .form-fields {
    flex-grow: 1;
  }

  .form-footer {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 2rem;
  }

  .remember-login-checkbox {
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
