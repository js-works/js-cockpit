import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
import labelAlignStyles from '../../styles/label-align.styles';

export default css`
  ${componentStyles}
  ${labelAlignStyles}

.base {
    padding: 2px 6px;
    margin: 2px;
    color: var(--sl-color-neutral-1000);
    background-color: var(--sl-color-neutral-0);
  }

  .header {
    display: flex;
    gap: 1.25rem;
    align-items: center;
    justify-content: center;
    padding: 12px 0 6px 0;
    margin: 0 0 6px 0;
    border: 0 solid var(--sl-color-neutral-300);
    border-width: 0 0 1px 0;
  }

  .headline {
    margin: 0 0.75rem;
    padding: 0.125rem 0.75rem;
    font-size: var(--sl-font-size-x-large);
  }

  .actions {
    flex-grow: 1;
  }

  .close-button:not(:hover)::part(base) {
    border: none;
  }

  .close-icon {
    width: 20px;
    height: 20px;
  }

  .content {
    xbackground-color: var(--sl-color-neutral-50);
    xbackground-color: rgba(0 0 0 / 2%);
  }
`;
