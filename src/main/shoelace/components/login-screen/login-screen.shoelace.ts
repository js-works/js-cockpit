// external imports
import { component, html } from 'js-elements'

// internal imports
import { LoginScreenCore } from '../../../core/login-screen/login-screen.core'

// === exports =======================================================

export { LoginScreen }

// === types =========================================================

// === LoginScreen ===================================================

class LoginScreenProps {}

const LoginScreen = component('jsc-login-screen', LoginScreenProps, (p) => {
  const core = new LoginScreenCore({
    handleLogin: () => new Promise<void>(() => {}) // TODO
  })

  return () => core.render()
})
