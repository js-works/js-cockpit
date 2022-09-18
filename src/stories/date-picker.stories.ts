import { elem, Component } from '../main/utils/components';
import { css, html, when } from '../main/utils/lit';
import { h } from '../main/utils/dom';
import { DatePicker, ThemeProvider } from 'js-cockpit';
import { sharedTheme } from './shared/shared-theme';
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox';

export default {
  title: 'date picker'
};

export const datePicker = () => h('date-picker-demo');

const styles = css`
  .columns {
    display: flex;
    gap: 2rem;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
  }

  .first-column {
    width: 18rem;
  }

  .second-column {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;

@elem({
  tag: 'date-picker-demo',
  styles: () => styles,
  uses: [DatePicker, SlCheckbox, ThemeProvider]
})
class DatePickerDemo extends Component {
  private _selectionValue: string = '';
  private _selectionMode = 'weeks';
  private _highlightWeekends = true;
  private _disableWeekends = false;
  private _showWeekNumbers = true;
  private _showAdjacentDays = true;

  private _onChange = (ev: Event) => {
    const target: any = ev.target;
    const subject = target.getAttribute('data-subject');

    if (!subject) {
      return;
    }

    if (subject === 'datePicker') {
      this._selectionValue = target.value;
    } else if (subject === 'selectionMode') {
      this._selectionMode = target.value;
    } else {
      Object.assign(this, {
        [`_${subject}`]: target.checked
      });
    }

    this.requestUpdate();
  };

  render() {
    return html`
      <div
        class="columns"
        @change=${this._onChange}
        @sl-change=${this._onChange}
      >
        <div class="first-column">
          <cp-date-picker
            data-subject="datePicker"
            selection-mode=${this._selectionMode}
            ?highlight-weekends=${this._highlightWeekends}
            ?disable-weekends=${this._disableWeekends}
            ?show-week-numbers=${this._showWeekNumbers}
            ?show-adjacent-days=${this._showAdjacentDays}
          ></cp-date-picker>
          <div>Selection: ${this._selectionValue}</div>
        </div>
        <div class="second-column">
          <sl-select
            data-subject="selectionMode"
            label="Selection mode"
            value=${this._selectionMode}
          >
            <sl-menu-item value="date">date</sl-menu-item>
            <sl-menu-item value="dates">dates</sl-menu-item>
            <sl-menu-item value="dateTime">dateTime</sl-menu-item>
            <sl-menu-item value="time">time</sl-menu-item>
            <sl-menu-item value="week">week</sl-menu-item>
            <sl-menu-item value="weeks">weeks</sl-menu-item>
            <sl-menu-item value="month">month</sl-menu-item>
            <sl-menu-item value="months">months</sl-menu-item>
            <sl-menu-item value="year">year</sl-menu-item>
            <sl-menu-item value="years">years</sl-menu-item>
          </sl-select>
          ${when(
            this._selectionMode !== 'time',
            () => html`
              <sl-checkbox
                data-subject="showAdjacentDays"
                ?checked=${this._showAdjacentDays}
              >
                show adjacent days
              </sl-checkbox>
              <sl-checkbox
                data-subject="highlightWeekends"
                ?checked=${this._highlightWeekends}
              >
                highlight weekends
              </sl-checkbox>
              <sl-checkbox
                data-subject="disableWeekends"
                ?checked=${this._disableWeekends}
              >
                disable weekends
              </sl-checkbox>
              <sl-checkbox
                data-subject="showWeekNumbers"
                ?checked=${this._showWeekNumbers}
              >
                show week numbers
              </sl-checkbox>
            `
          )}
        </div>
      </div>
    `;
  }
}
