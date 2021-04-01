// external imports
import { define, html } from 'js-element'

// internal imports
import { LoginScreenCore } from '../../../core/login-screen/login-screen.core'

// === exports =======================================================

export { LoginScreen }

// === types =========================================================

// === LoginScreen ===================================================

class LoginScreenProps {}

const LoginScreen = define('jsc-login-screen', LoginScreenProps, (p) => {
  const core = new LoginScreenCore({
    handleLogin: () => new Promise<void>(() => {}) // TODO
  })

  return () => core.render()
})
