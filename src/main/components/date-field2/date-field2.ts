import {
  elem,
  prop,
  afterInit,
  afterUpdate,
  Attrs,
  Component
} from '../../utils/components';

import { html, classMap } from '../../utils/lit';
import { I18nController } from '../../i18n/i18n';
import { Calendar } from './calendar';

// custom elements
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlIconButton from '@shoelace-style/shoelace/dist/components/icon-button/icon-button';

// icons
import dateIcon from '../../icons/calendar3.svg';
import datesIcon from '../../icons/calendar3.svg';
import timeIcon from '../../icons/clock.svg';
import dateTimeIcon from '../../icons/calendar3.svg';
import dateRangeIcon from '../../icons/calendar-range.svg';
import monthIcon from '../../icons/calendar.svg';
import yearIcon from '../../icons/calendar.svg';
import arrowRightIcon from '../../icons/arrow-right.svg';

// === types =========================================================

@elem({
  tag: 'c-date-field2'
})
export class DateField2 extends Component {
  #calendar: Calendar;
  #i18n = new I18nController(this);

  @prop({ attr: Attrs.string })
  selectionMode: Calendar.SelectionMode = 'date';

  constructor() {
    super();

    this.#calendar = new Calendar({
      locale: this.#i18n.getLocale(),
      onSelection(selection) {},
      selectionMode: 'date',
      highlightWeekend: true
    });
  }

  render() {
    const icon = {
      date: dateIcon,
      dates: datesIcon,
      dateRange: dateRangeIcon,
      dateTime: dateTimeIcon,
      time: timeIcon,
      month: monthIcon,
      year: yearIcon
    }[this.selectionMode];

    return html`
      <div class="base">
        <div class="field-wrapper">
          <div class="control">
            <sl-input>
              <sl-icon slot="suffix" class="calendar-icon" src=${icon}>
              </sl-icon>
              <div slot="label" class="label">Date of birth</div>
            </sl-input>
            <div class="error"></div>
            <div class="picker-container"></div>
          </div>
        </div>
      </div>
      <div class="base">
        <div>${this.#calendar.getElement()}</div>
      </div>
    `;
  }
}
