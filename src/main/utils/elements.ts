export function register(
  tagName: string,
  elementClass: CustomElementConstructor
) {
  const registeredClass = customElements.get(tagName)

  if (registeredClass) {
    if (registeredClass !== elementClass) {
      throw new Error(
        `Custom element "${tagName}" has already been defined with a different class`
      )
    }
  } else {
    customElements.define(tagName, elementClass)
  }
}
