import { css } from 'lit';
import componentStyles from '../../styles/component.styles';

export default css`
  ${componentStyles}

  .base {
    display: inline-grid;
    grid-template-areas:
      'logo headline'
      'logo text';
    justify-items: start;
    align-items: center;
    gap: 2px;
  }

  base.no-logo {
    grid-template-areas:
      'headline'
      'text';
  }

  .base.flat {
    grid-template-areas: 'logo headline text';
  }

  .base.no-logo.flat {
    grid-template-areas: 'headline text';
  }

  .base.flat {
    gap: 0.5em;
  }

  .logo {
    width: 26px;
    height: 26px;
    margin-right: 8px;
    grid-area: logo;
  }

  .multi-color .logo {
    color: var(--sl-light, var(--sl-color-primary-600))
      var(--sl-dark, var(--sl-color-primary-400));
  }

  .small .logo {
    width: 22px;
    height: 22px;
  }

  .large .logo {
    width: 30px;
    height: 30px;
  }

  .huge .logo {
    width: 36px;
    height: 36px;
  }

  .headline {
    font-size: 14px;
    line-height: 100%;
    white-space: nowrap;
    grid-area: headline;
  }

  .small .headline {
    font-size: 12px;
  }

  .large .headline {
    font-size: 16px;
  }

  .huge .headline {
    font-size: 20px;
  }

  .text {
    font-size: 17px;
    line-height: 100%;
    white-space: nowrap;
    grid-area: text;
  }

  .small .text {
    font-size: 16px;
  }

  .large .text {
    font-size: 24px;
  }

  .huge .text {
    font-size: 28px;
  }

  .base.flat {
    grid-template-areas: 'logo headline text';
  }

  .base.flat .logo {
    margin: 0;
  }

  .base.flat .headline {
    font-weight: var(--sl-font-weight-semibold);
  }

  .base.flat.multi-color .headline {
    color: var(--sl-color-neutral-1000);
  }

  .base.flat.multi-color.no-logo .headline {
    color: var(--sl-light, var(--sl-color-primary-600))
      var(--sl-dark, var(--sl-color-primary-400));
  }

  .base.flat.small .headline,
  .base.flat.small .text {
    font-size: 16px;
  }

  .base.flat.medium .headline,
  .base.flat.medium .text {
    font-size: 18px;
  }

  .base.flat.large .headline,
  .base.flat.large .text {
    font-size: 24px;
  }

  .base.flat.huge .headline,
  .base.flat.huge .text {
    font-size: 28px;
  }
`;
