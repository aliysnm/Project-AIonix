import { t, currentLang } from './i18n.js'
import { store } from './store.js'

const routes = {
  '#home': { module: () => import('./views/home.js'), titleKey: 'meta.home.title', descKey: 'meta.home.description' },
  '#about': { module: () => import('./views/about.js'), titleKey: 'meta.about.title', descKey: 'meta.about.description' },
  '#projects': { module: () => import('./views/projects.js'), titleKey: 'meta.projects.title', descKey: 'meta.projects.description' },
  '#contact': { module: () => import('./views/contact.js'), titleKey: 'meta.contact.title', descKey: 'meta.contact.description' },
  '#login': { module: () => import('./views/login.js'), titleKey: 'meta.login.title', descKey: 'meta.login.description' },
  '#signup': { module: () => import('./views/signup.js'), titleKey: 'meta.signup.title', descKey: 'meta.signup.description' },
  '#account': { module: () => import('./views/account.js'), titleKey: 'meta.account.title', descKey: 'meta.account.description', protected: true },
  '#privacy': { module: () => import('./views/privacy.js'), titleKey: 'meta.privacy.title', descKey: 'meta.privacy.description' },
  '#terms': { module: () => import('./views/terms.js'), titleKey: 'meta.terms.title', descKey: 'meta.terms.description' },
  '#cookies': { module: () => import('./views/cookies.js'), titleKey: 'meta.cookies.title', descKey: 'meta.cookies.description' }
}

const appEl = () => document.getElementById('app')

const setActiveNav = (hash) => {
  const links = document.querySelectorAll('.nav-link')
  links.forEach(l => {
    if (l.getAttribute('href') === hash) l.classList.add('active')
    else l.classList.remove('active')
  })
}

export const setHeadForRoute = (hash, lang) => {
  const route = routes[hash] || null
  const title = route ? t(route.titleKey) : t('meta.404.title')
  const desc = route ? t(route.descKey) : t('meta.404.description')
  document.title = title
  const md = document.querySelector('meta[name="description"]')
  if (md) md.setAttribute('content', desc)
  const ogt = document.querySelector('meta[property="og:title"]')
  if (ogt) ogt.setAttribute('content', title)
  const ogd = document.querySelector('meta[property="og:description"]')
  if (ogd) ogd.setAttribute('content', desc)
  const can = document.querySelector('link[rel="canonical"]')
  if (can) can.setAttribute('href', location.href)
}

const showLoading = () => {
  appEl().innerHTML = `
    <div class="loading">
      <div class="spinner" aria-hidden="true"></div>
      <div>${t('loading.text')}</div>
    </div>
  `
}

const analytics = {
  page: (path) => {
    if (store.getState().consent) {
      console.log('[analytics] page', path)
    }
  }
}

const renderNotFound = () => {
  appEl().innerHTML = `
    <section class="section">
      <div class="card">
        <h2>${t('notFound.title')}</h2>
        <p class="lead">${t('notFound.body')}</p>
        <a href="#home" class="btn primary">${t('actions.goHome')}</a>
      </div>
    </section>
  `
}

const guard = (hash) => {
  const r = routes[hash]
  if (r && r.protected && !store.getState().user) {
    location.hash = '#login'
    return false
  }
  return true
}

export const navigateTo = (hash) => {
  location.hash = hash
}

const handle = async () => {
  let hash = location.hash || '#home'
  if (!routes[hash]) {
    renderNotFound()
    setHeadForRoute(hash, currentLang())
    setActiveNav('')
    analytics.page('404')
    return
  }
  if (!guard(hash)) return
  setHeadForRoute(hash, currentLang())
  setActiveNav(hash)
  showLoading()
  try {
    const mod = await routes[hash].module()
    const html = await mod.render()
    appEl().innerHTML = html
    if (mod.bind) mod.bind()
    analytics.page(hash)
  } catch (e) {
    renderNotFound()
  }
}

export const initRouter = () => {
  window.addEventListener('hashchange', handle)
  handle()
}