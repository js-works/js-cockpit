import { elem, prop, Component } from '../main/utils/components';
import { css, html } from '../main/utils/lit';
import { h } from '../main/utils/dom';
import { Card, DateField } from 'js-cockpit';

export default {
  title: 'date components'
};

export const dateFields = () => h('date-field-demo');

const styles = css`
  .columns {
    display: flex;
    gap: 2rem;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
  }

  .first-column {
    width: 20rem;
  }

  .second-column {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mode-selector {
    min-width: 12rem;
  }
`;

@elem({
  tag: 'date-field-demo',
  styles: () => styles,
  uses: [Card, DateField]
})
class DatePickerDemo extends Component {
  render() {
    return html`
      <cp-card>
        <div slot="header">Date field demo</div>
        <div>
          <cp-date-field label="Date"></cp-date-field>

          <cp-date-field
            label="Date and time"
            selection-mode="dateTime"
          ></cp-date-field>

          <cp-date-field label="Time" selection-mode="time"></cp-date-field>

          <cp-date-field
            label="Date range"
            selection-mode="dateRange"
          ></cp-date-field>

          <cp-date-field label="Month" selection-mode="month"></cp-date-field>
          <cp-date-field
            label="Week"
            selection-mode="week"
            show-week-numbers
          ></cp-date-field>
          <cp-date-field label="Year" selection-mode="year"></cp-date-field>
        </div>
      </cp-card>
    `;
  }
}
