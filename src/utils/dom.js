export const qs = (sel, root = document) => root.querySelector(sel)
export const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel))
export const on = (el, evt, fn) => el.addEventListener(evt, fn)
export const setText = (el, v) => { el.textContent = v; return el }
export const setHTML = (el, v) => { el.innerHTML = v; return el }
export const setAttr = (el, k, v) => { el.setAttribute(k, v); return el }
export const disable = (el, v = true) => { el.disabled = v; return el }
export const val = (el) => el.value
export const byId = (id) => document.getElementById(id)