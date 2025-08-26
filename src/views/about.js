import { t } from '../i18n.js'

export const render = async () => {
  return `
    <section class="section">
      <div class="card">
        <h2>${t('about.title')}</h2>
        <p class="lead">${t('about.subtitle')}</p>
        <p>${t('about.body.0')}</p>
        <p>${t('about.body.1')}</p>
        <p>${t('about.body.2')}</p>
      </div>
    </section>
  `
}
export const bind = () => {}