import { elem, prop, state, Attrs, Component } from '../../utils/components';
import { classMap, createRef, html, ref } from '../../utils/lit';
import { I18nController } from '../../i18n/i18n';

// custom elements
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlIconButton from '@shoelace-style/shoelace/dist/components/icon-button/icon-button';
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown';
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
  uses: [DatePicker, SlDropdown, SlIcon, SlIconButton, SlInput],
  styles: dateFieldStyles
})
export class DateField extends Component {
  private _i18n = new I18nController(this);
  private _inputRef = createRef<SlInput>();
  private _pickerRef = createRef<DatePicker>();
  private _dropdownRef = createRef<SlDropdown>();

  @prop(Attrs.string, true)
  selectionMode: 'date' | 'dateTime' | 'dateRange' | 'time' = 'date';

  @prop(Attrs.string, true)
  name = '';

  @prop(Attrs.string, true)
  label = '';

  @prop(Attrs.boolean, true)
  required = false;

  @prop(Attrs.boolean, true)
  disabled = false;

  @prop
  selection: Date[] = [];

  @prop(Attrs.boolean, true)
  showWeekNumbers = false;

  @prop(Attrs.boolean, true)
  showAdjacentDays = false;

  @prop(Attrs.boolean, true)
  highlightWeekends = false;

  @prop(Attrs.boolean, true)
  disableWeekends = false;

  @prop(Attrs.boolean, true)
  fixedDayCount = false; // will be ignored if showAdjacentDays is false

  @prop(Attrs.date, true)
  minDate: Date | null = null;

  @prop(Attrs.date, true)
  maxDate: Date | null = null;

  @state
  private _value = '';

  private _onInputClick() {
    this._inputRef.value!.focus();
  }

  private _onOkClick = () => {
    this._value = this._pickerRef.value!.value;
    this._dropdownRef.value!.hide();
  };

  private _onInputKeyDown = (ev: KeyboardEvent) => {
    if (ev.key !== 'ArrowDown' || this._dropdownRef.value!.open) {
      return;
    }

    this._dropdownRef.value!.show();
  };

  private _onCancelClick = () => {
    this._dropdownRef.value!.hide();
  };

  private _onClearClick = () => {
    this._value = '';
    this._dropdownRef.value!.hide();
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
      <div class="base">
        <sl-dropdown
          class="popup"
          placement="bottom-start"
          distance=${2}
          skidding=${2}
          hoist
          ${ref(this._dropdownRef)}
        >
          <sl-input
            slot="trigger"
            class="sl-control"
            value=${this._value}
            ?required=${this.required}
            ?disabled=${this.disabled}
            readonly
            @click=${this._onInputClick}
            @keydown=${this._onInputKeyDown}
            ${ref(this._inputRef)}
            class=${classMap({
              'input': true,
              'input--disabled': this.disabled
            })}
          >
            <sl-icon slot="suffix" class="calendar-icon" src=${icon}> </sl-icon>
            <span slot="label" class="label">${this.label}</span>
          </sl-input>
          <div class="popup-content">
            <cp-date-picker
              class="date-picker"
              .selectionMode=${this.selectionMode}
              .showAdjacentDays=${this.showAdjacentDays}
              .showWeekNumbers=${this.showWeekNumbers}
              .highlightWeekends=${this.highlightWeekends}
              .disableWeekends=${this.disableWeekends}
              .minDate=${this.minDate}
              .maxDate=${this.minDate}
              .fixedDayCount=${this.fixedDayCount}
              ${ref(this._pickerRef)}
            ></cp-date-picker>
            <div class="popup-footer">
              <sl-button
                variant="text"
                size="small"
                class="button"
                @click=${this._onClearClick}
                >Clear</sl-button
              >
              <sl-button
                variant="text"
                class="button"
                size="small"
                @click=${this._onCancelClick}
              >
                Cancel
              </sl-button>
              <sl-button
                variant="text"
                class="button"
                size="small"
                @click=${this._onOkClick}
              >
                OK
              </sl-button>
            </div>
          </div>
        </sl-dropdown>
      </div>
    `;
  }
}
