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
): HTMLElement {
  const ret = document.createElement(tagName)

  for (let propName in props) {
    if (props.hasOwnProperty(propName)) {
      const value = props[propName]

      if (propName === 'lang') {
        ret.setAttribute('lang', value)
      } else if (propName !== 'className' || props.className !== null) {
        ;(ret as any)[propName] = value
      }
    }
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
