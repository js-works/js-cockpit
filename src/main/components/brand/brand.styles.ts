import { css, unsafeCSS } from 'lit';
import componentStyles from '../../styles/component.styles';

const factorTextSmall = 1;
const factorTextMedium = 1.25;
const factorTextLarge = 1.75;
const factorTextHuge = 2;

const f = (n: number) => Math.round((n / 1.5) * 100);

const sizeTextSmall = unsafeCSS(`${factorTextSmall * 100}%`);
const sizeTextMedium = unsafeCSS(`${factorTextMedium * 100}%`);
const sizeTextLarge = unsafeCSS(`${factorTextLarge * 100}%`);
const sizeTextHuge = unsafeCSS(`${factorTextHuge * 100}%`);

const sizeHeadlineSmall = unsafeCSS(`${f(factorTextSmall)}%`);
const sizeHeadlineMedium = unsafeCSS(`${f(factorTextMedium)}%`);
const sizeHeadlineLarge = unsafeCSS(`${f(factorTextLarge)}%`);
const sizeHeadlineHuge = unsafeCSS(`${f(factorTextHuge)}%`);

const factorLogo = unsafeCSS('1.125 * var(--sl-font-size-medium)');

const sizeLogoSmall = unsafeCSS(`calc(${factorTextSmall} * ${factorLogo})`);
const sizeLogoMedium = unsafeCSS(`calc(${factorTextMedium} * ${factorLogo})`);
const sizeLogoLarge = unsafeCSS(`calc(${factorTextLarge} * ${factorLogo})`);
const sizeLogoHuge = unsafeCSS(`calc(${factorTextHuge} * ${factorLogo})`);

export default css`
  ${componentStyles}

  .base {
    margin: 1px 2px;
    font-size: var(--sl-font-size-medium);
    display: inline-grid;
    grid-template-areas:
      'logo headline'
      'logo text';
    justify-items: start;
    align-items: center;
    gap: 1px;
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
    width: ${sizeLogoMedium};
    height: ${sizeLogoMedium};
    margin-right: 0.25em;
    grid-area: logo;
  }

  .bicolor .logo {
    color: var(--sl-light, var(--sl-color-primary-600))
      var(--sl-dark, var(--sl-color-primary-400));
  }

  .small .logo {
    width: ${sizeLogoSmall};
    height: ${sizeLogoSmall};
  }

  .large .logo {
    width: ${sizeLogoLarge};
    height: ${sizeLogoLarge};
  }

  .huge .logo {
    width: ${sizeLogoHuge};
    height: ${sizeLogoHuge};
  }

  .headline {
    line-height: 1;
    font-size: ${sizeHeadlineMedium};
    white-space: nowrap;
    grid-area: headline;
  }

  .small .headline {
    font-size: ${sizeHeadlineSmall};
  }

  .large .headline {
    font-size: ${sizeHeadlineLarge};
  }

  .huge .headline {
    font-size: ${sizeHeadlineHuge};
  }

  .text {
    padding: 0;
    font-size: ${sizeTextMedium};
    line-height: 1;
    white-space: nowrap;
    grid-area: text;
  }

  .small .text {
    font-size: ${sizeTextSmall};
  }

  .large .text {
    font-size: ${sizeTextLarge};
  }

  .huge .text {
    font-size: ${sizeTextHuge};
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

  .base.flat.bicolor .headline {
    color: var(--sl-color-neutral-1000);
  }

  .base.flat.bicolor.no-logo .headline {
    color: var(--sl-light, var(--sl-color-primary-600))
      var(--sl-dark, var(--sl-color-primary-400));
  }

  .base.flat.small .headline,
  .base.flat.small .text {
    font-size: ${sizeTextSmall};
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
