import { t } from '../i18n.js'
import { store } from '../store.js'
import { updateUserProfile } from '../firebase.js'

export const render = async () => {
  const u = store.getState().user
  return `
    <section class="section">
      <div class="card" style="max-width:640px;margin:0 auto">
        <h2>${t('account.title')}</h2>
        ${!u?.emailVerified ? `<div class="form-help" style="color:#f59e0b">${t('account.verifyNotice')}</div>` : ''}
        <div style="display:flex;gap:16px;align-items:center;margin:16px 0">
          <img src="${u?.photoURL || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + encodeURIComponent(u?.email || 'user')}" alt="avatar" width="64" height="64" style="border-radius:50%;border:1px solid var(--border)">
          <div>
            <div style="font-weight:700">${u?.displayName || t('account.noName')}</div>
            <div class="form-help">${u?.email || ''}</div>
          </div>
        </div>
        <form id="profileForm" novalidate>
          <div class="form-row">
            <label for="displayName">${t('auth.displayName')}</label>
            <input id="displayName" type="text" value="${u?.displayName || ''}" placeholder="${t('auth.displayNamePlaceholder')}">
            <div class="input-error"></div>
          </div>
          <div class="form-row">
            <label for="photoURL">${t('account.photoURL')}</label>
            <input id="photoURL" type="text" value="${u?.photoURL || ''}" placeholder="${t('account.photoURLPlaceholder')}">
            <div class="input-error"></div>
          </div>
          <div class="form-row">
            <button class="btn primary" id="saveProfile" type="submit" data-loading="${t('actions.saving')}">${t('actions.save')}</button>
          </div>
        </form>
      </div>
    </section>
  `
}

export const bind = () => {
  const form = document.getElementById('profileForm')
  const btn = document.getElementById('saveProfile')
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const displayName = document.getElementById('displayName').value.trim()
    const photoURL = document.getElementById('photoURL').value.trim()
    btn.disabled = true
    const text = btn.textContent
    btn.textContent = btn.getAttribute('data-loading') || text
    try {
      await updateUserProfile({ displayName, photoURL })
      alert(t('account.saved'))
    } catch (e) {
      alert(t('errors.general'))
    } finally {
      btn.disabled = false
      btn.textContent = text
    }
  })
}