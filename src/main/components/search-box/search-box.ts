import { bind, elem, Component } from '../../utils/components'
import { createRef, html, ref } from '../../utils/lit'

// custom elements
import { FocusTrap } from '@a11y/focus-trap'
import SlButton from '@shoelace-style/shoelace/dist/components/button/button'
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlInput from '@shoelace-style/shoelace/dist/components/input/input'

// icons
import searchIcon from '../../icons/search.svg'
import filterIcon from '../../icons/filter.svg'

// styles
import searchBoxStyles from './search-box.css'
import rightAlignedLabelsStyles from '../../shared/css/label-horizontal.css'

// === exports =======================================================

export { SearchBox }

// === types =========================================================

// === SearchBox =====================================================

@elem({
  tag: 'c-search-box',
  styles: [searchBoxStyles, rightAlignedLabelsStyles],
  uses: [FocusTrap, SlButton, SlDropdown, SlIcon, SlInput]
})
class SearchBox extends Component {
  private _dropdownRef = createRef<SlDropdown>()

  @bind
  private _onKeyDown(ev: KeyboardEvent) {
    if (ev.key !== 'Escape') {
      ev.stopPropagation()
    }
  }

  @bind
  private _onCancelClick() {
    this._dropdownRef.value!.hide()
  }

  @bind
  private _onApplyClick() {
    this._dropdownRef.value!.hide()
  }

  render() {
    return html`
      <div class="base">
        <sl-input size="small" clearable placeholder="Search...">
          <sl-icon
            src=${searchIcon}
            slot="prefix"
            class="search-icon"
          ></sl-icon>
        </sl-input>
        <sl-dropdown @keydown=${this._onKeyDown} ${ref(this._dropdownRef)}>
          <div slot="trigger">
            <sl-button
              variant="default"
              size="small"
              class="filter-button"
              caret
            >
              <sl-icon src=${filterIcon} slot="prefix"></sl-icon>
              Filter
            </sl-button>
          </div>
          <div class="popup">
            <focus-trap>
              <div class="filters-header">Filters</div>
              <div class="filters">
                <slot></slot>
              </div>
              <div class="filters-actions">
                <sl-button
                  size="small"
                  class="button"
                  @click=${this._onCancelClick}
                  >Cancel</sl-button
                >
                <sl-button
                  variant="primary"
                  size="small"
                  class="button"
                  @click=${this._onApplyClick}
                >
                  Apply
                </sl-button>
              </div>
            </focus-trap>
          </div>
        </sl-dropdown>
      </div>
    `
  }
}
