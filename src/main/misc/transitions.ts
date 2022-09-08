// === exports =======================================================

export { runOpenVerticalTransition, runCloseVerticalTransition };

// === functions =====================================================

function runOpenVerticalTransition(
  node: HTMLElement,
  duration: string = '0.25s',
  timing = 'ease'
): Promise<void> {
  const oldTransition = node.style.transition;
  const oldMaxHeight = node.style.maxHeight;
  const oldOverflow = node.style.overflow;

  node.style.transition = `max-height ${duration} ${timing}`;
  node.style.maxHeight = node.scrollHeight + 'px';
  node.style.overflow = 'hidden';

  return new Promise((resolve) => {
    node.addEventListener('transitionend', function listener() {
      node.removeEventListener('transitionend', listener);
      node.style.transition = oldTransition;
      node.style.maxHeight = oldMaxHeight;
      node.style.overflow = oldOverflow;
      resolve();
    });
  });
}

function runCloseVerticalTransition(
  node: HTMLElement,
  duration: string = '0.25s',
  timing = 'ease'
): Promise<void> {
  const oldTransition = node.style.transition;
  const oldMaxHeight = node.style.maxHeight;
  const oldOverflow = node.style.overflow;

  node.style.transition = `max-height ${duration} ${timing}`;
  node.style.maxHeight = node.scrollHeight + 'px';
  node.style.overflow = 'hidden';

  setTimeout(() => {
    node.style.maxHeight = '0px';
  });

  return new Promise((resolve) => {
    node.addEventListener('transitionend', function listener() {
      node.removeEventListener('transitionend', listener);
      node.style.transition = oldTransition;
      node.style.maxHeight = oldMaxHeight;
      node.style.overflow = oldOverflow;
      resolve();
    });
  });
}
