import { css } from 'lit';

export default css`
  .control::part(form-control) {
    display: flex;

    flex-direction: var(--label-align-vertical, column)
      var(--label-align-horizontal, row);

    align-items: var(--label-align-vertical, stretch)
      var(--label-align-horizontal, center);

    gap: var(--label-align-horizontal, var(--label-align-horizontal-gap))
      var(--label-align-vertical, 0);
  }

  .control::part(form-control-label) {
    flex: 0 0 auto;

    width: var(--label-align-vertical, auto)
      var(--label-align-horizontal, var(--label-align-horizontal-width));

    text-align: var(--label-align-vertical, left)
      var(--label-align-horizontal, right);

    margin: var(--label-align-vertical, 2px 0 1px 0)
      var(--label-align-horizontal, 2px 0);
  }

  .control::part(form-control-input) {
    flex: 1 1 auto;

    margin: var(--label-align-vertical, 0 0 0.4rem 0)
      var(--label-align-horizontal, 2px 0);
  }
`;
