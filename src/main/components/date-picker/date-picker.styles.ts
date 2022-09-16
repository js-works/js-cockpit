import { css } from 'lit';
import componentStyles from '../../styles/component.styles';

export default css`
  ${componentStyles}

  :host {
    display: inline-block;
  }

  .cal-base {
    position: relative;
    display: flex;
    flex-direction: column;
    user-select: none;
  }

  .cal-input {
    position: absolute;
    width: 0;
    height: 0;
    outline: none;
    border: none;
    overflow: hidden;
    opacity: 0;
    z-index: -1;
  }

  .cal-header {
    display: flex;
    color: var(--sl-color-neutral-0);
    background-color: var(--sl-color-primary-500);
  }

  .cal-title-container {
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
  }

  .cal-title,
  .cal-prev,
  .cal-next {
    padding: 5px 0.4rem;
  }

  .cal-title {
    padding-left: 0.75em;
    padding-right: 0.75em;
  }

  .cal-title:not(.cal-title--disabled),
  .cal-prev:not(.cal-prev--disabled),
  .cal-next:not(.cal-next--disabled) {
    cursor: pointer;
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

  .cal-sheet {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex-grow: 1;
    padding: 0.5em;
    min-width: 15rem;
    min-height: 13rem;
  }

  .cal-sheet--month {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: 1em;
    flex-grow: 1;
  }

  .cal-sheet--month-with-week-numbers {
    grid-template-columns: repeat(8, 1fr);
  }

  .cal-sheet--year {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    flex-grow: 1;
  }

  .cal-sheet--decade {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    flex-grow: 1;
  }

  .cal-weekday {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 85%;
    padding: 0 0 3px 0;
  }

  .cal-week-number {
    font-size: 70%;
    opacity: 75%;
  }

  .cal-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0.25em;
    box-sizing: border-box;
  }

  .cal-cell--disabled {
    color: var(--sl-color-neutral-300);
    cursor: not-allowed;
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

  .cal-cell--current {
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

  .cal-week-number {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cal-time-selector {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    padding: 0.125rem 0 0.75rem 0;
  }

  .cal-base--type-time .cal-time-selector {
    padding: 1.125rem 0.25rem calc(1rem + 5px) 0;
  }

  .cal-time {
    grid-column: 1;
    grid-row: 1 / span 2;
    align-self: center;
    margin: 0 0.5em;
    font-size: 125%;

    font-family: 'Century Gothic', CenturyGothic, AppleGothic,
      var(--sl-font-sans);

    text-align: center;
  }

  .cal-day-period {
    display: inline-block;
    font-size: 60%;
    width: 2em;
    text-align: left;
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
