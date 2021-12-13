// external imports
import { component, elem, prop, Attrs } from 'js-element'
import { classMap, html, lit } from 'js-element/lit'

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlInput from '@shoelace-style/shoelace/dist/components/input/input'

// styles
import controlStyles from '../../shared/css/control.css'
import emailFieldStyles from './email-field.css'

// icons
import emailIcon from '../../icons/envelope.svg'

// === exports =======================================================

export { EmailField }

// === types =========================================================

// === EmailField =====================================================

@elem({
  tag: 'c-email-field',
  styles: [controlStyles, emailFieldStyles],
  uses: [SlIcon, SlInput],
  impl: lit(emailFieldImpl)
})
class EmailField extends component<{
  reset(): void
}>() {
  @prop({ attr: Attrs.string })
  name = ''

  @prop({ attr: Attrs.string })
  value = ''

  @prop({ attr: Attrs.string })
  label = ''

  @prop({ attr: Attrs.boolean })
  disabled = false

  @prop({ attr: Attrs.boolean })
  required = false
}

function emailFieldImpl(self: EmailField) {
  return () => html`
    <div class="base ${classMap({ required: self.required })}">
      <div class="field-wrapper">
        <div class="label">${self.label}</div>
        <div class="control">
          <sl-input type="email" name=${self.name} toggle-email class="input">
            <div slot="suffix">
              <sl-icon src=${emailIcon} class="icon"></sl-icon>
            </div>
          </sl-input>
        </div>
      </div>
    </div>
  `
}
