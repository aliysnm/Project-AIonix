export const getItem = (k) => {
  try {
    const v = localStorage.getItem(k)
    if (v == null) return null
    return JSON.parse(v)
  } catch {
    return null
  }
}
export const setItem = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v))
  } catch {}
}
export const removeItem = (k) => {
  try {
    localStorage.removeItem(k)
  } catch {}
}