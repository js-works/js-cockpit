// === exports =======================================================

export { runOpenVerticalTransition, runCloseVerticalTransition }

// === functions =====================================================

function runOpenVerticalTransition(
  node: HTMLElement,
  duration: string = '0.25s',
  timing = 'ease'
): Promise<void> {
  node.style.transition = `max-height ${duration} ${timing}`
  node.style.maxHeight = node.scrollHeight + 'px'
  node.style.overflow = 'hidden'

  return new Promise((resolve) => {
    node.addEventListener('transitionend', function listener() {
      node.removeEventListener('transitionend', listener)
      node.style.transition = ''
      node.style.maxHeight = ''
      node.style.overflow = ''
      resolve()
    })
  })
}

function runCloseVerticalTransition(
  node: HTMLElement,
  duration: string = '0.25s',
  timing = 'ease'
): Promise<void> {
  node.style.transition = `max-height ${duration} ${timing}`
  node.style.maxHeight = node.scrollHeight + 'px'
  node.style.overflow = 'hidden'

  setTimeout(() => {
    node.style.maxHeight = '0px'
  })

  return new Promise((resolve) => {
    node.addEventListener('transitionend', function listener() {
      node.removeEventListener('transitionend', listener)
      node.style.transition = ''
      node.style.maxHeight = ''
      node.style.overflow = ''
      resolve()
    })
  })
}
