import { html, unsafeCSS, LitElement } from 'lit';
import type { ComplexAttributeConverter } from 'lit';
import { customElement, property } from 'lit/decorators';
import { unsafeHTML } from 'lit/directives/unsafe-html';
import { createRef, ref } from 'lit/directives/ref';
import { LocalizeController } from '@shoelace-style/localize';
import { DatePickerController } from './common/date-picker-controller';
import { renderDatePicker } from './common/date-picker-render';
import { diff, renderToString } from './common/vdom';
import type { VNode } from './common/vdom';

import {
  DatePickerTokens,
  createDatePickerStyles
} from './common/date-picker-styling';

// === exports =======================================================

export { DatePicker };

// === exported types ==========================================

namespace LitDatePicker {
  export type SelectionMode = DatePickerController.SelectionMode;
}

// === converters ====================================================

const dateAttributeConverter: ComplexAttributeConverter<Date | null, Date> = {
  fromAttribute(value) {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return null;
    }

    return new Date(value);
  },

  toAttribute(date) {
    if (!date) {
      return '';
    }

    return (
      String(date.getFullYear()).padStart(4, '0') +
      '-' +
      String(date.getMonth()).padStart(2, '0') +
      '-' +
      String(date.getDate()).padStart(2, '0')
    );
  }
};

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
  cellCurrentHighlightedBackgroundColor: 'var(--sl-color-neutral-200)',
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
class DatePicker extends LitElement {
  @property({ type: String })
  get value() {
    return this._datePicker.getValue();
  }

  set value(value: string) {
    this._datePicker.setValue(value);
  }

  @property({ type: String, attribute: 'selection-mode' })
  selectionMode: LitDatePicker.SelectionMode = 'date';

  @property({ type: Boolean, attribute: 'elevate-navigation' })
  elevateNavigation = false;

  @property({ type: Boolean, attribute: 'show-week-numbers' })
  showWeekNumbers = false;

  @property({ type: Boolean, attribute: 'show-adjacent-days' })
  showAdjacentDays = false;

  @property({ type: Boolean, attribute: 'highlight-today' })
  highlightToday = false;

  @property({ type: Boolean, attribute: 'highlight-weekends' })
  highlightWeekends = false;

  @property({ type: Boolean, attribute: 'disable-weekends' })
  disableWeekends = false;

  @property({ type: Boolean, attribute: 'enable-century-view' })
  enableCenturyView = false;

  @property({ type: Boolean, attribute: 'fixed-day-count' })
  fixedDayCount = false; // will be ignored if showAdjacentDays is false

  @property({ converter: dateAttributeConverter, attribute: 'min-date' })
  minDate: Date | null = null;

  @property({ converter: dateAttributeConverter, attribute: 'max-date' })
  maxDate: Date | null = null;

  @property({ type: String, reflect: true })
  lang = '';

  @property({ type: String, reflect: true })
  dir = '';

  private _datePicker: DatePickerController;
  private _content: VNode = null;
  private _containerRef = createRef<HTMLDivElement>();

  static styles = unsafeCSS(createDatePickerStyles(tokens));

  private _localize = new LocalizeController(this);

  constructor() {
    super();

    this._datePicker = new DatePickerController(this, {
      getSelectionMode: () => this.selectionMode
    });
  }

  shouldUpdate() {
    const oldContent = this._content;

    this._content = renderDatePicker(
      this._localize.lang(),
      this._localize.dir() === 'rtl' ? 'rtl' : 'ltr',
      this,
      this._datePicker
    );

    if (!this.hasUpdated) {
      return true;
    }

    diff(
      oldContent,
      this._content
    )(this._containerRef.value!.firstElementChild!);

    return false;
  }

  render() {
    return html`
      <div ${ref(this._containerRef)}>
        ${unsafeHTML(renderToString(this._content))}
      </div>
    `;
  }
}
