export { h, diff, render, renderToString };
export type { VElement, VNode };

type Attrs = Record<string, string | number | null>;
type Patch = (elem: HTMLElement) => HTMLElement | Text | undefined;

type VElement = {
  tagName: string;
  attrs: Attrs | null;
  children: VNode[];
};

type VNode = null | string | VElement | (null | string | VElement)[];

function h(tagName: string, attrs: Attrs | null = null, ...children: VNode[]) {
  return {
    tagName,
    attrs,
    children
  };
}

function renderToString(vnode: VNode): string {
  return '';

  /*
  if (vnode === null) {
    return '';
  }

  if (typeof vnode === 'string') {
    return vnode;
  } else if (typeof vnode === 'number') {
    return String(vnode);
  }

  const elem = renderElem(vnode); // TODO!!!

  return elem.outerHTML;
  */
}

function renderElem({ tagName, attrs, children }: VElement): HTMLElement {
  const elem = document.createElement(tagName);

  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      if (value !== null) {
        elem.setAttribute(key, String(value));
      }
    }
  }

  for (const child of children) {
    if (child !== null) {
      elem.appendChild(render(child));
    }
  }

  return elem;
}

function render(vnode: VNode): HTMLElement | Text {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  } else if (vnode === null) {
    return document.createTextNode('');
  }

  return renderElem(vnode);
}

function zip(xs: unknown[], ys: unknown[]) {
  const zipped = [];
  for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
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

  for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
    additionalPatches.push(($node) => {
      $node.appendChild(render(additionalVChild));
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
  // let's assume oldVTree is not undefined!
  if (newVTree === undefined) {
    return ($node) => {
      $node.remove();
      return undefined;
    };
  }

  if (typeof oldVTree === 'string' || typeof newVTree === 'string') {
    if (oldVTree !== newVTree) {
      // could be 2 cases:
      // 1. both trees are string and they have different values
      // 2. one of the trees is text node and
      //    the other one is elem node
      // Either case, we will just render(newVTree)!
      return ($node) => {
        const $newNode = render(newVTree);
        $node.replaceWith($newNode);
        return $newNode;
      };
    } else {
      // this means that both trees are string
      // and they have the same values
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
}
