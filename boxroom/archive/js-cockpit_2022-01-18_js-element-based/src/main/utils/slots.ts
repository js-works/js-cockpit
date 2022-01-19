// this is copied from the shoelace project - thanks to Cory
export function hasSlot(el: HTMLElement, name?: string) {
  // Look for a named slot
  if (name) {
    return el.querySelector(`:scope > [slot="${name}"]`) !== null
  }

  // Look for a default slot
  return [...(el.childNodes as any)].some((node) => {
    if (node.nodeType === node.TEXT_NODE && node.textContent!.trim() !== '') {
      return true
    }

    if (node.nodeType === node.ELEMENT_NODE) {
      const el = node as HTMLElement
      if (!el.hasAttribute('slot')) {
        return true
      }
    }

    return false
  })
}
