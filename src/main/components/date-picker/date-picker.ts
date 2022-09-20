import { css } from 'lit';
import { customElement } from 'lit/decorators';
import { LocalizeController } from '@shoelace-style/localize';
import { LitDatePicker } from './common/lit-date-picker';

const datePickerStyles = css``;

@customElement('cp-date-picker')
export class DatePicker extends LitDatePicker {
  static styles = [LitDatePicker.styles, datePickerStyles];

  private _localize = new LocalizeController(this);

  constructor() {
    super({
      getLocale: () => this._localize.lang(),
      getDirection: () => (this._localize.dir() === 'rtl' ? 'rtl' : 'ltr')
    });
  }
}
