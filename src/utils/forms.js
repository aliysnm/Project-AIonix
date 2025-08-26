import { disable } from './dom.js'

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(email).toLowerCase())
}

export const validatePassword = (password) => {
  if (!password || password.length < 8) return false
  const hasLetter = /[A-Za-z]/.test(password)
  const hasNumber = /\d/.test(password)
  return hasLetter && hasNumber
}

export const validateRequired = (v) => v != null && String(v).trim().length > 0

export const showFieldError = (inputEl, message) => {
  let msgEl = inputEl.parentElement.querySelector('.input-error')
  if (!msgEl) {
    msgEl = document.createElement('div')
    msgEl.className = 'input-error'
    inputEl.parentElement.appendChild(msgEl)
  }
  msgEl.textContent = message
  inputEl.setAttribute('aria-invalid', 'true')
}

export const clearFieldError = (inputEl) => {
  let msgEl = inputEl.parentElement.querySelector('.input-error')
  if (msgEl) msgEl.textContent = ''
  inputEl.removeAttribute('aria-invalid')
}

export const clearFormErrors = (formEl) => {
  formEl.querySelectorAll('.input-error').forEach(el => el.textContent = '')
  formEl.querySelectorAll('[aria-invalid="true"]').forEach(el => el.removeAttribute('aria-invalid'))
}

export const withSubmitState = async (btn, fn) => {
  const original = btn.textContent
  disable(btn, true)
  btn.textContent = btn.getAttribute('data-loading') || original
  try {
    const res = await fn()
    return res
  } finally {
    btn.textContent = original
    disable(btn, false)
  }
}