import { css } from 'lit';

export default css`
  .base {
    position: absolute;
    width: 0;
    max-width: 0;
    height: 0;
    max-height: 0;
    left: -10000px;
    top: -10000px;
    overflow: hidden;
  }

  .dialog {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    color: var(--sl-light, var(--sl-color-neutral-1000))
      var(--sl-dark, var(--sl-color-neutral-1000));

    padding: 0;

    --header-spacing: 0;
    --body-spacing: 0;
    --footer-spacing: 0;
  }

  .dialog::part(title) {
    padding-bottom: 0.5rem;
    user-select: none;
  }

  .dialog::part(body) {
    padding-top: 0.5rem;
    padding-bottom: 0.25rem;
    user-select: none;
  }

  .dialog::part(footer) {
    user-select: none;
  }

  .dialog::part(title),
  .dialog::part(body) {
    padding: 0;
  }

  .buttons {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    padding: 0.625rem 1rem;
    background-color: var(--sl-color-neutral-100);
  }

  .button::part(base) {
    font-weight: var(--sl-label-font-weight);
  }

  .icon {
    font-size: var(--sl-font-size-x-large);
  }

  .icon.normal {
    color: var(--sl-color-primary-500);
  }

  .icon.warning {
    color: var(--sl-color-warning-500);
  }

  .icon.danger {
    color: var(--sl-color-danger-500);
  }

  .header {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    font-size: calc(1.25 * var(--sl-font-size-medium));
    border-bottom: 1px solid var(--sl-color-neutral-200);
    padding: 0.625rem 1rem;
  }

  .message {
    font-family: var(--sl-font-sans);
    font-size: calc(1.05 * var(--sl-font-size-medium));
    margin: 1.25rem 2rem;
  }

  .content {
    margin: 1.25rem 2rem;
  }
`;
