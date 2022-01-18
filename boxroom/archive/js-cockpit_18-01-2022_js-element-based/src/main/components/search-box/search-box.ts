import { elem, prop, override, Attrs } from 'js-element'
import { html, classMap, createRef, lit, ref, repeat } from 'js-element/lit'

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
import rightAlignedLabelsStyles from '../../shared/css/label-alignment-aside.css'

// === exports =======================================================

export { SearchBox }

// === types =========================================================

// === SearchBox =====================================================

@elem({
  tag: 'c-search-box',
  styles: [searchBoxStyles, rightAlignedLabelsStyles],
  impl: lit(searchBoxImpl),
  uses: [FocusTrap, SlButton, SlDropdown, SlIcon, SlInput]
})
class SearchBox extends HTMLElement {}

function searchBoxImpl(self: SearchBox) {
  const dropdownRef = createRef<SlDropdown>()

  const onKeyDown = (ev: KeyboardEvent) => {
    if (ev.key !== 'Escape') {
      ev.stopPropagation()
    }
  }

  const onCancelClick = () => {
    dropdownRef.value!.hide()
  }

  const onApplyClick = () => {
    dropdownRef.value!.hide()
  }

  function render() {
    return html`
      <div class="base">
        <sl-input size="small" placeholder="Search...">
          <sl-icon
            src=${searchIcon}
            slot="prefix"
            class="search-icon"
          ></sl-icon>
        </sl-input>
        <sl-dropdown @keydown=${onKeyDown} ${ref(dropdownRef)}>
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
          <div>
            <focus-trap>
              <div class="filters-header">Filters</div>
              <div class="filters">
                <slot></slot>
              </div>
              <div class="filters-actions">
                <sl-button size="small" class="button" @click=${onCancelClick}
                  >Cancel</sl-button
                >
                <sl-button
                  variant="primary"
                  size="small"
                  class="button"
                  @clck=${onApplyClick}
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

  return render
}
