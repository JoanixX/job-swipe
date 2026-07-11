import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { Sparkles, SlidersHorizontal, Users, Zap, CheckCircle2, Shield, ArrowRight, X, Heart, Briefcase, GraduationCap } from 'lucide-react'
import Logo from '../components/Logo'

// Componente Navbar
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Logo size="md" />
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#como-funciona" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">¿Cómo funciona?</a>
            <a href="#para-estudiantes" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Para Estudiantes</a>
            <a href="#para-empresas" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Para Empresas</a>
            
            <div className="flex items-center gap-4 ml-4">
              <Link href="/login">
                <a className="text-[#4F6CDB] font-semibold px-4 py-2 border border-[#4F6CDB] rounded-xl hover:bg-[#4F6CDB]/5 transition-colors">
                  Iniciar Sesión
                </a>
              </Link>
              <Link href="/simple-register-student">
                <a className="bg-[#4F6CDB] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#4F6CDB]/90 transition-colors">
                  Regístrate gratis
                </a>
              </Link>
            </div>
          </div>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 bg-white">
            <div className="flex flex-col space-y-4 px-4">
              <a href="#como-funciona" className="text-gray-600 hover:text-[#4F6CDB]">¿Cómo funciona?</a>
              <a href="#para-estudiantes" className="text-gray-600 hover:text-[#4F6CDB]">Para Estudiantes</a>
              <a href="#para-empresas" className="text-gray-600 hover:text-[#4F6CDB]">Para Empresas</a>
              <Link href="/login">
                <a className="text-[#4F6CDB] font-semibold border border-[#4F6CDB] rounded-xl py-2 text-center">Iniciar Sesión</a>
              </Link>
              <Link href="/simple-register-student">
                <a className="bg-[#4F6CDB] text-white px-6 py-2.5 rounded-xl font-medium text-center">Regístrate gratis</a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// Phone Mockup Component for Hero
