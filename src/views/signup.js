import { t } from '../i18n.js'
import { validateEmail, validatePassword, validateRequired, showFieldError, clearFormErrors, withSubmitState } from '../utils/forms.js'
import { signUpEmailPassword, signInWithGoogle } from '../firebase.js'
import { navigateTo } from '../router.js'

export const render = async () => {
  return `
    <section class="section">
      <div class="card" style="max-width:520px;margin:0 auto">
        <h2>${t('auth.signup.title')}</h2>
        <p class="form-help">${t('auth.signup.subtitle')}</p>
        <form id="signupForm" novalidate>
          <div class="form-row">
            <label for="displayName">${t('auth.displayName')}</label>
            <input id="displayName" type="text" autocomplete="name" required placeholder="${t('auth.displayNamePlaceholder')}">
            <div class="input-error"></div>
          </div>
          <div class="form-row">
            <label for="email">${t('auth.email')}</label>
            <input id="email" type="email" autocomplete="email" required placeholder="${t('auth.emailPlaceholder')}">
            <div class="input-error"></div>
          </div>
          <div class="form-row">
            <label for="password">${t('auth.password')}</label>
            <input id="password" type="password" autocomplete="new-password" required placeholder="${t('auth.passwordPlaceholder')}">
            <div class="input-error"></div>
          </div>
          <div class="form-row">
            <button class="btn primary block" id="signupBtn" type="submit" data-loading="${t('actions.signingUp')}">${t('auth.signup.submit')}</button>
          </div>
          <div class="form-row">
            <button class="btn block" id="googleBtn" type="button" data-loading="${t('actions.signingIn')}">${t('auth.google')}</button>
          </div>
          <p class="form-help">${t('auth.verificationNotice')}</p>
        </form>
      </div>
    </section>
  `
}

export const bind = () => {
  const form = document.getElementById('signupForm')
  const signupBtn = document.getElementById('signupBtn')
  const googleBtn = document.getElementById('googleBtn')
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    clearFormErrors(form)
    const displayName = document.getElementById('displayName')
    const email = document.getElementById('email')
    const password = document.getElementById('password')
    let ok = true
    if (!validateRequired(displayName.value)) { showFieldError(displayName, t('errors.required')); ok = false }
    if (!validateEmail(email.value)) { showFieldError(email, t('errors.email')); ok = false }
    if (!validatePassword(password.value)) { showFieldError(password, t('errors.password')); ok = false }
    if (!ok) return
    await withSubmitState(signupBtn, async () => {
      try {
        await signUpEmailPassword(email.value, password.value, displayName.value)
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
}