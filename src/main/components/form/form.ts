import {
  bind,
  elem,
  prop,
  afterInit,
  afterUpdate,
  Attrs,
  Component
} from '../../utils/components'

import { FormSubmitEvent } from '../../events/form-submit-event'

import { classMap, createRef, html, ref } from '../../utils/lit'

// === exports =======================================================

export { Form }

// === Form ==========================================================

@elem({
  tag: 'c-form'
})
class Form extends Component {
  @prop
  onFormSubmit?: () => void

  constructor() {
    super()
  }

  submit() {
    alert('submit')
  }

  render() {
    return html`<slot></slot>`
  }
}
