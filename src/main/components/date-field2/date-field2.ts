import { html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators';
import { Calendar } from './calendar';

// === types =========================================================

@customElement('c-date-field2')
export class DateField2 extends LitElement {
  #calendar = new Calendar({
    locale: 'de',
    onSelect(selection) {},
    selectionMode: 'dates'
  });

  //static styles = unsafeCSS(airCss);

  render() {
    return html`
      <div>
        <input />
        <div>${this.#calendar.getElement()}</div>
        <input />
      </div>
    `;
  }
}
