import {
  afterInit,
  afterUpdate,
  elem,
  prop,
  state,
  Attrs,
  Component
} from '../../utils/components';

import { html, createRef, ref } from '../../utils/lit';
import { I18nController, I18nFacade } from '../../i18n/i18n';
import { Calendar } from './calendar';

// custom elements
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlIconButton from '@shoelace-style/shoelace/dist/components/icon-button/icon-button';
import SlPopup from '@shoelace-style/shoelace/dist/components/popup/popup';

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
  tag: 'c-date-field2',
  uses: [SlIcon, SlIconButton, SlInput, SlPopup],
  styles: getComponentStyles()
})
export class DateField2 extends Component {
  private _calendar: Calendar;
  private _i18n = new I18nController(this);
  private _inputRef = createRef<SlInput>();

  @prop(Attrs.string, true)
  selectionMode: Calendar.SelectionMode = 'date';

  @prop(Attrs.boolean, true)
  highlightWeekends = false;

  @prop(Attrs.boolean, true)
  showWeekNumbers = false;

  @state
  private _pickerVisible = false;

  constructor() {
    super();

    this._calendar = new Calendar({
      getLocaleSettings,
      className: 'picker',
      styles: getDatepickerStyles(),

      onSelection: (selection, selectionMode) => {
        this._inputRef.value!.value = this._formatSelection(
          selection,
          selectionMode
        );

        if (selectionMode === 'date') {
          this._pickerVisible = false;
        }
      },

      onBlur: () => void (this._pickerVisible = false)
    });

    const updateCalendar = () => {
      this._calendar.setLocale(this._i18n.getLocale());
      this._calendar.setSelectionMode(this.selectionMode);
      this._calendar.setHighlightWeekends(this.highlightWeekends);
      this._calendar.setShowWeekNumbers(this.showWeekNumbers);
    };

    afterInit(this, updateCalendar);

    afterUpdate(this, () => {
      updateCalendar();

      if (this._pickerVisible) {
        this._calendar.focus();
      }
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
            <div class="error"></div>
            <div class="picker-container"></div>
          </div>
        </div>
      </div>

      <sl-popup
        class="popup"
        placement="bottom-start"
        ?active=${this._pickerVisible}
        distance=${8}
        skidding=${8}
        ?flip=${true}
        ?arrow=${true}
      >
        <sl-input
          slot="anchor"
          style="width: 350px;"
          @keydown=${this._onKeyDown}
          ${ref(this._inputRef)}
        >
          <sl-icon-button
            slot="suffix"
            class="calendar-icon"
            src=${icon}
            @click=${this._onTriggerClick}
          >
          </sl-icon-button>
          <div slot="label" class="label">Date of birth</div>
        </sl-input>
        ${this._calendar.getElement()}
      </sl-popup>
      <div class="base"></div>
    `;
  }

  private _onKeyDown = (ev: KeyboardEvent) => {
    const key = ev.key;

    if (key === 'ArrowDown') {
      this._pickerVisible = true;
      this._calendar.focus();
    }
  };

  private _onTriggerClick = () => {
    if (!this._pickerVisible) {
      this._pickerVisible = true;
    }
  };

  private _formatSelection(
    selection: Date[],
    selectionMode: Calendar.SelectionMode
  ): string {
    if (selection.length === 0) {
      return '';
    }

    switch (selectionMode) {
      case 'date':
        return this._i18n.formatDate(selection[0], {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
        });

      case 'dates': {
        const tokens: string[] = [];

        for (const date of [...selection].sort((a, b) =>
          a.getTime() < b.getTime() ? -1 : 1
        )) {
          tokens.push(
            this._i18n.formatDate(date, {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric'
            })
          );
        }

        return tokens.join(', ');
      }

      case 'dateRange': {
        return selection
          .slice(0, 2)
          .map((date) =>
            this._i18n.formatDate(date, {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric'
            })
          )
          .join(' - ');
      }

      case 'dateTime': {
        const date = selection[0];

        const formattedDay = this._i18n.formatDate(date, {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
        });

        const formattedTime = this._i18n.formatDate(date, {
          hour: 'numeric',
          minute: 'numeric'
        });

        return `${formattedDay} ${formattedTime}`;
      }

      case 'time':
        return this._i18n.formatDate(selection[0], {
          hour: 'numeric',
          minute: 'numeric'
        });

      case 'month':
        return this._i18n.formatDate(selection[0], {
          month: '2-digit',
          year: 'numeric'
        });

      case 'year':
        return this._i18n.formatDate(selection[0], {
          year: 'numeric'
        });

      default:
        throw new Error('Illegal selection mode');
    }
  }
}

function getLocaleSettings(locale: string): Calendar.LocaleSettings {
  const i18n = new I18nFacade(() => locale);

  let days = i18n.getDayNames('short');

  if (days.some((day) => day.length > 5)) {
    days = i18n.getDayNames('narrow');
  }

  return {
    daysShort: days,
    months: i18n.getMonthNames('long'),
    monthsShort: i18n.getMonthNames('short'),
    firstDayOfWeek: i18n.getFirstDayOfWeek() as Calendar.Weekday,
    weekendDays: i18n.getWeekendDays() as Calendar.Weekday[],
    getCalendarWeek: (date: Date) => i18n.getCalendarWeek(date)
  };
}

function getComponentStyles() {
  return `
    .popup::part(arrow) {
      background-color: var(--sl-color-neutral-300);
    }
  `;
}

function getDatepickerStyles() {
  return `
    .air-datepicker {
      --adp-font-family: var(--sl-font-sans);
      --adp-font-size: 14px;
      --adp-width: 246px;
      --adp-z-index: 100;
      --adp-padding: 0;
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
      --adp-border-color: var(--sl-color-neutral-400);
      --adp-border-color-inner: var(--sl-color-neutral-200);
      --adp-border-radius: 0;
      --adp-border-color-inline: var(--sl-color-neutral-300);
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
      --adp-cell-border-radius: 0px;
      --adp-cell-background-color-selected: #5cc4ef;
      --adp-cell-background-color-selected-hover: #45bced;
      --adp-cell-background-color-in-range: rgba(92, 196, 239, 0.1);
      --adp-cell-background-color-in-range-hover: rgba(92, 196, 239, 0.2);
      --adp-cell-border-color-in-range: var(--adp-cell-background-color-selected);
      --adp-btn-height: 32px;
      --adp-btn-color: var(--adp-accent-color);
      --adp-btn-color-hover: var(--adp-color);
    }

    .air-datepicker-nav {
      background-color: var(--sl-color-neutral-50);
      border: 0 solid var(--sl-color-neutral-200);
      border-bottom-width: 1px;
      padding: 0;
    }
    
    .air-datepicker-cell.-current- {
      color: var(--adp-color);
      font-weight: 600;
    }

    .air-datepicker {
      box-shadow: var(--sl-shadow-medium) !important;
    }

    .air-datepicker.-only-timepicker- {
      position: relative;
      top: -14px;
    }

    .air-datepicker-nav--title {
      padding: 0 0.8rem;
    }
  `;
}
