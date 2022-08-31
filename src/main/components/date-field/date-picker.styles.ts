import { css } from 'lit';

export default css`
  .air-datepicker {
    --adp-font-family: var(--sl-font-sans);
    --adp-font-size: var(--sl-font-size-medium);
    --adp-width: 18rem;
    --adp-z-index: 30000;
    --adp-padding: 0;
    --adp-grid-areas: 'nav' 'body' 'timepicker' 'buttons';
    --adp-transition-duration: 0.3s;
    --adp-transition-ease: ease-out;
    --adp-transition-offset: 8px;
    --adp-background-color: #fff;
    --adp-background-color-hover: var(--sl-color-neutral-200);
    --adp-background-color-active: #eaeaea;
    --adp-background-color-in-range: rgba(92, 196, 239, 0.1);
    --adp-background-color-in-range-focused: rgba(92, 196, 239, 0.2);
    --adp-background-color-selected-other-month-focused: #8ad5f4;
    --adp-background-color-selected-other-month: #a2ddf6;
    --adp-color: #4a4a4a;
    --adp-color-secondary: #9c9c9c;
    --adp-accent-color: var(--sl-color-neutral-500);
    --adp-color-current-date: var(--adp-accent-color);
    --adp-color-other-month: #dedede;
    --adp-color-disabled: #aeaeae;
    --adp-color-disabled-in-range: #939393;
    --adp-color-other-month-hover: #c5c5c5;
    --adp-border-color: var(--sl-color-neutral-400);
    --adp-border-color-inner: var(--sl-color-neutral-200);
    --adp-border-radius: 0;
    --adp-border-color-inline: var(--sl-color-neutral-300);
    --adp-nav-height: 2rem;
    --adp-nav-arrow-color: var(--adp-color-secondary);
    --adp-nav-action-size: 1.8rem;
    --adp-nav-color-secondary: var(--adp-color-secondary);
    --adp-day-name-color: var(--sl-color-neutral-500);
    --adp-day-name-color-hover: #8ad5f4;
    --adp-day-cell-width: 1fr;
    --adp-day-cell-height: 2em;
    --adp-month-cell-height: 3em;
    --adp-year-cell-height: 4em;
    --adp-pointer-size: 10px;
    --adp-poiner-border-radius: 2px;
    --adp-pointer-offset: 14px;
    --adp-cell-border-radius: 0px;
    --adp-cell-background-color-selected: var(--sl-color-primary-500);
    --adp-cell-background-color-selected-hover: var(--sl-color-primary-400);
    --adp-cell-background-color-in-range: rgba(92, 196, 239, 0.1);
    --adp-cell-background-color-in-range-hover: rgba(92, 196, 239, 0.2);
    --adp-cell-border-color-in-range: var(--adp-cell-background-color-selected);
    --adp-btn-height: calc(var(--sl-font-size-medium) + 12px);
    --adp-btn-color: var(--adp-accent-color);
    --adp-btn-color-hover: var(--adp-color);

    /* custom adp theme token!!! */
    --adp-background-color-highlight: var(--sl-color-neutral-50);
  }

  .air-datepicker-nav {
    position: relative;
    z-index: 1;
    background-color: var(--sl-color-neutral-500);
    border: 0 solid var(--adp-border-color-inner);
    color: white !important;
    border-bottom-width: 1px;
    margin: -1px;
    padding: 0;
  }

  .air-datepicker-cell.-current- {
    color: var(--adp-color);
    font-weight: 600;
  }

  .air-datepicker {
    border: 2px solid var(--sl-color-primary-500);
    border-radius: 4px;
  }

  .air-datepicker.-only-timepicker- {
    position: relative;
    top: -16px;
  }

  .air-datepicker-nav--title {
    padding: 0 0.8rem;
  }

  .air-datepicker-nav--title:hover,
  .air-datepicker-nav--action:hover {
    color: var(--sl-color-neutral-0);
    background-color: var(--sl-color-neutral-700);
  }

  .air-datepicker-nav--title:active,
  .air-datepicker-nav--action:active {
    background-color: var(--sl-color-neutral-800);
  }

  .air-datepicker-button {
    padding: 1.25rem 0;
    border: 0 solid var(--adp-border-color-inner);
    border-left-width: 1px;
  }

  .air-datepicker-button:first-child {
    border: none;
  }

  .air-datepicker-button:hover {
    color: var(--sl-color-primary-700);
    background-color: var(--sl-color-primary-100);
  }

  .air-datepicker-button:active {
    background-color: var(--sl-color-primary-200);
  }
`;
