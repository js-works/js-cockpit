//import { ColorSchemes, Theme, ThemeMods } from 'js-cockpit';
//import { initI18n } from 'js-localize';

import {
  loadTheme,
  ColorSetups,
  customizeTheme,
  ThemeModifiers
} from 'shoelace-themes';

const theme = customizeTheme(
  ThemeModifiers.builder() //
    .colors(ColorSetups.bostonBlue)
    .compact()
    .modern()
    .build()
);

const styleElem = document.createElement('style');

styleElem.innerText = `
  :root {
    --on: inherit;
    --off: ;
    --theme: light;
    --label-align-vertical: var(--on);
    --label-align-horizontal: var(--off);
    --label-align-horizontal-width: 8rem;
    --label-align-horizontal-gap: 1.25rem;
  }
`;

document.head.append(styleElem);

loadTheme(theme, ':root');

const linkElem = document.createElement('link');
linkElem.setAttribute('rel', 'stylesheet');
linkElem.setAttribute('type', 'text/css');

linkElem.setAttribute(
  'href',
  'https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700'
);

document.head.append(linkElem);

document.documentElement.lang = 'en-AU';
