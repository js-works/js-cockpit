import { css } from 'lit';
import labelAlignStyles from '../../styles/label-align.styles';

export default css`
  ${labelAlignStyles}

  .base {
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    color: var(--sl-color-neutral-1000);
    user-select: none;
  }

  .caption {
    color: var(--sl-color-neutral-1000);
    padding: 0.25rem 0.75rem;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 0.75rem;
  }

  .base.horizontal .content {
    flex-direction: row;
  }
`;
