'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const menuItems = [
  { name: 'Inicio', href: '#hero' },
  { name: 'Qué Hacemos', href: '#que-hacemos' },
  { name: 'Impacto', href: '#impacto' },
  { name: 'Cómo Funciona', href: '#como-funciona' },
  { name: 'Testimonios', href: '#testimonios' },
  { name: 'FAQs', href: '#faq' },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-lg' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="#hero" className="flex items-center space-x-2 text-white text-xl font-bold">
              <img
                src="/images/logoCircular.png"
                alt="Project Core Logo"
                style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                className="w-8 h-8"
              />
              <span>
                PROJECT CORE
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(item.href)
                  }}
                  className="text-gray-300 hover:text-white px-4 py-2 text-base font-semibold transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
              <a
                href="/chambea-ya"
                className="bg-gradient-to-r from-violet-500/90 via-fuchsia-600/90 to-violet-700/90 text-white px-6 py-2 rounded-lg text-sm font-bold tracking-wider shadow-lg hover:from-fuchsia-600/90 hover:to-violet-800/90 hover:shadow-violet-500/20 transition-all duration-1000 animate-pulse animate-duration-[15s] ring-1 ring-violet-400/10 ring-offset-1 ring-offset-black/30"
              >
                ¡Registrate Ya!
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-black/95 backdrop-blur-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(item.href)
                  }}
                  className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
              <a
                href="/chambea-ya"
                className="bg-gradient-to-r from-violet-500/90 via-fuchsia-600/90 to-violet-700/90 text-white px-6 py-3 rounded-lg text-base font-bold tracking-wider shadow-lg hover:from-fuchsia-600/90 hover:to-violet-800/90 hover:shadow-violet-500/20 transition-all duration-1000 animate-pulse animate-duration-[15s] ring-1 ring-violet-400/10 ring-offset-1 ring-offset-black/30 block text-center mt-4"
              >
                ¡Registrate Ya!
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
} 