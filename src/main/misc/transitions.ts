// === exports =======================================================

export { runOpenVerticalTransition, runCloseVerticalTransition }

// === functions =====================================================

function runOpenVerticalTransition(
  node: HTMLElement,
  duration: string = '0.25s',
  timing = 'ease'
) {
  node.style.transition = `max-height ${duration} ${timing}`
  node.style.maxHeight = node.scrollHeight + 'px'
  node.style.overflow = 'hidden'

  node.addEventListener('transitionend', function listener() {
    node.removeEventListener('transitionend', listener)
    node.style.transition = ''
    node.style.maxHeight = ''
    node.style.overflow = ''
  })
}

function runCloseVerticalTransition(
  node: HTMLElement,
  duration: string = '0.25s',
  timing = 'ease'
) {
  node.style.transition = `max-height ${duration} ${timing}`
  node.style.maxHeight = node.scrollHeight + 'px'
  node.style.overflow = 'hidden'

  setTimeout(() => {
    node.style.maxHeight = '0px'
  })

  node.addEventListener('transitionend', function listener() {
    node.removeEventListener('transitionend', listener)
    node.style.transition = ''
    node.style.maxHeight = ''
    node.style.overflow = ''
  })
}
