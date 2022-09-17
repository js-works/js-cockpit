import { elem, prop, state, Attrs, Component } from '../../utils/components';
import { classMap, createRef, html, ref } from '../../utils/lit';
import { I18nController } from '../../i18n/i18n';

// custom elements
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlIconButton from '@shoelace-style/shoelace/dist/components/icon-button/icon-button';
import SlPopup from '@shoelace-style/shoelace/dist/components/popup/popup';
import { DatePicker } from '../../components/date-picker/date-picker';

// styles
import dateFieldStyles from './date-field.styles';

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
  tag: 'cp-date-field',
  uses: [DatePicker, SlIcon, SlIconButton, SlInput, SlPopup],
  styles: dateFieldStyles
})
export class DateField extends Component {
  private _i18n = new I18nController(this);
  private _inputRef = createRef<SlInput>();
  private _pickerRef = createRef<DatePicker>();

  @prop(Attrs.string, true)
  selectionMode: 'date' | 'dateTime' | 'dateRange' | 'time' = 'date';

  @prop(Attrs.string, true)
  name = '';

  @prop(Attrs.string, true)
  label = '';

  @prop(Attrs.boolean, true)
  required = true;

  @prop(Attrs.boolean, true)
  disabled = false;

  @prop
  selection: Date[] = [];

  @prop(Attrs.boolean, true)
  showWeekNumbers = false;

  @prop(Attrs.boolean, true)
  showAdjacentDays = false;

  @prop(Attrs.boolean, true)
  highlightWeekend = false;

  @prop(Attrs.boolean, true)
  disableWeekend = false;

  @prop(Attrs.boolean, true)
  fixedDayCount = false; // will be ignored if showAdjacentDays is false

  @prop(Attrs.date, true)
  minDate: Date | null = null;

  @prop(Attrs.date, true)
  maxDate: Date | null = null;

  @state
  private _pickerVisible = false;

  @state
  private _value = '';

  private _onInputClick() {
    this._inputRef.value!.focus();
  }

  private _onFocus() {
    this._pickerVisible = true;
  }

  private _onBlur() {
    this._pickerVisible = false;
  }

  private _onOkClick = () => {
    this._value = this._pickerRef.value!.value;
    this._pickerVisible = false;
  };

  private _onCancelClick = () => {
    this._pickerVisible = false;
  };

  private _onClearClick = () => {
    this._value = '';
    this._pickerVisible = false;
  };

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
          distance=${5}
          skidding=${0}
          ?flip=${true}
          ?arrow=${true}
        >
          <sl-input
            slot="anchor"
            class="sl-control"
            value=${this._value}
            ?required=${this.required}
            ?disabled=${this.disabled}
            readonly
            @click=${this._onInputClick}
            @sl-focus=${this._onFocus}
            @sl-blur=${this._onBlur}
            ${ref(this._inputRef)}
            class=${classMap({
              'input': true,
              'input--disabled': this.disabled
            })}
          >
            <sl-icon
              slot="suffix"
              class="calendar-icon"
              src=${icon}
            >
            </sl-icon-button>
            <span slot="label" class="label">${this.label}</span>
          </sl-input>
          <div class="popup-content">
            <cp-date-picker
              class="date-picker"
              .selectionMode=${this.selectionMode}
              .showAdjacentDays=${this.showAdjacentDays}
              .showWeekNumbers=${this.showWeekNumbers}
              .highlightWeekend=${this.highlightWeekend}
              .disableWeekend=${this.disableWeekend}
              .minDate=${this.minDate}
              .maxDate=${this.minDate}
              .fixedDayCount=${this.fixedDayCount}
              ${ref(this._pickerRef)}
            ></cp-date-picker>
            <div class="popup-footer">
              <sl-button
                variant="text"
                class="button"
                @click=${this._onClearClick}
                >Clear</sl-button
              >
              <sl-button
                variant="text"
                class="button"
                @click=${this._onCancelClick}
                >Cancel</sl-button
              >
              <sl-button variant="text" class="button" @click=${this._onOkClick}
                >OK</sl-button
              >
            </div>
          </div>
        </sl-popup>
      </div>
    `;
  }
}
