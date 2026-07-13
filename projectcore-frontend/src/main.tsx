import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
const App = React.lazy(() => import('./App'));
import { Toaster } from './components/ui/toaster'
import './index.css'
import { initTheme } from './lib/theme'
// IMPORTANTE: un único QueryClient compartido en toda la app; si se crean dos,
// las invalidaciones/updates de caché de las páginas no refrescan la UI.
import { queryClient } from './lib/queryClient'

initTheme()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <React.Suspense fallback={<div>Cargando...</div>}>
        <App />
      </React.Suspense>
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>,
)
