import { css } from 'lit';

export default css`
  .sl-control::part(form-control) {
    display: flex;

    flex-direction: var(--label-align-vertical, column)
      var(--label-align-horizontal, row);

    align-items: var(--label-align-vertical, stretch)
      var(--label-align-horizontal, center);

    gap: var(--label-align-horizontal, var(--label-align-horizontal-gap))
      var(--label-align-vertical, 0);
  }

  .sl-control::part(form-control-label) {
    flex: 0 0 auto;

    width: var(--label-align-vertical, auto)
      var(--label-align-horizontal, var(--label-align-horizontal-width));

    text-align: var(--label-align-vertical, left)
      var(--label-align-horizontal, right);

    margin: var(--label-align-vertical, 2px 0 1px 0)
      var(--label-align-horizontal, 2px 0);
  }

  .sl-control::part(form-control-input) {
    flex: 1 1 auto;

    margin: var(--label-align-vertical, 0 0 0.4rem 0)
      var(--label-align-horizontal, 2px 0);
  }

  .sl-control-label {
  }

  .sl-control-label--required::after {
    font-family: var(--sl-font-mono);
    font-size: var(--sl-font-size-medium);
    position: relative;
    top: -2px;
    margin: 0 calc(-1.5ch) 0 0;
    left: calc(-0.5ch + 2px);
    width: 1ex;
    max-width: 1ex;
    overflow: hidden;
    content: '*';
    color: var(--sl-color-danger-700);
    box-sizing: border-box;
  }

  /* -------------------------------------------------------------- */

  .validation-error:not(:empty) {
    font-size: 90%;
    font-weight: var(--sl-font-weight-normal);
    color: var(--sl-color-danger-700);
    padding: 0 0.5rem 0.375rem 0;

    margin: 0 0 0 var(--label-align-vertical, 0)
      var(
        --label-align-horizontal,
        calc(
          var(--label-align-horizontal-width) +
            var(--label-align-horizontal-gap)
        )
      );
  }
`;
