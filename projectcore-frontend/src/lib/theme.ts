// Modo claro/oscuro: alterna la clase `dark` en <html> y persiste en localStorage.
const STORAGE_KEY = 'jobswipe_theme'

export type Theme = 'light' | 'dark'

export function getTheme(): Theme {
  return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light'
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  localStorage.setItem(STORAGE_KEY, theme)
}

export function initTheme() {
  applyTheme(getTheme())
}
