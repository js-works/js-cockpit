import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
import labelAlignStyles from '../../styles/label-align.styles';

export default css`
  ${componentStyles}
  ${labelAlignStyles}
  
  .base {
    position: relative;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    user-select: none;
    background-color: var(--sl-color-neutral-0);
  }

  .base.full-size {
    display: flex;
    text-align: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    min-width: 100%;
    max-width: 100%;
    min-height: 100%;
    max-width: 100%;
    overflow: hidden;

    background-color: var(--sl-light, var(--sl-color-neutral-100))
      var(--sl-dark, var(--sl-color-neutral-0));
  }

  .container {
    display: inline-flex;
    flex-direction: column;
    color: var(--sl-color-cool-neutral-0);
  }

  .header {
    flex-grow: 3;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
    font-size: var(--sl-font-size-large);
  }

  slot[name='header']::slotted(c-brand),
  slot[name='header']::slotted(c-brand) {
    color: var(--sl-light, var(--sl-color-neutral-500))
      var(--sl-dark, var(--sl-color-neutral-950));
  }

  slot[name='footer']::slotted(div) {
    color: var(--sl-light, var(--sl-color-neutral-500))
      var(--sl-dark, var(--sl-color-neutral-950));
  }

  .center {
    position: relative;
    display: flex;
    min-height: 500px;
    margin: 16px;
    align-self: center;
  }

  .main {
    position: relative;
    display: flex;
    border-radius: 6px;

    box-shadow: var(--sl-light, 5px 5px 25px var(--sl-color-neutral-300))
      var(--sl-dark, none);

    border: var(--sl-light, none) var(--sl-dark, 1px solid #333);
  }

  .column1 {
    display: flex;
    flex-direction: column;
    flex-grow: 5;
    min-width: 330px;
    max-width: 330px;
    padding: 26px 20px 24px 20px;
    box-sizing: border-box;

    color: var(--sl-light, var(--sl-color-neutral-0))
      var(--sl-dark, var(--sl-color-neutral-1000));

    background-color: var(--sl-light, var(--sl-color-primary-600))
      var(--sl-dark, var(--sl-color-neutral-50));

    border-radius: 6px 0 0 6px;

    text-align: center;
    background-repeat: no-repeat;
    background-position: bottom;
  }

  .column1-top {
    flex-grow: 1;
    margin: 0 0 6px 0;
  }

  .column1-bottom {
    color: var(--sl-light, var(--sl-color-neutral-0))
      var(--sl-dark, var(--sl-color-neutral-700));
  }

  .column2 {
    display: inline-flex;
    flex-direction: column;
    gap: 8px;
    text-align: left;
    width: 350px;
    max-width: 350px;
    padding: 24px 20px;
    border-radius: 0 6px 6px 0;

    background-color: var(--sl-light, var(--sl-color-neutral-0))
      var(--sl-dark, var(--sl-color-neutral-50));

    border-radius: 0 6px 6px 0;

    color: var(--sl-light, var(--sl-color-neutral-0))
      var(--sl-dark, var(--sl-color-neutral-1000));

    border: var(--sl-light, none) var(--sl-dark, solid #333);
    border-width: var(--sl-light, 0) var(--sl-dark, 0 0 0 1px);
    box-sizing: border-box;
  }

  .column2-top {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 5px;
    color: var(--sl-color-neutral-1000);
    --sl-input-label-color: var(--sl-color-neutral-1000);
  }

  .column2-bottom {
    display: flex;
    flex-grow: 0;
    flex-direction: column;
    gap: 16px;
  }

  .footer {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    flex-grow: 5;

    color: var(--sl-light, var(--sl-color-primary-950))
      var(--sl-dark, var(--sl-color-neutral-950));
  }

  .default-intro h3 {
    margin: 0;
    font-size: var(--sl-font-size-large);
    font-weight: var(--sl-font-weight-semibold);
  }

  .default-intro p {
    margin: 12px 0;
  }

  .intro-icon {
    color: var(--sl-light, var(--sl-color-neutral-0))
      var(--sl-dark, var(--sl-color-neutral-800));

    width: 64px;
    height: 64px;
  }

  .links {
    text-align: center;
    margin: -12px 0;
  }

  .links > :nth-child(2) {
    margin-left: 4px;
  }

  sl-button.forgot-password-link::part(base),
  sl-button.go-to-login-link::part(base),
  sl-button.go-to-registration-link::part(base) {
    height: unset !important;
    line-height: unset !important;
  }

  sl-button.forgot-password-link::part(label),
  sl-button.go-to-login-link::part(label),
  sl-button.go-to-registration-link::part(label) {
    padding: 4px !important;
  }

  .message {
    transition: opacity 500ms;
    transform: scaleY(1);
    opacity: 1;
  }

  .message.fade-out {
    transition: all 500ms;
    opacity: 0;
    transform: scaleY(0);
  }

  .submit-button {
    width: 100%;
  }

  .submit-button-content {
    display: flex;
    gap: 0.7rem;
    align-items: center;
    justify-content: center;
  }

  .submit-button-text {
    flex-grow: 1;
  }

  .submit-button-spinner {
    flex-grow: 0;
    font-size: 1.125rem;
    --indicator-color: var(--sl-color-neutral-0);
    --track-width: 2px;
  }

  .login-intro-appendix {
    margin-bottom: 0.75rem;
  }

  .overlay {
    position: absolute;
    background-color: transparent;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 32000;
    cursor: wait;
  }

  .column1 {
    background-image: var(
        --sl-light,
        url('data:image/svg+xml;charset=UTF-8,\
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\
      <g transform="translate(0 15)">\
        <circle fill="white" opacity="0.14" cx="0" cy="50" r="30"/>\
        <circle fill="white" opacity="0.14" cx="10" cy="80" r="50"/>\
        <circle fill="white" opacity="0.14" cx="10" cy="100" r="30"/>\
        <circle fill="white" opacity="0.17" cx="70" cy="100" r="65"/>\
        <circle fill="white" opacity="0.16" cx="120" cy="60" r="50"/>\
      </g>\
    </svg>')
      )
      var(--sl-dark, none);
  }
`;
