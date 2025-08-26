import { t } from '../i18n.js'
import { validateEmail, validatePassword, showFieldError, clearFormErrors, withSubmitState } from '../utils/forms.js'
import { signInEmailPassword, signInWithGoogle } from '../firebase.js'
import { navigateTo } from '../router.js'

export const render = async () => {
  return `
    <section class="section">
      <div class="card" style="max-width:480px;margin:0 auto">
        <h2>${t('auth.login.title')}</h2>
        <p class="form-help">${t('auth.login.subtitle')}</p>
        <form id="loginForm" novalidate>
          <div class="form-row">
            <label for="email">${t('auth.email')}</label>
            <input id="email" type="email" autocomplete="email" required placeholder="${t('auth.emailPlaceholder')}">
            <div class="input-error"></div>
          </div>
          <div class="form-row">
            <label for="password">${t('auth.password')}</label>
            <input id="password" type="password" autocomplete="current-password" required placeholder="${t('auth.passwordPlaceholder')}">
            <div class="input-error"></div>
          </div>
          <div class="form-row" style="display:flex;justify-content:space-between;align-items:center">
            <a href="#" id="forgotLink">${t('auth.forgot')}</a>
            <a href="#signup">${t('auth.signupPrompt')}</a>
          </div>
          <div class="form-row">
            <button class="btn primary block" id="loginBtn" type="submit" data-loading="${t('actions.signingIn')}">${t('auth.login.submit')}</button>
          </div>
          <div class="form-row">
            <button class="btn block" id="googleBtn" type="button" data-loading="${t('actions.signingIn')}">${t('auth.google')}</button>
          </div>
        </form>
      </div>
    </section>
    <div class="modal" id="forgotModal" aria-modal="true" role="dialog" aria-hidden="true">
      <div class="modal-dialog">
        <h3>${t('auth.forgotTitle')}</h3>
        <p class="form-help">${t('auth.forgotSubtitle')}</p>
        <form id="forgotForm" novalidate>
          <div class="form-row">
            <label for="forgotEmail">${t('auth.email')}</label>
            <input id="forgotEmail" type="email" autocomplete="email" required placeholder="${t('auth.emailPlaceholder')}">
            <div class="input-error"></div>
          </div>
          <div class="form-row" style="display:flex;gap:8px;justify-content:flex-end">
            <button class="btn ghost" type="button" id="closeForgot">${t('actions.cancel')}</button>
            <button class="btn primary" type="submit" id="forgotBtn" data-loading="${t('actions.sending')}">${t('actions.send')}</button>
          </div>
        </form>
      </div>
    </div>
  `
}

export const bind = () => {
  const form = document.getElementById('loginForm')
  const loginBtn = document.getElementById('loginBtn')
  const googleBtn = document.getElementById('googleBtn')
  const forgotLink = document.getElementById('forgotLink')
  const modal = document.getElementById('forgotModal')
  const closeForgot = document.getElementById('closeForgot')
  const forgotForm = document.getElementById('forgotForm')
  const forgotBtn = document.getElementById('forgotBtn')

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    clearFormErrors(form)
    const email = document.getElementById('email')
    const password = document.getElementById('password')
    let ok = true
    if (!validateEmail(email.value)) { showFieldError(email, t('errors.email')); ok = false }
    if (!validatePassword(password.value)) { showFieldError(password, t('errors.password')); ok = false }
    if (!ok) return
    await withSubmitState(loginBtn, async () => {
      try {
        await signInEmailPassword(email.value, password.value)
        navigateTo('#account')
      } catch (e) {
        alert(t('errors.auth'))
      }
    })
  })

  googleBtn.addEventListener('click', async () => {
    await withSubmitState(googleBtn, async () => {
      try {
        await signInWithGoogle()
        navigateTo('#account')
      } catch (e) {
        alert(t('errors.auth'))
      }
    })
  })

  forgotLink.addEventListener('click', (e) => {
    e.preventDefault()
    modal.classList.add('open')
    modal.setAttribute('aria-hidden', 'false')
  })
  closeForgot.addEventListener('click', () => {
    modal.classList.remove('open')
    modal.setAttribute('aria-hidden', 'true')
  })
  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const { sendPasswordReset } = await import('../firebase.js')
    const email = document.getElementById('forgotEmail')
    if (!validateEmail(email.value)) { showFieldError(email, t('errors.email')); return }
    await withSubmitState(forgotBtn, async () => {
      try {
        await sendPasswordReset(email.value)
        alert(t('auth.forgotSuccess'))
        modal.classList.remove('open')
        modal.setAttribute('aria-hidden', 'true')
      } catch (e) {
        alert(t('errors.auth'))
      }
    })
  })
}