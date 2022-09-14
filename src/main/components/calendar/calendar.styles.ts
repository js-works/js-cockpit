import { css } from 'lit';
import componentStyles from '../../styles/component.styles';

export default css`
  ${componentStyles}

  :host {
    --cal-font: 15px Helvetica, Arial, sans-serif;
    --cal-min-height: none;
    --cal-min-width: none;
    --cal-border-color: #e0e0e0;
    --cal-border-width: 1px;
    --cal-border-radius: 3px;
    --cal-header-color: #444;
    --cal-header-background-color: #fff;
    --cal-header-hover-background-color: #ddd;
    --cal-header-active-background-color: #ccc;
    --cal-header-border-color: #eee;
    --cal-header-border-width: 0 0 1px 0;
    --cal-sheet-min-width: 20em;
    --cal-sheet-min-height: 16em;
    --cal-sheet-padding: 4px;
    --cal-cell-hover-background-color: #ddd;
    --cal-cell-active-background-color: #ccc;
    --cal-cell-other-month-color: #ccc;
    --cal-button-margin: 0;
    --cal-button-padding: 0.5em;
    --cal-button-border-color: #ccc;
    --cal-button-background-color: white;
    --cal-button-focus-background-color: #d8d8d8;
    --cal-button-hover-background-color: #e8e8e8;
    --cal-button-active-background-color: #dadada;

    display: inline-block;
  }

  .cal-base {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: var(--cal-min-width);
    min-height: var(--cal-min-height);
    font: var(--cal-font);
    border-style: solid;
    border-color: var(--cal-border-color);
    border-width: var(--cal-border-width);
    border-radius: var(--cal-border-radius);
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
    color: var(--cal-header-color);
    background-color: var(--cal-header-background-color);
    border-style: solid;
    border-color: var(--cal-header-border-color);
    border-width: var(--cal-header-border-width);
    border-radius: var(--cal-border-radius) var(--cal-border-radius) 0 0;
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
    padding: 0.125rem 0.25rem;
    margin: 0.125rem 0.125rem;
  }

  .cal-title {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .cal-title:not(.cal--disabled),
  .cal-prev:not(.cal--disabled),
  .cal-next:not(.cal--disabled) {
    cursor: pointer;
  }

  .cal-title:not(.cal--disabled):hover,
  .cal-prev:not(.cal--disabled):hover,
  .cal-next:not(.cal--disabled):hover {
    background-color: var(--cal-header-hover-background-color);
  }

  .cal-title:not(.cal--disabled):active,
  .cal-prev:not(.cal--disabled):active,
  .cal-next:not(.cal--disabled):active {
    background-color: var(--cal-header-active-background-color);
    background-color: red;
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
    min-width: var(--cal-sheet-min-width);
    min-height: var(--cal-sheet-min-height);
    padding: var(--cal-sheet-padding);
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
    position: relative;
    cursor: pointer;
    padding: 0.5em;
  }

  .cal-cell:hover {
    background-color: var(--cal-cell-hover-background-color);
  }

  .cal-cell--other-month:not(:hover) {
    color: var(--cal-cell-other-month-color);
  }

  .cal-cell--other-month:hover {
    color: var(--cal-cell-color);
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
    padding: 0.5rem;
  }

  .cal-footer {
    display: flex;
  }

  .cal-button {
    flex-grow: 1;
    outline: none;
    padding: var(--cal-button-padding);
    margin: var(--cal-button-margin);
    background-color: var(--cal-button-background-color);
    border-style: solid;
    border-color: var(--cal-button-border-color);
    border-width: 1px 1px 0 0;
    cursor: pointer;
  }

  .cal-button:first-child {
    border-bottom-left-radius: var(--cal-border-radius);
  }

  .cal-button:last-child {
    border-bottom-right-radius: var(--cal-border-radius);
    border-right-width: 0;
  }

  .cal-button:focus {
    background-color: var(--cal-button-focus-background-color);
  }

  .cal-button:hover {
    background-color: var(--cal-button-hover-background-color);
  }

  .cal-button:active {
    background-color: var(--cal-button-active-background-color);
  }
`;
