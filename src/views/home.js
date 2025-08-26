import { t, get } from '../i18n.js'

export const render = async () => {
  const projects = get('projects.items') || []
  const projHtml = projects.slice(0, 3).map(p => `
    <div class="card hover">
      <h3>${p.title}</h3>
      <p class="form-help">${p.description}</p>
      <a href="#projects" class="btn">${t('actions.viewMore')}</a>
    </div>
  `).join('')
  return `
    <section class="hero">
      <div>
        <h1>${t('home.hero.title')}</h1>
        <p>${t('home.hero.subtitle')}</p>
        <div class="hero-cta">
          <a href="#projects" class="btn primary">${t('home.hero.ctaPrimary')}</a>
          <a href="#about" class="btn ghost">${t('home.hero.ctaSecondary')}</a>
        </div>
      </div>
    </section>
    <section class="section">
      <h2>${t('home.highlights.title')}</h2>
      <p class="lead">${t('home.highlights.subtitle')}</p>
      <div class="grid cols-3">
        <div class="card">
          <h3>${t('home.highlights.cards.0.title')}</h3>
          <p class="form-help">${t('home.highlights.cards.0.body')}</p>
        </div>
        <div class="card">
          <h3>${t('home.highlights.cards.1.title')}</h3>
          <p class="form-help">${t('home.highlights.cards.1.body')}</p>
        </div>
        <div class="card">
          <h3>${t('home.highlights.cards.2.title')}</h3>
          <p class="form-help">${t('home.highlights.cards.2.body')}</p>
        </div>
      </div>
    </section>
    <section class="section">
      <h2>${t('projects.title')}</h2>
      <div class="grid cols-3">${projHtml}</div>
    </section>
  `
}

export const bind = () => {}