const PhoneMockup = () => {
  return (
    <div className="relative w-[320px] h-[640px] mx-auto md:ml-auto perspective-1000">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full h-full bg-[#1E3A8A] rounded-[40px] p-3 shadow-2xl border-8 border-[#1E3A8A] relative overflow-hidden"
      >
        <div className="bg-white w-full h-full rounded-[32px] overflow-hidden flex flex-col relative">
          
          {/* Status Bar */}
          <div className="h-12 bg-[#1E3A8A] w-full flex justify-between items-center px-6 text-white text-xs font-medium">
            <span>9:41</span>
            <div className="w-16 h-4 bg-white/20 rounded-full" />
          </div>

          {/* App Header */}
          <div className="text-center py-4 text-[#1E3A8A] font-bold text-lg">
            InternMatch
          </div>

          {/* Tinder Card */}
          <motion.div 
            className="flex-1 mx-4 mb-4 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col"
            initial={{ rotate: -5, scale: 0.95 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="h-1/2 bg-[#4F6CDB] flex items-center justify-center">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-xl text-gray-900 mb-1">Desarrollador Frontend Jr.</h3>
              <p className="text-sm text-gray-500 mb-4">Google · Miraflores, Lima</p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">React</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">TypeScript</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">Tailwind</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 pb-6 pt-2">
            <button className="w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center text-red-400 shadow-sm">
              <X className="w-6 h-6" />
            </button>
            <button className="w-24 h-14 bg-[#4F6CDB] rounded-full flex items-center justify-center text-white shadow-md">
              <Heart className="w-6 h-6 fill-current" />
            </button>
          </div>

          {/* Match Toast Notification */}
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
            className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-[#4F6CDB] to-[#6b85e6] p-4 rounded-2xl flex items-center gap-3 text-white shadow-lg"
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 fill-current text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">¡Es un Match!</p>
              <p className="text-xs text-white/80">Google quiere contactarte</p>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  )
}

export default function Home() {
  const [, setLocation] = useLocation()

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans selection:bg-[#4F6CDB] selection:text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[#4F6CDB] font-medium text-sm mb-6 border border-blue-100">
              <Sparkles className="w-4 h-4" />
              Powered by Inteligencia Artificial
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] text-[#1E3A8A] mb-6">
              El match perfecto para tus <span className="text-[#849BFF]">prácticas profesionales</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Conectamos estudiantes universitarios con las mejores empresas mediante Inteligencia Artificial. Sube tu CV, desliza y empieza a trabajar.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <button 
                onClick={() => setLocation('/login?type=student')}
                className="flex items-center justify-center gap-2 bg-[#4F6CDB] hover:bg-[#3b57c9] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-colors"
              >
                <GraduationCap className="w-5 h-5" />
                Soy Estudiante
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>
              <button 
                onClick={() => setLocation('/login?type=company')}
                className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#1E3A8A] border-2 border-[#1E3A8A]/20 px-8 py-4 rounded-2xl font-bold text-lg transition-colors"
              >
                <Briefcase className="w-5 h-5" />
                Soy Empresa
              </button>
            </div>
            <p className="text-sm text-gray-400">Sin tarjeta de crédito · Gratis para estudiantes</p>
          </motion.div>

          <div className="relative">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-[#4F6CDB]/10 to-transparent rounded-full blur-3xl -z-10" />
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="py-4">
              <h3 className="text-4xl font-extrabold text-[#1E3A8A] mb-2">50k+</h3>
              <p className="text-gray-500 font-medium">Estudiantes registrados</p>
            </div>
            <div className="py-4">
              <h3 className="text-4xl font-extrabold text-[#1E3A8A] mb-2">1,200+</h3>
              <p className="text-gray-500 font-medium">Empresas activas</p>
            </div>
            <div className="py-4">
              <h3 className="text-4xl font-extrabold text-[#1E3A8A] mb-2">92%</h3>
              <p className="text-gray-500 font-medium">Tasa de satisfacción</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-[#1E3A8A] mb-4">¿Cómo funciona?</h2>
            <p className="text-lg text-gray-500">Cuatro pasos simples para encontrar tu match perfecto</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center flex flex-col items-center group">
              <div className="w-20 h-20 bg-[#4F6CDB] text-white rounded-2xl shadow-xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1E3A8A] mb-3">Sube tu CV</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                La IA extrae automáticamente tus habilidades, experiencia y preferencias del documento.
              </p>
            </div>

            <div className="text-center flex flex-col items-center group">
              <div className="w-20 h-20 bg-[#4F6CDB] text-white rounded-2xl shadow-xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#1E3A8A] mb-3">Filtra preferencias</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Define sueldo pretendido, modalidad (remoto/híbrido) y distritos de Lima.
              </p>
            </div>

            <div className="text-center flex flex-col items-center group">
              <div className="w-20 h-20 bg-[#4F6CDB] text-white rounded-2xl shadow-xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#1E3A8A] mb-3">Haz Swipe</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Desliza a la derecha si te interesa, a la izquierda para pasar. Así de simple.
              </p>
            </div>

            <div className="text-center flex flex-col items-center group">
              <div className="w-20 h-20 bg-[#4F6CDB] text-white rounded-2xl shadow-xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#1E3A8A] mb-3">¡Match!</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Se habilita el contacto directo entre el reclutador y tú. A trabajar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Students Section */}
      <section id="para-estudiantes" className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100/50 text-[#4F6CDB] font-medium text-sm mb-6">
              <GraduationCap className="w-4 h-4" />
              Para Estudiantes
            </div>
            <h2 className="text-4xl font-extrabold text-[#1E3A8A] mb-4">Lleva tu búsqueda de prácticas al siguiente nivel</h2>
            <p className="text-lg text-gray-500">Deja de enviar CVs al vacío. Conoce tu compatibilidad antes de aplicar.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#849BFF] rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1E3A8A] mb-3">IA de Afinidades</h3>
              <p className="text-gray-500 leading-relaxed">
                No más postulaciones a ciegas. Descubre qué tan compatible eres con cada puesto antes de aplicar.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#1E3A8A] rounded-2xl flex items-center justify-center mb-6">
                <SlidersHorizontal className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1E3A8A] mb-3">Filtros Reales</h3>
              <p className="text-gray-500 leading-relaxed">
                Busca por lo que te importa: sueldo pretendido, modalidad remota o híbrida, y distritos cercanos.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#849BFF] rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1E3A8A] mb-3">Seguimiento Transparente</h3>
              <p className="text-gray-500 leading-relaxed">
                Olvídate del silencio de los reclutadores. Mira el estado de tus postulaciones en tiempo real.
              </p>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={() => setLocation('/login?type=student')}
              className="inline-flex items-center justify-center gap-2 bg-[#4F6CDB] hover:bg-[#3b57c9] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-colors shadow-lg shadow-[#4F6CDB]/20"
            >
              Registrarme como Estudiante
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* For Companies Section */}
      <section id="para-empresas" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Dashboard Mockup */}
            <div className="bg-white border border-gray-100 rounded-3xl shadow-2xl p-6 relative overflow-hidden">
              <div className="flex gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs font-mono text-gray-400">Dashboard Corporativo - InternMatch</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-sm text-gray-500 mb-1">Candidatos</p>
                  <p className="text-2xl font-bold text-[#1E3A8A]">248</p>
                  <p className="text-xs text-green-500 mt-1">+12%</p>
                </div>
                <div className="bg-blue-50/50 p-4 rounded-2xl">
                  <p className="text-sm text-gray-500 mb-1">Matches</p>
                  <p className="text-2xl font-bold text-[#1E3A8A]">34</p>
                  <p className="text-xs text-green-500 mt-1">+8%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-sm text-gray-500 mb-1">En proceso</p>
                  <p className="text-2xl font-bold text-[#1E3A8A]">17</p>
                  <p className="text-xs text-green-500 mt-1">+3%</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Ana García', role: 'Frontend Jr.', match: '94%', label: 'Match', color: 'bg-green-100 text-green-700' },
                  { name: 'Carlos Ruiz', role: 'Data Analyst', match: '87%', label: 'En revisión', color: 'bg-yellow-100 text-yellow-700' },
                  { name: 'Sofía López', role: 'UX Designer', match: '81%', label: 'Nuevo', color: 'bg-blue-100 text-blue-700' }
                ].map((candidate, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold">
                        {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{candidate.name}</h4>
                        <p className="text-xs text-gray-500">{candidate.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-[#1E3A8A]">{candidate.match}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${candidate.color}`}>
                        {candidate.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-[#1E3A8A] mb-10 leading-tight">
                Reclutamiento inteligente bajo la Ley de Modalidades Formativas
              </h2>

              <div className="space-y-8 mb-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#4F6CDB] text-white flex items-center justify-center shrink-0 shadow-lg">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1E3A8A] mb-2">Filtro Automático por IA</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Recibe solo candidatos que cumplan con más del 30% de las habilidades técnicas requeridas.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 shadow-lg">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1E3A8A] mb-2">Gestión en un Clic</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Acepta o descarta postulantes rápidamente. Automatizamos los correos de descarte por ti.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#4F6CDB] text-white flex items-center justify-center shrink-0 shadow-lg">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1E3A8A] mb-2">Cumplimiento Legal</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Ofertas estructuradas y listas para captar el mejor talento universitario dentro del marco legal.
                    </p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setLocation('/login?type=company')}
                className="inline-flex items-center justify-center gap-2 bg-[#4F6CDB] hover:bg-[#3b57c9] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-colors shadow-lg shadow-[#4F6CDB]/20"
              >
                Registrar mi Empresa
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>
            </div>
            
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E3A8A] text-white pt-16 pb-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Logo size="md" />
              </div>
              <p className="text-white/60 max-w-sm">
                Conectando el talento universitario con las empresas del futuro mediante Inteligencia Artificial.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Plataforma</h4>
              <ul className="space-y-2">
                <li><a href="#como-funciona" className="text-white/60 hover:text-white transition-colors">¿Cómo funciona?</a></li>
                <li><a href="#para-estudiantes" className="text-white/60 hover:text-white transition-colors">Para Estudiantes</a></li>
                <li><a href="#para-empresas" className="text-white/60 hover:text-white transition-colors">Para Empresas</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legal & Soporte</h4>
              <ul className="space-y-2">
                <li><Link href="/terminos-servicio"><a className="text-white/60 hover:text-white transition-colors">Términos de Servicio</a></Link></li>
                <li><Link href="/politica-privacidad"><a className="text-white/60 hover:text-white transition-colors">Política de Privacidad</a></Link></li>
                <li><a href="mailto:soporte@jobswipe.com" className="text-white/60 hover:text-white transition-colors">Soporte</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-white/40 text-sm">
            <p>© {new Date().getFullYear()} JobSwipe. Todos los derechos reservados.</p>
            <p className="mt-2 md:mt-0">Hecho con ❤️ en Perú</p>
          </div>
        </div>
      </footer>
    </div>
  )
}