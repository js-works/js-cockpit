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
    border: 1px solid green;
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
    padding: 0.25rem 0.25rem;
    margin: 2px;
    border-radius: var(--sl-border-radius-small);
  }

  .cal-title {
    padding-left: 0.5em;
    padding-right: 0.5em;
  }

  .cal-title:not(.cal--disabled),
  .cal-prev:not(.cal--disabled),
  .cal-next:not(.cal--disabled) {
    cursor: pointer;
  }

  .cal-title:not(.cal--disabled):hover,
  .cal-prev:not(.cal--disabled):hover,
  .cal-next:not(.cal--disabled):hover {
    background-color: var(--sl-color-primary-400);
  }

  .cal-title:not(.cal--disabled):active,
  .cal-prev:not(.cal--disabled):active,
  .cal-next:not(.cal--disabled):active {
    background-color: var(--sl-color-primary-600);
  }

  .cal-title.cal--disabled {
    background-color: inherit;
    cursor: default;
  }

  .cal-sheet {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex-grow: 1;
    padding: 0.5em;
  }

  .cal-view-month {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    flex-grow: 1;
  }

  .cal-view-year {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    flex-grow: 1;
  }

  .cal-view-decade {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    flex-grow: 1;
  }

  .cal-weekday {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cal-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0.25em;
  }

  .cal-cell:hover {
    background-color: var(--sl-color-primary-300);
  }

  .cal-cell--other-month:not(:hover) {
    color: var(--sl-color-neutral-700);
  }

  .cal-cell--other-month:hover {
    color: var(--sl-color-neutral-1000);
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
    padding: 0.5rem 0;
  }

  .cal-time {
    grid-column: 1;
    grid-row: 1 / span 2;
    align-self: center;
    margin: 0 0.5em 0 0;
    font-size: 125%;
    font-weight: var(--sl-font-weight-light);
    width: 7ex;
    text-align: center;
  }

  .cal-day-period {
    font-size: 60%;
  }

  .cal-hour-slider,
  .cal-minute-slider {
    --track-height: 3px;
    --thumb-size: 1.125em;
    margin: 0 1em 0 0;
  }

  .cal-footer {
    display: flex;
    gap: 10px;
    padding: 0rem 0.25rem;
    background-color: var(--sl-color-neutral-50);
    border-top: 1px solid var(--sl-color-neutral-100);
  }

  .cal-button {
    flex-basis: 0;
    flex-grow: 1;
    margin: 3px;
  }

  .cal-button::part(base) {
    xxxcolor: var(--sl-color-neutral-0);
  }

  .cal-button:last-child::part(base) {
  }
`;
