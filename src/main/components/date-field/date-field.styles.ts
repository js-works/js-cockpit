import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
import controlStyles from '../../styles/control.styles';

export default css`
  ${componentStyles}
  ${controlStyles}

  .base {
  }

  .input:not(.input--disabled),
  .input:not(.input--disabled)::part(input),
  .input:not(.input-disabled)::part(suffix) {
    cursor: pointer;
  }

  .dropdown {
    xwidth: 100%;
  }

  .popup-content {
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    box-shadow: var(--sl-shadow-large);
    width: 18rem;
    border-radius: 0 0 4px 4px;
    background-color: var(--sl-color-neutral-0);
  }

  .popup-footer {
    display: flex;
    gap: 6px;
    justify-content: flex-end;
    box-sizing: border-box;
    padding: 0.25rem 0.25rem 0.5rem 0.25rem;
  }

  .date-picker::part(header) {
    color: var(--sl-color-neutral-1000);
    background-color: var(--sl-color-neutral-0);
  }

  .date-picker::part(prev-button):hover,
  .date-picker::part(next-button):hover,
  .date-picker::part(title):hover {
    color: var(--sl-color-neutral-1000);
    background-color: var(--sl-color-primary-200);
  }

  .button::part(base) {
    margin: 0;
    height: auto;
    line-height: unset;
  }

  .button::part(label) {
    padding: 0 0.5rem;
  }
`;
