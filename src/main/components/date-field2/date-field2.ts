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

    this.#calendar = new Calendar((sel) => {
      console.log('selection: ', sel);
    }, getDatepickerStyles());

    this.#calendar.setSelectionMode('date');
    this.#calendar.setLocale(this.#i18n.getLocale());
    this.#calendar.setSelection([new Date(2022, 0, 1)]);
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

function getDatepickerStyles() {
  return `
    .air-datepicker {
      --adp-font-family: var(--sl-font-sans);
      --adp-font-size: 14px;
      --adp-width: 246px;
      --adp-z-index: 100;
      --adp-padding: 4px;
      --adp-grid-areas: 'nav' 'body' 'timepicker' 'buttons';
      --adp-transition-duration: .3s;
      --adp-transition-ease: ease-out;
      --adp-transition-offset: 8px;
      --adp-background-color: #fff;
      --adp-background-color-hover: #f0f0f0;
      --adp-background-color-active: #eaeaea;
      --adp-background-color-in-range: rgba(92, 196, 239, .1);
      --adp-background-color-in-range-focused: rgba(92, 196, 239, .2);
      --adp-background-color-selected-other-month-focused: #8ad5f4;
      --adp-background-color-selected-other-month: #a2ddf6;
      --adp-color: #4a4a4a;
      --adp-color-secondary: #9c9c9c;
      --adp-accent-color: var(--sl-color-primary-500);
      --adp-color-current-date: var(--adp-accent-color);
      --adp-color-other-month: #dedede;
      --adp-color-disabled: #aeaeae;
      --adp-color-disabled-in-range: #939393;
      --adp-color-other-month-hover: #c5c5c5;
      --adp-border-color: #dbdbdb;
      --adp-border-color-inner: #efefef;
      --adp-border-radius: 4px;
      --adp-border-color-inline: #d7d7d7;
      --adp-nav-height: 32px;
      --adp-nav-arrow-color: var(--adp-color-secondary);
      --adp-nav-action-size: 32px;
      --adp-nav-color-secondary: var(--adp-color-secondary);
      --adp-day-name-color: var(--sl-color-neutral-500);
      --adp-day-name-color-hover: #8ad5f4;
      --adp-day-cell-width: 1fr;
      --adp-day-cell-height: 32px;
      --adp-month-cell-height: 42px;
      --adp-year-cell-height: 56px;
      --adp-pointer-size: 10px;
      --adp-poiner-border-radius: 2px;
      --adp-pointer-offset: 14px;
      /* --adp-cell-border-radius: 4px; */
      --adp-cell-background-color-selected: #5cc4ef;
      --adp-cell-background-color-selected-hover: #45bced;
      --adp-cell-background-color-in-range: rgba(92, 196, 239, 0.1);
      --adp-cell-background-color-in-range-hover: rgba(92, 196, 239, 0.2);
      --adp-cell-border-color-in-range: var(--adp-cell-background-color-selected);
      --adp-btn-height: 32px;
      --adp-btn-color: var(--adp-accent-color);
      --adp-btn-color-hover: var(--adp-color);
    };
  `;
}
