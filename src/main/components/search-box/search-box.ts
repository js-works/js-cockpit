import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, classMap, lit, repeat } from 'js-element/lit'

// custom elements
import SlButton from '@shoelace-style/shoelace/dist/components/button/button'
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlInput from '@shoelace-style/shoelace/dist/components/input/input'

// icons
import searchIcon from '../../icons/search.svg'
import filterIcon from '../../icons/filter.svg'

// styles
import searchBoxStyles from './search-box.css'

// === exports =======================================================

export { SearchBox }

// === types =========================================================

// === SearchBox =====================================================

@elem({
  tag: 'c-search-box',
  styles: searchBoxStyles,
  impl: lit(searchBoxImpl),
  uses: [SlButton, SlDropdown, SlIcon, SlInput]
})
class SearchBox extends component() {}

function searchBoxImpl(self: SearchBox) {
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
        <sl-button type="primary" size="small" class="filter-button">
          <sl-icon src=${filterIcon} slot="prefix"></sl-icon>
          Filter...
        </sl-button>
      </div>
    `
  }

  return render
}
