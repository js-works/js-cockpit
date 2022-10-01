import { unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators';
import { LocalizeController } from '@shoelace-style/localize';
import { LitDatePicker } from './common/lit-date-picker';

import {
  DatePickerTokens,
  createDatePickerStyles
} from './common/date-picker-styling';

const tokens: DatePickerTokens = {
  fontFamily: 'var(--sl-font-sans)',
  fontSize: 'var(--sl-font-size-medium)',
  color: 'var(--sl-color-neutral-1000)',
  backgroundColor: 'transparent',
  navColor: 'var(--sl-color-neutral-1000)',
  navBackgroundColor: 'transparent',
  navHoverBackgroundColor: 'var(--sl-color-primary-300)',
  navActiveBackgroundColor: 'var(--sl-color-primary-400)',
  navElevatedColor: 'var(--sl-color-neutral-0)',
  navElevatedBackgroundColor: 'var(--sl-color-primary-500)',
  navElevatedHoverBackgroundColor: 'var(--sl-color-primary-600)',
  navElevatedActiveBackgroundColor: 'var(--sl-color-primary-700)',
  cellHoverBackgroundColor: 'var(--sl-color-primary-100)',
  cellDisabledColor: 'var(--sl-color-neutral-300)',
  cellHighlightedBackgroundColor: 'var(--sl-color-neutral-50)',
  cellAdjacentColor: 'var(--sl-color-neutral-400)',
  cellAdjacentDisabledColor: 'var(--sl-color-neutral-200)',
  cellAdjacentSelectedColor: 'var(--sl-color-neutral-800)',
  cellCurrentHighlightedBackgroundColor: 'var(--sl-color-orange-500)',
  cellSelectedColor: 'var(--sl-color-neutral-0)',
  cellSelectedBackgroundColor: 'var(--sl-color-primary-600)',
  cellSelectedHoverBackgroundColor: 'var(--sl-color-primary-500)',
  sliderThumbBackgroundColor: 'var(--sl-color-neutral-0)',
  sliderThumbBorderColor: 'var(--sl-color-neutral-400)',
  sliderThumbBorderWidth: '1px',
  sliderThumbBorderRadius: '4px',
  sliderThumbHoverBackgroundColor: 'var(--sl-color-neutral-0)',
  sliderThumbHoverBorderColor: 'var(--sl-color-neutral-1000)',
  sliderThumbFocusBackgroundColor: 'var(--sl-color-primary-600)',
  sliderThumbFocusBorderColor: 'var(--sl-color-primary-600)',
  sliderTrackColor: 'var(--sl-color-neutral-400)'
};

@customElement('cp-date-picker')
export class DatePicker extends LitDatePicker {
  static styles = unsafeCSS(createDatePickerStyles(tokens));

  private _localize = new LocalizeController(this);

  constructor() {
    super({
      getLocale: () => this._localize.lang(),
      getDirection: () => (this._localize.dir() === 'rtl' ? 'rtl' : 'ltr')
    });
  }
}
