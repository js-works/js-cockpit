import {
  bind,
  elem,
  prop,
  afterInit,
  afterConnect,
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

    this.addController({
      hostUpdate: () => {
        console.log(`${this.localName} update`)
      },

      hostUpdated: () => {
        console.log(`${this.localName} updated`)
      }
    })

    afterConnect(this, () => {
      console.log('yyy')
      console.log('c-form connected')

      this.addEventListener('xxx', (ev: any) => {
        console.log('xxx event:', ev)
      })
    })
  }

  submit() {
    alert('submitted')
  }

  render() {
    return html`<slot></slot>`
  }
}
