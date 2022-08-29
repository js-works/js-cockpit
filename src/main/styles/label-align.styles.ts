import { css } from 'lit';

export default css`
  .label-align-horizontal {
    --label-align-vertical: var(--off);
    --label-align-horizontal: var(--on);
  }

  .label-align-vertical {
    --label-align-vertical: var(--on);
    --label-align-horizontal: var(--off);
  }
`;
