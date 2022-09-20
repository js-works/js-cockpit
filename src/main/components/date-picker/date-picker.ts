import { LocalizeController } from '@shoelace-style/localize';
import { LitBaseDatePicker } from './common/lit-base-date-picker';
import { customElement } from 'lit/decorators';
import datePickerStyles from './date-picker.styles';

@customElement('cp-date-picker')
export class DatePicker extends LitBaseDatePicker {
  static styles = [LitBaseDatePicker.styles, datePickerStyles];

  private _localize = new LocalizeController(this);

  constructor() {
    super({
      getLocale: () => this._localize.lang(),
      getDirection: () => (this._localize.dir() === 'rtl' ? 'rtl' : 'ltr')
    });
  }
}
