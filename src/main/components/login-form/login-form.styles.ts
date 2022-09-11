import { css } from 'lit';
import componentStyles from '../../styles/component.styles';

export default css`
  ${componentStyles}

  :host {
  }

  .base {
    display: flex;
    flex-direction: column;
    background-color: var(--sl-color-neutral-0);
  }

  .base.full-size {
    position: absolute;
    top: 0;
    left: 0;
    min-width: 100%;
    min-height: 100%;
    max-width: 100%;
    overflow: hidden;
  }

  .header {
    display: flex;
    position: relative;
    z-index: 1;
    background-color: var(--sl-color-neutral-0);
    border-bottom: 1px solid var(--sl-color-neutral-100);
    box-shadow: var(--sl-shadow-x-large);
    padding: 0.675rem 1.5rem;
  }

  .header-main {
    flex-grow: 1;
  }

  .header-end {
    justify-self: flex-end;
  }

  .footer {
    display: flex;
    color: var(--sl-color-neutral-800);
    background-color: var(--sl-color-neutral-50);
    padding: 0.6rem 1.5rem;
    border-top: 1px solid var(--sl-color-neutral-200);
    font-size: var(--sl-font-size-small);
  }

  .footer-main {
    flex-grow: 1;
  }

  .footer-end {
    justify-self: flex-end;
  }

  .main {
    flex-grow: 1;
    align-self: center;
  }

  .form {
    position: relative;
    display: flex;
    flex-direction: column;
    margin: 2rem;
  }

  @media (min-width: 600px) {
    .form {
      margin: 3em 0 2rem 0;
      width: 34em;
      xxxheight: 34em;
      --label-align-vertical: var(--off);
      --label-align-horizontal: var(--on);
      --label-align-horizontal-width: 10rem;
    }
  }

  .form-fields-start {
    margin: 0 0 1.5rem 0;
    text-align: center;
  }

  .form-fields-headline {
    font-size: var(--sl-font-size-x-large);
    font-weight: var(--sl-font-weight-normal);
    margin: 0 0 0.75rem 0;
  }

  .form-fields-text:not(:empty) {
    font-size: var(--sl-font-size-normal);
    font-weight: var(--sl-font-weight-normal);
    margin: 0 0 1.5rem 0;
  }

  .form-fields {
    flex-grow: 1;
    min-height: 12rem;
  }

  .form-footer {
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
  }

  .remember-login-checkbox {
    margin: 0.5rem 0 0.75rem 0.5rem;
  }

  .submit-button {
    width: 100%;
  }

  .submit-button-spinner {
    margin-left: 0.5rem;
    flex-grow: 0;
    font-size: 1.125rem;
    --indicator-color: var(--sl-color-neutral-0);
    --track-width: 2px;
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

  .overlay {
    position: absolute;
    background-color: transparent;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 32000;
    cursor: wait;
  }
`;
