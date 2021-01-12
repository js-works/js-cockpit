type Renderable = Node | string | number | null | undefined | Renderable[]

export function attr(elem: Element, name: string, value: string) {
  elem.setAttribute(name, value)
}

export function prop(elem: Element, name: string, value: any) {
  ;(elem as any)[name] = value
}

export function h(
  tagName: string,
  props?: Record<string, any> | null,
  ...children: Renderable[]
) {
  const ret = document.createElement(tagName)

  if (props) {
    Object.assign(ret, props)
  }

  if (ret.className === null) {
    ret.className = ''
  }

  addNodes(ret, children)

  return ret
}

function addNodes(target: Node, ...children: Renderable[]) {
  children.forEach((child) => {
    const type = typeof child

    if (child === undefined || child === null) {
      return
    }

    if (type === 'string' || type === 'number') {
      target.appendChild(document.createTextNode(child as string))
    } else if (!Array.isArray(child)) {
      target.appendChild(child as Node)
    } else {
      ;(child as Renderable[]).forEach((subchild) => {
        addNodes(target, subchild)
      })
    }
  })
}

// === defineElement =================================================

export function registerElement(
  tagName: string,
  elementClass: CustomElementConstructor
) {
  if (customElements.get(tagName)) {
    document.location.reload()
  } else {
    customElements.define(tagName, elementClass)
  }
}
