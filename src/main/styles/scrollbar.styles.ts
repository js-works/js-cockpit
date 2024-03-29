import { css } from 'lit';

export default css`
  /* Works on Firefox */
  :host {
    scrollbar-width: thin;
    scrollbar-color: var(--sl-light, #a4a4a4 #eee) var(--sl-dark, #585858 #333);
  }

  /* Works on Chrome, Edge, and Safari */
  .base::-webkit-scrollbar {
    width: 12px;
  }

  .base::-webkit-scrollbar-track {
    background: orange;
  }

  .base::-webkit-scrollbar-thumb {
    background-color: blue;
    border-radius: 20px;
    border: 3px solid orange;
  }
`;
