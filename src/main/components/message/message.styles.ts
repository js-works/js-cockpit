import { css } from 'lit';
import componentStyles from '../../styles/component.styles';

export default css`
  ${componentStyles}

  .base {
    font-size: var(--sl-font-size-medium);
    text-align: left;
  }

  .columns {
    display: flex;
    align-items: stretch;
    border-width: 1px;
    border-style: solid;
    border-radius: var(--sl-border-radius-medium);
    margin: 0.5rem 0 0.5rem 0;
  }

  .base.variant-info .columns {
    color: var(--sl-color-primary-950);
    background-color: var(--sl-color-primary-200);
  }

  .base.variant-info,
  .base.variant-info .column1 {
    border-color: var(--sl-color-primary-500);
  }

  .base.variant-success .columns {
    color: var(--sl-color-success-950);
    background-color: var(--sl-color-success-200);
  }

  .base.variant-success .columns,
  .base.variant-success .column1 {
    border-color: var(--sl-color-success-400);
  }

  .base.variant-warning .columns {
    color: var(--sl-color-warning-950);
    background-color: var(--sl-color-warning-200);
  }

  .base.variant-warning .columns,
  .base.variant-warning .column1 {
    border-color: var(--sl-color-warning-400);
  }

  .base.variant-danger .columns {
    color: var(--sl-color-danger-950);
    background-color: var(--sl-color-danger-100);
  }

  .base.variant-danger .columns,
  .base.variant-danger .column1 {
    border-color: var(--sl-color-danger-200);
  }

  .column1 {
    display: flex;
    flex-grow: 0;
    border-width: 0 1px 0 0;
    border-style: solid;
    padding: 0.4rem 0.75rem;
    align-items: center;
  }

  .column2 {
    flex-grow: 1;
    padding: 0.5rem 0.75rem;
  }

  .icon {
    font-size: 150%;
  }

  .base.transparent {
    background-color: transparent;
    border: none;
    color: inherit;
    padding-left: auto;
    padding-right: auto;
  }

  .base.transparent .column1 {
    border: 0 dotted;
    border-width: 0 1px 0 0;
  }
`;
