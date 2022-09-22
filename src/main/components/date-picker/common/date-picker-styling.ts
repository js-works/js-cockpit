export type DatePickerTokens = {
  fontFamily: string;
  fontSize: string;
  color: string;
  backgroundColor: string;
  navColor: string;
  navBackgroundColor: string;
  navHoverBackgroundColor: string;
  navActiveBackgroundColor: string;
  navElevatedColor: string;
  navElevatedBackgroundColor: string;
  navElevatedHoverBackgroundColor: string;
  navElevatedActiveBackgroundColor: string;
  cellHoverBackgroundColor: string;
  cellDisabledColor: string;
  cellHighlightedBackgroundColor: string;
  cellAdjacentColor: string;
  cellAdjacentDisabledColor: string;
  cellAdjacentSelectedColor: string;
  cellCurrentHighlightedBackgroundColor: string;
  cellSelectedColor: string;
  cellSelectedBackgroundColor: string;
  cellSelectedHoverBackgroundColor: string;
  sliderThumbBackgroundColor: string;
  sliderThumbBorderColor: string;
  sliderThumbBorderWidth: string;
  sliderThumbBorderRadius: string;
  sliderThumbHoverBackgroundColor: string;
  sliderThumbHoverBorderColor: string;
  sliderThumbFocusBackgroundColor: string;
  sliderThumbFocusBorderColor: string;
  sliderTrackColor: string;
};

export function createDatePickerStyles(tokens: DatePickerTokens) {
  return /*css*/ ` 
  :host {
    display: inline-block;
    color: ${tokens.color};
    background-color: ${tokens.backgroundColor}; 
    font-family: ${tokens.fontFamily};
    font-size: ${tokens.fontSize}
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

  .cal-nav {
    display: flex;
    color: ${tokens.navColor};
    background-color: ${tokens.navBackgroundColor};
  }
  
  .cal-nav--elevated {
    color: ${tokens.navElevatedColor};
    background-color: ${tokens.navElevatedBackgroundColor};
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
    background-color: ${tokens.navHoverBackgroundColor};
  }

  .cal-title:not(.cal-title--disabled):active,
  .cal-prev:not(.cal-prev--disabled):active,
  .cal-next:not(.cal-next--disabled):active {
    background-color: ${tokens.navActiveBackgroundColor};
  }
  
  .cal-nav--elevated .cal-title:not(.cal-title--disabled):hover,
  .cal-nav--elevated .cal-prev:not(.cal-prev--disabled):hover,
  .cal-nav--elevated .cal-next:not(.cal-next--disabled):hover {
    background-color: ${tokens.navElevatedHoverBackgroundColor};
  }

  .cal-nav--elevated .cal-title:not(.cal-title--disabled):active,
  .cal-nav--elevated .cal-prev:not(.cal-prev--disabled):active,
  .cal-nav--elevated .cal-next:not(.cal-next--disabled):active {
    background-color: ${tokens.navElevatedActiveBackgroundColor};
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
    color: ${tokens.cellDisabledColor};
  }
  
  .cal-cell--highlighted {
    background-color: ${tokens.cellHighlightedBackgroundColor};
  }
  
  .cal-cell--adjacent:not(.cal-cell--disabled):not(:hover) {
    color: ${tokens.cellAdjacentColor}
  }
  
  .cal-cell--adjacent.cal-cell--disabled {
    color: ${tokens.cellAdjacentDisabledColor};
  }
  
  .cal-cell--adjacent.cal-cell--selected:not(:hover) {
    color: ${tokens.cellAdjacentSelectedColor};
  }
  
  .cal-cell--current-highlighted {
    background-color: ${tokens.cellCurrentHighlightedBackgroundColor};
  }
  
  .cal-cell:hover:not(.cal-cell--disabled) {
    background-color: ${tokens.cellHoverBackgroundColor}
  }
  
  .cal-cell--selected {
    color: ${tokens.cellSelectedColor};
    background-color: ${tokens.cellSelectedBackgroundColor};
  }

  .cal-cell--selected:hover {
    background-color: ${tokens.cellSelectedHoverBackgroundColor} !important;
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
    column-gap: 0.75rem;
    padding: 0.125rem 0 0.75rem 0;
    margin: 0 1rem;
  }

  .cal-base--type-time .cal-time-selector {
    padding: 1.125rem 0.25rem calc(1rem + 5px) 0;
  }

  .cal-time {
    grid-column: 1;
    grid-row: 1 / span 2;
    align-self: center;
    font-size: 125%;
    font-family: 'Century Gothic', CenturyGothic, AppleGothic, ${tokens.fontFamily};
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
    height: 0.75px; 
    padding: 0.5em 0;
    background-image: linear-gradient(${tokens.sliderTrackColor}, ${tokens.sliderTrackColor});
    background-position: 0 50%;
    background-size: 100% 1px;
    background-repeat: no-repeat;
    box-sizing: border-box;
    cursor: pointer;
    background-color: ${tokens.backgroundColor};
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    border: 2px solid red;
    height: 1.25em;
    width: 1.25em;
    border-radius: ${tokens.sliderThumbBorderRadius};
    background-color: ${tokens.sliderThumbBackgroundColor};
    border: ${tokens.sliderThumbBorderWidth} solid ${tokens.sliderThumbBorderColor};
  }
  
  input[type="range"]::-moz-range-thumb {
    -webkit-appearance: none;
    appearance: none;
    border: 2px solid red;
    height: 1.25em;
    width: 1.25em;
    border-radius: ${tokens.sliderThumbBorderRadius};
    background-color: ${tokens.sliderThumbBackgroundColor};
    border: ${tokens.sliderThumbBorderWidth} solid ${tokens.sliderThumbBorderColor};
  }

  input[type="range"]::-webkit-slider-thumb:hover {
    background-color: ${tokens.sliderThumbHoverBackgroundColor};
    border-color: ${tokens.sliderThumbHoverBorderColor};
  }
  
  input[type="range"]::-moz-range-thumb:hover {
    background-color: ${tokens.sliderThumbHoverBackgroundColor};
    border-color: ${tokens.sliderThumbHoverBorderColor};
  }
  
  input[type="range"]:focus::-webkit-slider-thumb {
    background-color: ${tokens.sliderThumbFocusBackgroundColor};
    border-color: ${tokens.sliderThumbFocusBorderColor};
  }
  
  input[type="range"]:focus::-moz-range-thumb {
    background-color: ${tokens.sliderThumbFocusBackgroundColor};
    border-color: ${tokens.sliderThumbFocusBorderColor};
  }

  input[type="range"]::-webkit-slider-runnable-track,
  input[type="range"]::-moz-range-track {
    -webkit-appearance: none;
    box-shadow: none;
    border: none;
    background: transparent;
  }
`;
}
