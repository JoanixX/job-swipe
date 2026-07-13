import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { getTheme, applyTheme, Theme } from '../lib/theme'

interface ThemeToggleProps {
  /** true = botón compacto solo icono; false = fila con etiqueta (sidebar) */
  compact?: boolean
}

export default function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(getTheme())

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }

  if (compact) {
    return (
      <button
        onClick={toggle}
        aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        className="w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        {theme === 'dark'
          ? <Sun className="h-5 w-5 text-amber-400" />
          : <Moon className="h-5 w-5 text-gray-500" />}
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      {theme === 'dark'
        ? <Sun className="w-5 h-5 text-amber-400" />
        : <Moon className="w-5 h-5 text-gray-400" />}
      {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
    </button>
  )
}
