import { getItem, setItem } from './utils/storage.js'

const subscribers = []

const initial = {
  user: null,
  theme: getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  lang: getItem('lang') || 'en',
  consent: getItem('consent') || false
}

let state = { ...initial }

const notify = () => subscribers.forEach(fn => fn({ ...state }))

export const store = {
  subscribe(fn) {
    subscribers.push(fn)
    fn({ ...state })
    return () => {
      const i = subscribers.indexOf(fn)
      if (i >= 0) subscribers.splice(i, 1)
    }
  },
  getState() {
    return { ...state }
  },
  setUser(user) {
    state.user = user
    notify()
  },
  setTheme(theme) {
    state.theme = theme
    setItem('theme', theme)
    notify()
  },
  setLang(lang) {
    state.lang = lang
    setItem('lang', lang)
    notify()
  },
  setConsent(consent) {
    state.consent = !!consent
    setItem('consent', !!consent)
    notify()
  }
}