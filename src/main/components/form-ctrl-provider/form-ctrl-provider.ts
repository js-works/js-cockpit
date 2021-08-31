import { component, elem, prop } from 'js-element'
import { FormCtrl } from '../../ctrls/form-ctrl'
import { formCtrlCtx } from '../../ctrls/form-ctrl'

// === exports =======================================================

export { FormCtrlProvider }

// === FormCtrlProvider ==============================================

@elem({
  tag: 'sx-form-ctrl-provider',
  ctx: formCtrlCtx
})
class FormCtrlProvider extends component() {
  @prop
  value?: FormCtrl
}
