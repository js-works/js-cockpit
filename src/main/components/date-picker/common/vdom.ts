// Code is based on this article here - many thanks to Jason Yu:
// https://dev.to/ycmjason/building-a-simple-virtual-dom-from-scratch-3d05

export { h, diff, render, renderToString };
export type { VElement, VNode };

type Attrs = Record<string, string | number | null | undefined>;
type Patch = (elem: Element) => Element | Text;

type VElement = {
  tagName: string;
  attrs: Attrs | null;
  children: VNode[];
};

type VNode = string | number | VElement | null | undefined;

function h(
  tagName: string,
  attrs: Attrs | null = null,
  ...children: (VNode | VNode[])[]
): VElement {
  return {
    tagName,
    attrs,
    children: children.flat()
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
    if (vnode == null) {
      return;
    }

    if (typeof vnode === 'string') {
      push(vnode);
    } else if (typeof vnode === 'number') {
      push(String(vnode));
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

function render(velem: VElement): HTMLElement {
  return renderElem(velem);
}

function renderElem({ tagName, attrs, children }: VElement): HTMLElement {
  const elem = document.createElement(tagName);

  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v != null) {
        elem.setAttribute(k, String(v));
      }
    }
  }

  for (const child of children.flat()) {
    if (child !== null && child !== '') {
      elem.append(renderNode(child));
    }
  }

  return elem;
}

function renderNode(vnode: VNode): HTMLElement | Text {
  if (vnode == null) {
    return document.createTextNode('');
  } else if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }

  return renderElem(vnode);
}

function zip<T1, T2>(xs: T1[], ys: T2[]): [T1, T2][] {
  const zipped: [T1, T2][] = [];

  for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
    zipped.push([xs[i], ys[i]]);
  }

  return zipped;
}

function diffAttrs(oldAttrs: Attrs, newAttrs: Attrs): Patch {
  const patches: Patch[] = [];

  for (const [k, v] of Object.entries(newAttrs)) {
    if (v !== null) {
      patches.push(($node) => {
        $node.setAttribute(k, String(v));
        return $node;
      });
    }
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
      $node.appendChild(renderNode(additionalVChild));
      return $node;
    });
  }

  return ($parent) => {
    for (const [patch, $child] of zip(
      childPatches,
      $parent.childNodes as any
    )) {
      // TODO!!!
      patch($child as any); // TODO!!!
    }

    for (const patch of additionalPatches) {
      patch($parent);
    }
    return $parent;
  };
}

function diff(oldVTree: VNode, newVTree: VNode): Patch {
  // TODO!!! ???
  if (oldVTree == null) {
    return ($node) => {
      const content = renderNode(newVTree);
      $node.replaceWith(content);
      return content;
    };
  }

  if (newVTree == null) {
    return ($node) => {
      $node.remove();
      return document.createTextNode(''); // TODO!!!
    };
  }

  if (
    typeof oldVTree === 'string' ||
    typeof oldVTree === 'number' ||
    typeof newVTree === 'string' ||
    typeof newVTree === 'number'
  ) {
    if (oldVTree !== newVTree) {
      return ($node) => {
        const $newNode = renderNode(newVTree);
        $node.replaceWith($newNode);
        return $newNode;
      };
    } else {
      return ($node) => $node;
    }
  }

  if (oldVTree.tagName !== newVTree.tagName) {
    return ($node) => {
      const $newNode = render(newVTree);
      $node.replaceWith($newNode);
      return $newNode;
    };
  }

  const patchAttrs = diffAttrs(oldVTree.attrs || {}, newVTree.attrs || {});
  const patchChildren = diffChildren(oldVTree.children, newVTree.children);

  return ($node) => {
    patchAttrs($node);
    patchChildren($node);
    return $node;
  };
}

// cSpell:words velem vnode
