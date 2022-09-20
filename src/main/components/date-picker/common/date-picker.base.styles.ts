const fontFamily = 'var(--sl-font-sans)';
const color = 'var(--sl-color-neutral-1000)';
const backgroundColor = 'var(--sl-color-neutral-0)';

const headerColor = 'var(--sl-color-neutral-0)';
const headerBackgroundColor = 'var(--sl-color-primary-500)';
const headerButtonBackgroundColorHover = 'var(--sl-color-primary-600)';
const headerButtonBackgroundColorActive = 'var(--sl-color-primary-700)';

const cellHover = 'var(--sl-color-primary-100)';
const cellDisabledColor = 'var(--sl-color-neutral-300)';
const cellHighlightedBackgroundColor = 'var(-sl-color-neutral-50)';
const cellAdjacentColor = 'var(--sl-color-neutral-400)';
const cellAdjacentDisabledColor = 'var(--sl-color-neutral-200)';
const cellAdjacentSelected = 'var(--sl-color-neutral-800)';
const cellCurrentHighlightedBackgroundColor = 'var(--sl-color-orange-200)';
const cellSelectedBackgroundColor = 'var(--sl-color-primary-600)';
const cellSelectedHoverBackgroundColor = 'var(--sl-color-primary-500)';

const sliderThumbBackgroundColor = 'var(--sl-color-neutral-0)';
const sliderThumbBorderColor = 'var(--sl-color-neutral-400)';
const sliderThumbBorderWidth = '1px';
const sliderThumbBorderRadius = '4px';
const sliderThumbBackgroundColorHover = sliderThumbBackgroundColor;
const sliderThumbBorderColorHover = 'var(--sl-color-neutral-1000)';
const sliderThumbBackgroundColorFocus = 'var(--sl-color-primary-600)';
const sliderThumbBorderColorFocus = 'var(--sl-color-primary-600)';
const sliderTrackColor = 'var(--sl-color-neutral-400)';

export default /*css*/ ` 
  :host {
    display: inline-block;
    color: ${color};
    background-color: ${backgroundColor}; 
    font-family: ${fontFamily};
  }

  .cal-base {
    position: relative;
    display: flex;
    flex-direction: column;
    user-select: none;
    min-width: 20rem;
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
    color: ${headerColor};
    background-color: ${headerBackgroundColor};
  }

  .cal-title,
  .cal-prev,
  .cal-next {
    padding: 5px 0.75rem;
  }

  .cal-title {
    padding-left: 0.75em;
    padding-right: 0.75em;
    text-align: center;
    flex-grow: 1;
  }

  .cal-title:not(.cal-title--disabled),
  .cal-prev:not(.cal-prev--disabled),
  .cal-next:not(.cal-next--disabled) {
    cursor: pointer;
  }
  
  .cal-title:not(.cal-title--disabled):hover,
  .cal-prev:not(.cal-prev--disabled):hover,
  .cal-next:not(.cal-next--disabled):hover {
    cursor: pointer;
    background-color: ${headerButtonBackgroundColorHover};
  }

  .cal-title:not(.cal-title---disabled):active,
  .cal-prev:not(.cal-prev--disabled):active,
  .cal-next:not(.cal-next--disabled):active {
    background-color: ${headerButtonBackgroundColorActive};
  }
  
  .cal-sheet {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex-grow: 1;
    padding: 0.5em;
    min-height: 13rem;
  }

  .cal-sheet--month {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: 1.25em;
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
    text-transform: capitalize;
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
    padding: 0.25em 0.75em;
    box-sizing: border-box;
    text-transform: capitalize;
  }

  .cal-cell--disabled {
    cursor: not-allowed;
    color: ${cellDisabledColor};
  }
  
  .cal-cell--highlighted {
    background-color: ${cellHighlightedBackgroundColor};
  }
  
  .cal-cell--adjacent:not(.cal-cell--disabled):not(:hover) {
    color: ${cellAdjacentColor}
  }
  
  .cal-cell--adjacent.cal-cell--disabled {
    color: ${cellAdjacentDisabledColor};
  }
  
  .cal-cell--adjacent.cal-cell--selected:not(:hover) {
    color: ${cellAdjacentSelected};
  }
  
  .cal-cell--current-highlighted {
    background-color: ${cellCurrentHighlightedBackgroundColor};
  }
  
  .cal-cell:hover:not(.cal-cell--disabled) {
    background-color: ${cellHover}
  }
  
  .cal-cell--selected {
    background-color: ${cellSelectedBackgroundColor};
  }

  .cal-cell--selected:hover {
    background-color: ${cellSelectedHoverBackgroundColor} !important;
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
    font-family: 'Century Gothic', CenturyGothic, AppleGothic, ${fontFamily};
    text-align: center;
  }

  .cal-day-period {
    display: inline-block;
    font-size: 60%;
    width: 2em;
    text-align: left;
  }


  /* time sliders */

  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    margin: 0.5em 0;
    width: 100%;
    height: 0.75px; 
    padding: 0.5em 0;
    background-image: linear-gradient(${sliderTrackColor}, ${sliderTrackColor});
    background-position: 0 50%;
    background-size: 100% 1px;
    background-repeat: no-repeat;
    box-sizing: border-box;
    cursor: pointer;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    border: 2px solid red;
    height: 1.25em;
    width: 1.25em;
    border-radius: ${sliderThumbBorderRadius};
    background-color: ${sliderThumbBackgroundColor};
    border: ${sliderThumbBorderWidth} solid ${sliderThumbBorderColor};
  }
  
  input[type="range"]::-moz-range-thumb {
    -webkit-appearance: none;
    appearance: none;
    border: 2px solid red;
    height: 1.25em;
    width: 1.25em;
    border-radius: ${sliderThumbBorderRadius};
    background-color: ${sliderThumbBackgroundColor};
    border: ${sliderThumbBorderWidth} solid ${sliderThumbBorderColor};
  }

  input[type="range"]::-webkit-slider-thumb:hover {
    background-color: ${sliderThumbBackgroundColorHover};
    border-color: ${sliderThumbBorderColorHover};
  }
  
  input[type="range"]::-moz-range-thumb:hover {
    background-color: ${sliderThumbBackgroundColorHover};
    border-color: ${sliderThumbBorderColorHover};
  }
  
  input[type="range"]:focus::-webkit-slider-thumb {
    background-color: ${sliderThumbBackgroundColorFocus};
    border-color: ${sliderThumbBorderColorFocus};
  }
  
  input[type="range"]:focus::-moz-range-thumb {
    background-color: ${sliderThumbBackgroundColorFocus};
    border-color: ${sliderThumbBorderColorFocus};
  }

  input[type="range"]::-webkit-slider-runnable-track,
  input[type="range"]::-moz-range-track {
    -webkit-appearance: none;
    box-shadow: none;
    border: none;
    background: transparent;
  }
`;
