import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Project Core - Conectando Talento Universitario',
  description: 'Plataforma de conexión entre estudiantes universitarios y empresas usando IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="bg-black text-white">
      <body className={`${inter.className} min-h-screen`}>
        <div className="relative">
          {children}
        </div>
      </body>
    </html>
  )
} 