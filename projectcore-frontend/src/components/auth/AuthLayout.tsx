import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

interface AuthLayoutProps {
  title: string
  subtitle?: string
  onBack?: () => void
  backLabel?: string
  children: React.ReactNode
  /** Ancho máximo de la tarjeta (por defecto max-w-md) */
  maxWidth?: string
}

/**
 * Layout compartido de las páginas de autenticación según el diseño de Figma:
 * fondo degradado #1E3A8A → #6366F1, botón "Volver", encabezado y tarjeta blanca centrada.
 */
export default function AuthLayout({
  title,
  subtitle,
  onBack,
  backLabel = 'Volver',
  children,
  maxWidth = 'max-w-md'
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen auth-gradient text-white flex flex-col relative font-sans">
      <div className="p-6 relative z-20">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 pb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`flex flex-col items-center justify-center w-full ${maxWidth} mx-auto`}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
            {subtitle && <p className="text-white/80">{subtitle}</p>}
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  )
}

/** Tarjeta blanca estándar de los formularios auth */
export function AuthCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white w-full rounded-2xl p-8 shadow-2xl ${className}`}>
      {children}
    </div>
  )
}

/** Mensaje de error de un campo del formulario */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-red-500 text-xs mt-1">{message}</p>
}

/** Banner de error general (p.ej. credenciales inválidas) */
export function ErrorBanner({ message }: { message?: string }) {
  if (!message) return null
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
      {message}
    </div>
  )
}
