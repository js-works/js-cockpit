import { css } from 'lit';

export default css`
  :host {
    font-family: var(--sl-font-sans);
  }

  .cal-base {
    background-color: var(--sl-color-neutral-0);
  }

  .cal-header {
    color: var(--sl-color-neutral-0);
    background-color: var(--sl-color-primary-500);
  }

  .cal-title:not(.cal-title--disabled):hover,
  .cal-prev:not(.cal-prev--disabled):hover,
  .cal-next:not(.cal-next--disabled):hover {
    background-color: var(--sl-color-primary-600);
  }

  .cal-title:not(.cal-title---disabled):active,
  .cal-prev:not(.cal-prev--disabled):active,
  .cal-next:not(.cal-next--disabled):active {
    opacity: 75%;
  }

  .cal-cell--disabled {
    color: var(--sl-color-neutral-300);
  }

  .cal-cell--highlighted {
    background-color: var(--sl-color-neutral-50);
  }

  .cal-cell--adjacent:not(.cal-cell--disabled):not(:hover) {
    color: var(--sl-color-neutral-400);
  }

  .cal-cell--adjacent.cal-cell--disabled {
    color: var(--sl-color-neutral-200);
  }

  .cal-cell--adjacent.cal-cell--selected:not(:hover) {
    color: var(--sl-color-neutral-800);
  }

  .cal-cell--current.cal-cell--current-highlighted {
    background-color: var(--sl-color-orange-100);
  }

  .cal-cell:hover:not(.cal-cell--disabled) {
    background-color: var(--sl-color-primary-100);
  }

  .cal-cell--selected {
    background-color: var(--sl-color-primary-400);
  }

  .cal-cell--selected:hover {
    background-color: var(--sl-color-primary-500) !important;
  }

  .cal-time {
    font-size: 125%;

    font-family: 'Century Gothic', CenturyGothic, AppleGothic,
      var(--sl-font-sans);
  }

  .cal-hour-slider,
  .cal-minute-slider {
    --track-height: 2px;
    --thumb-size: 14px;
    --track-color-active: var(--sl-color-primary-500);
    --track-color-inactive: var(--sl-color-neutral-200);
    margin: 0 1em 0 0;
  }
`;
