import { css, html, unsafeCSS, LitElement } from 'lit';
import type { ComplexAttributeConverter } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { LocalizeController } from '@shoelace-style/localize/dist/index.js';
import { DatePickerController } from './common/date-picker-controller';
import { renderDatePicker } from './common/date-picker-render';
import { diff, renderToString } from './common/vdom';
import type { VNode } from './common/vdom';
import datePickerBaseStyles from './common/date-picker.styles';

// === exports =======================================================

export { DatePicker };

// === exported types ==========================================

namespace DatePicker {
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

const datePickerCustomStyles = css`
  .base {
    --cal-font-family: var(--sl-font-sans);
    --cal-font-size: var(--sl-font-size-medium);
    --cal-color: var(--sl-color-neutral-1000);
    --cal-backgroundColor: transparent;
    --cal-nav-color: var(--sl-color-neutral-1000);
    --cal-nav-background-color: transparent;
    --cal-nav-hover-background-color: var(--sl-color-primary-300);
    --cal-nav-active-background-color: var(--sl-color-primary-400);
    --cal-nav-elevated-color: var(--sl-color-neutral-0);
    --cal-nav-elevated-background-color: var(--sl-color-primary-500);
    --cal-nav-elevated-hover-background-color: var(--sl-color-primary-600);
    --cal-nav-elevated-active-background-color: var(--sl-color-primary-700);
    --cal-cell-hover-background-color: var(--sl-color-primary-100);
    --cal-cell-disabled-color: var(--sl-color-neutral-300);
    --cal-cell-highlighted-background-color: var(--sl-color-neutral-50);
    --cal-cell-adjacent-color: var(--sl-color-neutral-400);
    --cal-cell-adjacent-disabled-color: var(--sl-color-neutral-200);
    --cal-cell-adjacent-selected-color: var(--sl-color-neutral-800);
    --cal-cell-current-highlighted-background-color: var(
      --sl-color-neutral-200
    );
    --cal-cell-selected-color: var(--sl-color-neutral-0);
    --cal-cell-selected-background-color: var(--sl-color-primary-600);
    --cal-cell-selected-hover-background-color: var(--sl-color-primary-500);
    --cal-slider-thumb-background-color: var(--sl-color-neutral-0);
    --cal-slider-thumb-border-color: var(--sl-color-neutral-400);
    --cal-slider-thumb-border-width: 1px;
    --cal-slider-thumb-border-radius: 4px;
    --cal-slider-thumb-hover-background-color: var(--sl-color-neutral-0);
    --cal-slider-thumb-hover-border-color: var(--sl-color-neutral-1000);
    --cal-slider-thumb-focus-background-color: var(--sl-color-primary-600);
    --cal-slider-thumb-focus-border-color: var(--sl-color-primary-600);
    --cal-slider-track-color: var(--sl-color-neutral-400);
  }
`;

@customElement('cp-date-picker')
class DatePicker extends LitElement {
  static styles = [unsafeCSS(datePickerBaseStyles), datePickerCustomStyles];

  @property({ type: String })
  get value() {
    return this._datePicker.getValue();
  }

  set value(value: string) {
    this._datePicker.setValue(value);
  }

  @property({ type: String, attribute: 'selection-mode' })
  selectionMode: DatePicker.SelectionMode = 'date';

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
  private _pickerVNode: VNode = null;
  private _containerRef = createRef<HTMLDivElement>();
  private _localize = new LocalizeController(this);

  constructor() {
    super();

    this._datePicker = new DatePickerController(this, {
      requestUpdate: () => this.requestUpdate(),
      getSelectionMode: () => this.selectionMode,
      onChange: this._onChange
    });
  }

  private _onChange = () => {
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  };

  shouldUpdate() {
    const oldPickerVNode = this._pickerVNode;

    this._pickerVNode = renderDatePicker(
      this._localize.lang(),
      this._localize.dir() === 'rtl' ? 'rtl' : 'ltr',
      this,
      this._datePicker
    );

    if (!this.hasUpdated) {
      return true;
    }

    diff(
      oldPickerVNode,
      this._pickerVNode
    )(this._containerRef.value!.firstElementChild!);

    return false;
  }

  render() {
    return html`
      <div class="base" ${ref(this._containerRef)}>
        ${unsafeHTML(renderToString(this._pickerVNode))}
      </div>
    `;
  }
}
