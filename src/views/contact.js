import { t } from '../i18n.js'
import { validateEmail, validateRequired, showFieldError, clearFieldError, clearFormErrors, withSubmitState } from '../utils/forms.js'

export const render = async () => {
  return `
    <section class="section">
      <div class="card">
        <h2>${t('contact.title')}</h2>
        <p class="lead">${t('contact.subtitle')}</p>
        <form id="contactForm" novalidate>
          <div class="form-row">
            <label for="name">${t('contact.form.name')}</label>
            <input id="name" type="text" autocomplete="name" required placeholder="${t('contact.form.namePlaceholder')}">
            <div class="input-error"></div>
          </div>
          <div class="form-row">
            <label for="email">${t('contact.form.email')}</label>
            <input id="email" type="email" autocomplete="email" required placeholder="${t('contact.form.emailPlaceholder')}">
            <div class="input-error"></div>
          </div>
          <div class="form-row">
            <label for="message">${t('contact.form.message')}</label>
            <textarea id="message" required placeholder="${t('contact.form.messagePlaceholder')}"></textarea>
            <div class="input-error"></div>
          </div>
          <div class="form-row">
            <button class="btn primary" id="sendBtn" type="submit" data-loading="${t('actions.sending')}">${t('actions.send')}</button>
            <a class="btn ghost" href="mailto:hello@pasai.online?subject=Hello">${t('contact.emailDirect')}</a>
          </div>
        </form>
      </div>
    </section>
  `
}

export const bind = () => {
  const form = document.getElementById('contactForm')
  const sendBtn = document.getElementById('sendBtn')
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    clearFormErrors(form)
    const name = document.getElementById('name')
    const email = document.getElementById('email')
    const message = document.getElementById('message')
    let ok = true
    if (!validateRequired(name.value)) { showFieldError(name, t('errors.required')); ok = false } else clearFieldError(name)
    if (!validateEmail(email.value)) { showFieldError(email, t('errors.email')); ok = false } else clearFieldError(email)
    if (!validateRequired(message.value)) { showFieldError(message, t('errors.required')); ok = false } else clearFieldError(message)
    if (!ok) return
    await withSubmitState(sendBtn, async () => {
      await new Promise(r => setTimeout(r, 600))
      alert(t('contact.success'))
      form.reset()
    })
  })
}