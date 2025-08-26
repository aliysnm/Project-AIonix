import { store } from './store.js'

let dict = {}
let current = 'en'

const load = async (lang) => {
  const res = await fetch(`i18n/${lang}.json`, { cache: 'no-cache' })
  const data = await res.json()
  return data
}

const applyTexts = () => {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    const val = t(key)
    if (el.hasAttribute('data-i18n-html')) {
      el.innerHTML = val
    } else {
      el.textContent = val
    }
  })
}

export const t = (key) => {
  const parts = key.split('.')
  let cur = dict
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) cur = cur[p]
    else return key
  }
  if (typeof cur === 'string') return cur
  return key
}

export const get = (key) => {
  const parts = key.split('.')
  let cur = dict
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) cur = cur[p]
    else return null
  }
  return cur
}

export const currentLang = () => current

export const initI18n = async (lang) => {
  current = lang
  dict = await load(lang)
  applyTexts()
}

export const setLang = async (lang) => {
  if (lang === current) return
  current = lang
  store.setLang(lang)
  dict = await load(lang)
  applyTexts()
  const { setHeadForRoute, initRouter } = await import('./router.js')
  setHeadForRoute(location.hash || '#home', lang)
  initRouter()
}