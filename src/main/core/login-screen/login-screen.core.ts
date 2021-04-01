// external imports
import { html, VNode } from 'js-element'

// internal imports
import { Localizer } from '../../utils/i18n'

// === types =========================================================

type LoginScreenCoreParams = {
  handleLogin: (data: Record<string, any>) => Promise<void>
}

// === LoginScreenCore ===============================================

export class LoginScreenCore {
  private params: LoginScreenCoreParams

  constructor(params: LoginScreenCoreParams) {
    this.params = params
  }

  render() {
    return html`
      <div class="jsc-loginScreen">
        <div class="jsc-loginScreen-header">
          <slot name="header" />
        </div>
        <div class="jsc-loginScreen-body">
          <div class="jsc-loginScreen-loginIntro"></div>
          <div class="jsc-loginScreen-loginForm"></div>
        </div>
        <div class="jsc-loginScreen-footer">
          <slot name="footer" />
        </div>
      </div>
    `
  }
}
