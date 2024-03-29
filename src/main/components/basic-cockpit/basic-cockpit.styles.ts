import { css, unsafeCSS as $ } from 'lit';
import scrollbarStyles from '../../styles/scrollbar.styles';

const sidebarMinWidth = $('15rem');
const sidebarMaxWidth = $('20rem');
const textColor = $('var(--sl-color-neutral-0)');
const secondaryTextColor = $('var(--sl-color-neutral-300)');
const backColor = $('var(--sl-color-neutral-900)'); //$('#161616'); //$('#121212');
//const backColor = $('#282a2f');
const brandFontSize = $('110%');
const brandTextColor = $('var(--sl-color-neutral-0)');
const brandBackColor = $('transparent');
//const brandBackColor = $('var(--sl-color-primary-600)');
const hoverBackColor = $('var(--sl-color-neutral-800)');
const selectionColor = $('white');
const selectionBackColor = $('var(--sl-color-neutral-700)'); //$('var(--sl-color-primary-700)');
const selectionBorderColor = $('var(--sl-color-primary-700)');
const selectionBorderWidth = $('3px');
const selectionBorderRadius = $('0px');
const selectionMargin = $('0');
const activeBackColor = $('var(--sl-color-neutral-600)');

export default css`
  ${scrollbarStyles}

  .base {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    box-sizing: border-box;
  }

  .sidebar {
    position: relative;

    xxxbackground-color: rgb(60 70 78);
    xxxbackground-color: rgb(70, 76, 84);
    xxxbackground-color: rgb(76, 81, 93);

    color: var(--sl-light, ${textColor})
      var(--sl-dark, var(--sl-color-neutral-1000));

    background-color: var(--sl-light, ${backColor}) var(--sl-dark, ${textColor});

    min-width: ${sidebarMinWidth};
    max-width: ${sidebarMaxWidth};
    user-select: none;
    overflow: auto;
  }

  .sidebar-scrollpane {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .content {
    position: relative;
    flex-grow: 1;
    background-color: var(--sl-color-neutral-100);
  }

  .brand {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 0.7rem 0.25rem;
    margin: 0 0 ${String(brandBackColor) === 'transparent' ? 1 : 1.25}rem 0;
    width: 100%;
    box-sizing: border-box;
    color: ${brandTextColor};
    font-size: ${brandFontSize};
    background-color: ${brandBackColor};
  }

  .brand-title {
    font-weight: var(--sl-font-weight-light);
    margin: 0 0.25rem;
  }

  .brand-subtitle {
    font-weight: var(--sl-font-weight-normal);
    margin: 0 0.25rem;
  }

  .default-avatar-icon {
    font-size: 250%;

    color: var(--sl-light, var(--sl-color-primary-500))
      var(--sl-dark, var(--sl-color-primary-700));

    background-color: var(--sl-color-neutral-600);
    border-radius: 50%;
    padding: 0.5rem;
    opacity: 75%;
  }

  .user-menu-trigger:hover .default-avatar-icon {
    color: var(--sl-light, var(--sl-color-primary-200))
      var(--sl-dark, var(--sl-color-primary-700));

    background-color: var(--sl-light, var(--sl-color-primary-600))
      var(--sl-dark, ${secondaryTextColor});
  }

  .user-menu-trigger:hover * {
    color: var(--sl-light, ${textColor})
      var(--sl-dark, var(--sl-color-neutral-1000));
  }

  .user-menu {
    align-self: stretch;
    cursor: pointer;
    text-align: center;
    margin: 0 0 2rem 0;
  }

  .user-menu-trigger {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .user-menu-info {
    display: flex;
    text-align: center;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    color: ${secondaryTextColor};
  }

  .user-menu-trigger:hover .user-menu-info {
    color: ${textColor};
  }

  .user-menu-caret {
    font-size: 80%;
  }

  .user-menu-items {
    text-align: center;
    align-self: center;
  }

  .main-menu {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .main-menu-item {
    display: flex;
    flex-grow: 1;
    padding: 0.5rem 1rem;
    color: ${secondaryTextColor};
  }

  .main-menu-item:not(.main-menu-item--active):hover {
    color: var(--sl-light, ${textColor})
      var(--sl-dark, var(--sl-color-neutral-1000));

    background-color: var(--sl-light, ${hoverBackColor})
      var(--sl-dark, var(--sl-color-neutral-200));

    cursor: pointer;
  }

  .main-menu-item:not(.main-menu-item--active):active {
    color: var(--sl-light, ${textColor})
      var(--sl-dark, var(--sl-color-neutral-700));

    background-color: var(--sl-light, ${activeBackColor})
      var(--sl-dark, var(--sl-color-primary-200));
  }

  .main-menu-item--active {
    font-weight: 600;
    color: ${selectionColor};
    background-color: ${selectionBackColor};
    border: 0 solid ${selectionBorderColor};
    border-width: 0 0 0 ${selectionBorderWidth};
    padding: 0.5rem 1rem 0.5rem calc(1rem - 2px);
    margin: ${selectionMargin};
    border-radius: ${selectionBorderRadius};
    box-sizing: border-box;
  }

  .main-menu-item-icon {
    width: 2rem;
  }

  .main-menu-item--active .main-menu-item-icon {
    color: ${selectionColor};
  }

  .main-menu-group-header {
    display: flex;
    padding: 0.5rem 0 0.5rem 0;
    color: ${secondaryTextColor};
    cursor: pointer;
  }

  .main-menu-group--active .main-menu-group-header {
    color: var(--sl-light, ${textColor})
      var(--sl-dark, var(--sl-color-neutral-1000));
  }

  .main-menu-group:not(.main-menu-group--active) .main-menu-group-header:hover {
    color: var(--sl-light, ${textColor})
      var(--sl-dark, var(--sl-color-neutral-1000));

    background-color: ${hoverBackColor};
  }

  .main-menu-group-header-icon {
    width: 2rem;
    margin: 0 0 0 1rem;
  }

  .main-menu-group-header-text {
    flex-grow: 1;
    padding-right: 1rem;
    color: ${secondaryTextColor};
  }

  .main-menu-group-header-chevron {
    margin: 0 1rem;
  }

  .main-menu-group .main-menu-group-subitems {
  }

  .main-menu-group--open .main-menu-group-subitems {
    max-height: auto;
    overflow: auto;
  }

  .main-menu-group--closed .main-menu-group-subitems {
    max-height: 0px;
    overflow: hidden;
  }

  .main-menu-group .main-menu-group-header-chevron {
    transition: var(--sl-transition-medium) transform;
  }

  .main-menu-group--closed .main-menu-group-header-chevron {
    transform: rotate(-90deg);
  }

  .main-menu-subitem {
    display: block;
    padding: 0.5rem 1rem 0.5rem 3.5rem;
    margin: 0;
    color: ${secondaryTextColor};
  }

  .main-menu-subitem:not(.main-menu-subitem--active):hover {
    color: var(--sl-light, ${textColor})
      var(--sl-dark, var(--sl-color-neutral-1000));

    background-color: var(--sl-light, ${hoverBackColor})
      var(--sl-dark, var(--sl-color-neutral-200));

    border-radius: ${selectionBorderRadius};

    cursor: pointer;
  }

  .main-menu-subitem--active {
    font-weight: 600;
    border: 0 solid ${selectionBorderColor};
    border-width: var(--sl-light, 0 0 0 2px) var(--sl-dark, 0);
    padding: 0.5rem 1rem 0.5rem calc(3.5rem - 2px);
    box-sizing: border-box;

    color: var(--sl-light, ${selectionColor})
      var(--sl-dark, var(--sl-color-primary-800));

    background-color: var(--sl-light, ${selectionBackColor})
      var(--sl-dark, var(--sl-color-primary-200));
  }

  .main-menu-subitem:not(.main-menu-subitem--active):active {
    color: var(--sl-light, ${textColor})
      var(--sl-dark, var(--sl-color-neutral-700));

    background-color: var(--sl-light, ${activeBackColor})
      var(--sl-dark, var(--sl-color-primary-200));
  }
`;
