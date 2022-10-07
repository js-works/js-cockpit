export { h, diff, render, renderToString };
export type { VElement, VNode };

type Attrs = Record<string, string | number | null>;
type Patch = (elem: HTMLElement) => void;

type VElement = {
  tagName: string;
  attrs: Attrs | null;
  children: VNode[];
};

type VNode =
  | null
  | string
  | number
  | VElement
  | (null | string | number | VElement)[];

function h(tagName: string, attrs: Attrs | null = null, ...children: VNode[]) {
  return {
    tagName,
    attrs,
    children
  };
}

function renderToString(vnode: VNode): string {
  const tokens: string[] = [];
  const push = tokens.push.bind(tokens);
  const encodedEntities = /["&<]/g;

  const entityReplacements: Record<string, string> = {
    '"': '&quot;',
    '&': '&amp;',
    '<': '&lt;'
  };

  const encodeEntities = (s: string) =>
    s.replaceAll(encodedEntities, (ch) => entityReplacements[ch]);

  const process = (vnode: VNode): void => {
    if (vnode === null) {
      return;
    }

    if (typeof vnode === 'string') {
      push(vnode);
    } else if (typeof vnode === 'number') {
      push(String(vnode));
    } else if (Array.isArray(vnode)) {
      vnode.forEach(process);
    } else {
      push('<', vnode.tagName);

      if (vnode.attrs) {
        for (const [k, v] of Object.entries(vnode.attrs)) {
          if (v !== null) {
            push(' ', k, '="', encodeEntities(String(v)), '"');
          }
        }
      }

      push('>');
      vnode.children.forEach(process);
      push('</', vnode.tagName, '>');
    }
  };

  process(vnode);

  return tokens.join('');
}

function renderElem({ tagName, attrs, children }: VElement): HTMLElement {
  const elem = document.createElement(tagName);

  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v !== null) {
        elem.setAttribute(k, String(v));
      }
    }
  }

  for (const child of children.flat()) {
    if (child !== null && child !== '') {
      const content = render(child);

      if (Array.isArray(content)) {
        elem.append(...content);
      } else {
        elem.append(content);
      }
    }
  }

  return elem;
}

function render(vnode: VNode): HTMLElement | Text | (HTMLElement | Text)[] {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  } else if (vnode === null) {
    return document.createTextNode('');
  }

  if (Array.isArray(vnode)) {
    return vnode.map((it) => render(it) as any); // TODO!!!
  }

  return renderElem(vnode);
}

function zip<T1, T2>(xs: T1[], ys: T2[]): [T1, T2][] {
  const zipped: [T1, T2][] = [];
  const len = Math.min(xs.length, ys.length);

  for (let i = 0; i < len; i++) {
    zipped.push([xs[i], ys[i]]);
  }

  return zipped;
}

function diffAttrs(oldAttrs: Attrs, newAttrs: Attrs): Patch {
  const patches: Patch[] = [];

  for (const [k, v] of Object.entries(newAttrs)) {
    patches.push(($node) => {
      if (v !== null) {
        $node.setAttribute(k, String(v));
      } else {
        $node.removeAttribute(k);
      }

      return $node;
    });
  }

  for (const k in oldAttrs) {
    if (!(k in newAttrs)) {
      patches.push(($node) => {
        $node.removeAttribute(k);
        return $node;
      });
    }
  }

  return ($node) => {
    for (const patch of patches) {
      patch($node);
    }

    return $node;
  };
}

function diffChildren(oldVChildren: VNode[], newVChildren: VNode[]): Patch {
  const childPatches: Patch[] = [];

  oldVChildren.forEach((oldVChild, i) => {
    childPatches.push(diff(oldVChild, newVChildren[i]));
  });

  const additionalPatches: Patch[] = [];

  for (const additionalVChild of newVChildren
    .slice(oldVChildren.length)
    .flat()) {
    additionalPatches.push(($node) => {
      const content = render(additionalVChild);

      if (Array.isArray(content)) {
        $node.append(...content);
      } else {
        $node.append(content);
      }

      return $node;
    });
  }

  return ($parent) => {
    for (const [patch, $child] of zip(
      childPatches,
      $parent.childNodes as any
    )) {
      // TODO!!!!
      (patch as any)($child); // TODO!!!
    }

    for (const patch of additionalPatches) {
      patch($parent);
    }

    return $parent;
  };
}

function diff(oldVTree: VNode, newVTree: VNode): Patch {
  return (elem) => {
    elem.innerHTML = '';
    const content = render(newVTree);

    if (Array.isArray(content)) {
      elem.replaceChildren(...content);
    } else {
      elem.replaceChildren(content);
    }
  };

  /*
  if (newVTree === null || (Array.isArray(newVTree) && newVTree.length === 0)) {
    return ($node) => {
      $node.innerHTML = '';
    };
  }

  if (typeof oldVTree === 'string' || typeof newVTree === 'string') {
    if (oldVTree !== newVTree) {
      return ($node) => {
        const content = render(newVTree);

        if (Array.isArray(content)) {
          $node.replaceChildren(...content);
        } else {
          $node.replaceChildren(content);
        }
      };
    } else {
      return ($node) => $node;
    }
  }


  if (oldVTree!.tagName !== newVTree!.tagName) {
    // TODO!!!
    // we assume that they are totally different and
    // will not attempt to find the differences.
    // simply render the newVTree and mount it.
    return ($node) => {
      const $newNode = render(newVTree);
      $node.replaceWith($newNode);
      return $newNode;
    };
  }

  // TODO!!!
  const patchAttrs = diffAttrs(oldVTree!.attrs!, newVTree!.attrs!);
  const patchChildren = diffChildren(oldVTree!.children, newVTree!.children);

  return ($node) => {
    patchAttrs($node);
    patchChildren($node);
    return $node;
  };

  */
}
