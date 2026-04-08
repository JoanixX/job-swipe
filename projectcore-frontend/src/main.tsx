import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const App = React.lazy(() => import('./App'));
import { AuthProvider } from './hooks/use-auth'
import { Toaster } from './components/ui/toaster'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <React.Suspense fallback={<div>Cargando...</div>}>
          <App />
        </React.Suspense>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
