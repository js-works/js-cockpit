import { css, unsafeCSS as $ } from 'lit';
import scrollbarStyles from '../../styles/scrollbar.styles';

export default css`
  .base {
    display: grid;
    grid-template-rows: auto auto 1fr auto;
    grid-template-columns: auto 1fr auto;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    font-family: var(--sl-font-sans);
    user-select: none;
    background-color: var(--sl-color-neutral-0);
  }

  .row1 {
    grid-column: 1/-1;
    display: flex;
    align-items: center;
    gap: 18px;
    z-index: 100;

    color: var(--sl-light, var(--sl-color-neutral-0))
      var(--sl-dark, var(--sl-color-neutral-1000));

    background-color: var(--sl-light, var(--sl-color-neutral-700))
      var(--sl-dark, var(--sl-color-neutral-200));

    max-height: 46px;
  }

  .header {
    flex-grow: 1;
  }

  .subheader {
    flex-grow: 1;
  }

  .row2 {
    grid-column: 1/-1;
    z-index: 100;
    display: flex;
    align-items: center;
  }

  .col1 {
    display: flex;
    flex-direction: column;
    color: var(--sl-color-neutral-1000);
  }

  .col1::part(base) {
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .sidebar {
    display: flex;
    flex-grow: 1;
  }

  .col2 {
    display: flex;
    flex-direction: column;
  }

  .main {
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    position: relative;
    flex-grow: 1;
  }

  .main-slot {
    position: relative;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    position: relative;
    flex-grow: 1;
  }

  .scroll-pane {
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  ::slotted(cp-brand) {
    position: relative;
    margin: 0 11px;
  }

  ::slotted(cp-nav-menu) {
    position: relative;
    left: 20px;
    right: 20px;
  }
`;
