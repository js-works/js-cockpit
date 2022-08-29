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

// styles
import dateFieldStyles from './date-field.styles';
import datePickerStyles from './date-picker.styles';

// icons
import dateIcon from '../../icons/calendar3.svg';
import datesIcon from '../../icons/calendar3.svg';
import timeIcon from '../../icons/clock.svg';
import dateTimeIcon from '../../icons/calendar3.svg';
import dateRangeIcon from '../../icons/calendar-range.svg';
import monthIcon from '../../icons/calendar.svg';
import yearIcon from '../../icons/calendar.svg';

// === types =========================================================

@elem({
  tag: 'c-date-field',
  uses: [SlIcon, SlIconButton, SlInput, SlPopup],
  styles: dateFieldStyles
})
export class DateField extends Component {
  private _calendar: Calendar;
  private _i18n = new I18nController(this);
  private _inputRef = createRef<SlInput>();

  @prop(Attrs.string, true)
  name = '';

  @prop(Attrs.string, true)
  label = '';

  @prop(Attrs.string, true)
  required = true;

  @prop(Attrs.boolean, true)
  disabled = false;

  @prop(Attrs.string, true)
  selectionMode: Calendar.SelectionMode = 'dateTime';

  @prop
  selection: Date[] = [];

  @prop(Attrs.boolean, true)
  highlightWeekends = true;

  @prop(Attrs.boolean, true)
  showWeekNumbers = false;

  @state
  private _pickerVisible = false;

  constructor() {
    super();

    this._calendar = new Calendar({
      getLocaleSettings,
      className: 'picker',
      styles: datePickerStyles.cssText,
      onBlur: () => void (this._pickerVisible = false)
    });

    this._calendar.setButtons([
      {
        text: 'Clear',
        onClick: () => this._calendar.clear()
      },
      {
        text: 'Cancel',
        onClick: () => {
          this._calendar.setSelection(this.selection);
        }
      },
      {
        text: 'OK',
        onClick: () => {
          const newSelection = this._calendar.getSelection();
          this.selection = newSelection;

          this._inputRef.value!.value = this._formatSelection(
            newSelection,
            this.selectionMode
          );

          if (this.selectionMode === 'date') {
            this._pickerVisible = false;
          }
        }
      }
    ]);

    const updateCalendar = () => {
      this._calendar.setLocale(this._i18n.getLocale());
      this._calendar.setSelectionMode(this.selectionMode);
      this._calendar.setHighlightWeekends(this.highlightWeekends);
      this._calendar.setShowWeekNumbers(this.showWeekNumbers);
      this._calendar.setSelection(this.selection);
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
      <div class="base" style="border: 1px green red">
        <sl-popup
          class="popup"
          placement="bottom"
          ?active=${this._pickerVisible}
          distance=${8}
          skidding=${0}
          ?flip=${true}
          ?arrow=${true}
        >
          <sl-input
            slot="anchor"
            class="control"
            ?required=${this.required}
            ?disabled=${this.disabled}
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
            <span slot="label" class="label">${this.label}</span>
          </sl-input>
          ${this._calendar.getElement()}
        </sl-popup>
      </div>
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
