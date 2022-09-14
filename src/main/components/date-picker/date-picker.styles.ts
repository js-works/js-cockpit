import { css } from 'lit';
import componentStyles from '../../styles/component.styles';

export default css`
  ${componentStyles}

  :host {
    display: inline-block;
  }

  .base {
    position: relative;
    display: flex;
    flex-direction: column;
    user-select: none;
    box-shadow: var(--sl-shadow-x-large);
  }

  .input {
    position: absolute;
    width: 0;
    height: 0;
    outline: none;
    border: none;
    overflow: hidden;
    opacity: 0;
    z-index: -1;
  }

  .header {
    display: flex;
    color: var(--sl-color-primary-950);
    background-color: var(--sl-color-primary-200);
  }

  .title-container {
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
  }

  .title,
  .prev,
  .next {
    padding: 5px 0.4rem;
  }

  .title {
    padding-left: 0.5em;
    padding-right: 0.5em;
  }

  .title:not(.-disabled),
  .prev:not(.-disabled),
  .next:not(.-disabled) {
    cursor: pointer;
  }

  .title:not(.-disabled):hover,
  .prev:not(.-disabled):hover,
  .next:not(.-disabled):hover {
    background-color: var(--sl-color-primary-300);
  }

  .title:not(.-disabled):active,
  .prev:not(.-disabled):active,
  .next:not(.-disabled):active {
    opacity: 75%;
  }

  .title.-disabled {
    background-color: inherit;
    cursor: default;
  }

  .sheet {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex-grow: 1;
    padding: 0.5em;
  }

  .view-month {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    flex-grow: 1;
  }

  .view-year {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    flex-grow: 1;
  }

  .view-decade {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    flex-grow: 1;
  }

  .weekday {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0.25em;
  }

  .cell:hover {
    background-color: var(--sl-color-neutral-200);
  }

  .cell--other-month:not(:hover) {
    color: var(--sl-color-neutral-700);
  }

  .cell--other-month:hover {
    color: var(--sl-color-neutral-1000);
  }

  .week-number {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .time-selector {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    padding: 0.125rem 0 0.75rem 0;
  }

  .time {
    grid-column: 1;
    grid-row: 1 / span 2;
    align-self: center;
    margin: 0 0 0 0.5em;
    font-size: 125%;

    font-family: 'Century Gothic', CenturyGothic, AppleGothic,
      var(--sl-font-sans);

    width: 5em;
    text-align: center;
  }

  .day-period {
    display: inline-block;
    font-size: 60%;
    width: 3em;
    text-align: left;
  }

  .hour-slider,
  .minute-slider {
    --track-height: 2px;
    --thumb-size: 0.8em;
    --track-color-active: var(--sl-color-primary-500);
    --track-color-inactive: var(--sl-color-neutral-200);
    margin: 0 1em 0 0;
  }
`;
