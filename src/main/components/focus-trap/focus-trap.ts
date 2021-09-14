import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { useAfterMount } from 'js-element/hooks'
import { createRef, html, lit, ref } from 'js-element/lit'

// custom elements
import SlButton from '@shoelace-style/shoelace/dist/components/button/button'
import SlButtonGroup from '@shoelace-style/shoelace/dist/components/button-group/button-group'
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown'
import SlMenu from '@shoelace-style/shoelace/dist/components/menu/menu'
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item'

// styles
import actionBarStyles from './focus-trap.css'
import { createFocusTrap, FocusTrap as Trap } from 'focus-trap'

// === exports =======================================================

export { FocusTrap }

// === types =========================================================

// === FocusTrap =====================================================

@elem({
  tag: 'c-focus-trap',
  impl: lit(focusTrapImpl)
})
class FocusTrap extends component() {}

function focusTrapImpl(self: FocusTrap) {
  const containerRef = createRef<HTMLElement>()

  useAfterMount(() => {
    const focusTrap = createFocusTrap(containerRef.value!)
    focusTrap.activate()

    return () => focusTrap.deactivate()
  })

  function render() {
    return html`<div ${ref(containerRef)}><slot></slot></div>`
  }

  return render
}
