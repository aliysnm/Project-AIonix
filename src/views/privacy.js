import { t } from '../i18n.js'

export const render = async () => {
  return `
    <section class="section">
      <div class="card">
        <h2>${t('privacy.title')}</h2>
        <div class="form-help" data-i18n="privacy.updated"></div>
        <div data-i18n="privacy.content" data-i18n-html></div>
      </div>
    </section>
  `
}
export const bind = () => {}