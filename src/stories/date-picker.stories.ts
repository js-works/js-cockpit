import { elem, Component } from '../main/utils/components';
import { css, html } from '../main/utils/lit';
import { h } from '../main/utils/dom';
import { DatePicker, ThemeProvider } from 'js-cockpit';
import { sharedTheme } from './shared/shared-theme';
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox';

export default {
  title: 'date picker'
};

export const datePicker = () => h('date-picker-demo');

const styles = css`
  .container {
    display: flex;
    gap: 2rem;
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
`;

@elem({
  tag: 'date-picker-demo',
  styles: () => styles,
  uses: [DatePicker, SlCheckbox, ThemeProvider]
})
class DatePickerDemo extends Component {
  private _selectionMode = 'weeks';
  private _highlightWeekends = true;
  private _disableWeekends = false;
  private _showWeekNumbers = true;
  private _showAdjacentDays = true;

  private _onChange = (ev: Event) => {
    const target = ev.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const subject = target.getAttribute('data-subject');

    if (!subject) {
      return;
    }

    if (subject === 'selectionMode') {
      this._selectionMode = (target as any).value;
    } else {
      Object.assign(this, {
        [`_${subject}`]: (target as any).checked
      });
    }

    this.requestUpdate();
  };

  render() {
    return html`
      <div class="container">
        <cp-date-picker
          selection-mode=${this._selectionMode}
          ?highlight-weekends=${this._highlightWeekends}
          ?disable-weekends=${this._disableWeekends}
          ?show-week-numbers=${this._showWeekNumbers}
          ?show-adjacent-days=${this._showAdjacentDays}
        ></cp-date-picker>
        <div class="controls" @sl-change=${this._onChange}>
          <sl-select
            data-subject="selectionMode"
            label="Selection mode"
            value=${this._selectionMode}
          >
            <sl-menu-item value="date">date</sl-menu-item>
            <sl-menu-item value="dates">dates</sl-menu-item>
            <sl-menu-item value="dateTime">dateTime</sl-menu-item>
            <sl-menu-item value="week">week</sl-menu-item>
            <sl-menu-item value="weeks">weeks</sl-menu-item>
            <sl-menu-item value="month">month</sl-menu-item>
            <sl-menu-item value="months">months</sl-menu-item>
            <sl-menu-item value="year">year</sl-menu-item>
            <sl-menu-item value="years">years</sl-menu-item> </sl-select
          ><br />
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
        </div>
      </div>
    `;
  }
}
