import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
import labelAlignStyles from '../../styles/label-align.styles';

export default css`
  :host {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: yellow;
  }

  .header {
    padding: 1rem 2rem;
    background-color: var(--sl-color-neutral-0);
    box-shadow: var(--sl-shadow-large);
  }

  .main {
    display: flex;
    align-items: stretch;
    align-content: stretch;
    border: 1px solid pink;
  }

  .column-a {
    background-color: red;
    flex-grow: 1;
  }

  .column-b {
    background-color: green;
    flex-grow: 1;
  }
`;
