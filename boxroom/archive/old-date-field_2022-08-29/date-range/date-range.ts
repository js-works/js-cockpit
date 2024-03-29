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

// @ts-ignore
import { DateRangePicker } from 'vanillajs-datepicker';

import {
  getLocalization,
  initPopup,
  DatepickerInstance,
  DateRangePickerInstance
} from '../date-field3/date-picker-utils';

// custom elements
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlIconButton from '@shoelace-style/shoelace/dist/components/icon-button/icon-button';

// icons
import calendarIcon from '../../icons/calendar-range.svg';
import arrowRightIcon from '../../icons/arrow-right.svg';

// styles
import dateRangeStyles from './date-range.css';
import datePickerStyles from '../date-field/date-picker.scss';
import controlStyles from '../../shared/css/control.styles';

// === exports =======================================================

export { DateRange };

// === Cockpit ===================================================

@elem({
  tag: 'c-date-range',
  styles: [datePickerStyles, dateRangeStyles, controlStyles],
  uses: [SlIcon, SlIconButton, SlInput]
})
class DateRange extends Component {
  @prop({ attr: Attrs.string })
  label = '';

  @prop({ attr: Attrs.string })
  error = '';

  @prop({ attr: Attrs.boolean })
  disabled = false;

  @prop({ attr: Attrs.boolean })
  required = false;

  private _i18n = new I18nController(this);
  private _datepicker: DateRangePickerInstance | null = null;

  constructor() {
    super();

    afterInit(this, () => {
      const getLocale = () => this._i18n.getLocale();
      const shadowRoot = this.shadowRoot!;

      setTimeout(() => {
        this._datepicker = createDateRangePicker({
          getLocale,
          range: shadowRoot.querySelector('.fields')!,
          slInput1: shadowRoot.querySelector('.input1')! as any as SlInput,
          slInput2: shadowRoot.querySelector('.input2')! as any as SlInput,
          pickerContainer: shadowRoot.querySelector('.picker-container')!,
          namespace: this.localName
        });
      }, 0);
    });
  }

  render() {
    return html`
      <div class="base ${classMap({ required: this.required })}">
        <div class="field-wrapper">
          <div class="control">
            <div class="fields">
              <sl-input size="small" class="input1">
                <div slot="label" class="label">${this.label}</div>
              </sl-input>
              <div class="separator">
                <sl-icon src=${arrowRightIcon}></sl-icon>
              </div>
              <sl-input size="small" class="input2"> </sl-input>
              <sl-icon
                slot="suffix"
                class="calendar-icon"
                src=${calendarIcon}
              ></sl-icon>
            </div>
            <div class="error">${this.error}</div>
            <div class="picker-container"></div>
          </div>
        </div>
      </div>
    `;
  }
}

function createDateRangePicker(params: {
  range: HTMLElement;
  slInput1: SlInput;
  slInput2: SlInput;
  pickerContainer: HTMLElement;
  getLocale: () => string;
  namespace: string;
}): DatepickerInstance {
  const {
    range,
    slInput1,
    slInput2,
    pickerContainer: container,
    getLocale
  } = params;

  const input1 = (slInput1 as any).shadowRoot!.querySelector('input')!;
  const input2 = (slInput2 as any).shadowRoot!.querySelector('input')!;
  let dateRangePicker: any;

  container.addEventListener('mousedown', (ev) => ev.preventDefault());

  setTimeout(() => {
    const locale = getLocale();
    const localization = getLocalization(getLocale(), params.namespace);

    input1.addEventListener('hide', () => {
      slInput1.value = input1!.value;
    });

    input2.addEventListener('hide', () => {
      slInput2.value = input2.value;
    });

    dateRangePicker = new DateRangePicker(range, {
      inputs: [input1, input2],
      calendarWeeks: true,
      daysOfWeekHighlighted: localization.weekendDays,
      prevArrow: '&#x1F860;',
      nextArrow: '&#x1F862;',
      autohide: true,
      showOnFocus: false,
      updateOnBlur: false,
      todayHighlight: true,
      container: container,
      weeknumbers: true,
      language: `${params.namespace}::${locale}`,
      weekStart: localization.weekStart,
      format: localization.format
    });

    initPopup(slInput1, dateRangePicker.datepickers[0]);
    initPopup(slInput2, dateRangePicker.datepickers[1]);
  }, 0);
}
