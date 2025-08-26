import { get, t } from '../i18n.js'

export const render = async () => {
  const items = get('projects.items') || []
  const list = items.map(p => `
    <div class="card hover">
      <h3>${p.title}</h3>
      <p class="form-help">${p.description}</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${p.url ? `<a class="btn" href="${p.url}" target="_blank" rel="noopener">${t('actions.viewMore')}</a>` : `<a href="#contact" class="btn primary">${t('actions.viewMore')}</a>`}
      </div>
    </div>
  `).join('')
  return `
    <section class="section">
      <h2>${t('projects.title')}</h2>
      <p class="lead">${t('projects.subtitle')}</p>
      <div class="grid cols-3">${list}</div>
    </section>
  `
}
export const bind = () => {}