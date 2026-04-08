'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDownIcon, RocketLaunchIcon, UserGroupIcon, DocumentTextIcon, ShieldCheckIcon, ClockIcon, ChatBubbleLeftRightIcon, ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

// FAQ Item Component
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4 rounded-xl overflow-hidden border border-gray-700/50"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left p-6 transition-all duration-300 ${
          isOpen 
            ? 'bg-gradient-to-r from-[#0EA5FF]/20 to-[#7C3AED]/20' 
            : 'bg-gradient-to-r from-[#0B1226]/80 to-[#0B1226]/60 hover:from-[#0B1226]/90 hover:to-[#0B1226]/70'
        }`}
      >
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-white">{question}</span>
          <motion.span 
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-8 h-8 rounded-full bg-[#0EA5FF]/30 flex items-center justify-center"
          >
            <ChevronDownIcon className="w-5 h-5 text-[#0EA5FF]" />
          </motion.span>
        </div>
      </button>
      <motion.div
        initial={false}
        animate={isOpen ? 'open' : 'collapsed'}
        variants={{
          open: { 
            opacity: 1, 
            height: 'auto',
            padding: '1.5rem',
            marginTop: '0px',
            background: 'linear-gradient(135deg, rgba(14, 165, 255, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
            borderRadius: '0 0 0.75rem 0.75rem'
          },
          collapsed: { 
            opacity: 0, 
            height: 0,
            padding: '0 1.5rem',
            marginTop: '0px',
            background: 'transparent'
          }
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <p className="text-gray-200 leading-relaxed">{answer}</p>
      </motion.div>
    </motion.div>
  );
};

// Chamby Widget Component
const ChambyWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hola, soy Chamby — ¿necesitas talento para este reto?', isBot: true }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = { id: Date.now(), text: message, isBot: false };
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    // Simular respuesta del bot
    setTimeout(() => {
      const botResponse = { id: Date.now() + 1, text: '¡Perfecto! Te ayudo a encontrar el talento ideal para tu proyecto. ¿Qué tipo de habilidades necesitas?', isBot: true };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="mb-4 w-80 h-96 bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl"
        >
          <div className="p-4 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-fuchsia-500 to-violet-500 rounded-full flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Chamby</h3>
                  <p className="text-xs text-gray-400">Asistente IA</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-4 h-64 overflow-y-auto space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    msg.isBot
                      ? 'bg-gray-700/50 text-white'
                      : 'bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-700/50">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe tu mensaje..."
                className="flex-1 bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-fuchsia-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white p-2 rounded-lg hover:from-fuchsia-600 hover:to-violet-600 transition-all"
              >
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
      
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-fuchsia-500 to-violet-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
};

// Navigation Component
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <img
              src="/images/logoCircular.png"
              alt="Project Core Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-xl font-bold text-white">Project Core</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#que-hacemos" className="text-gray-300 hover:text-white transition-colors">¿Qué hacemos?</a>
            <a href="#como-funciona" className="text-gray-300 hover:text-white transition-colors">Cómo funciona</a>
            <a href="#quienes-somos" className="text-gray-300 hover:text-white transition-colors">¿Quiénes somos?</a>
            <a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
            <a href="/register" className="bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white px-6 py-2 rounded-lg hover:from-fuchsia-600 hover:to-violet-600 transition-all">
              Únete a la lista
            </a>
          </div>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700/50">
            <div className="flex flex-col space-y-4">
              <a href="#que-hacemos" className="text-gray-300 hover:text-white transition-colors">¿Qué hacemos?</a>
              <a href="#como-funciona" className="text-gray-300 hover:text-white transition-colors">Cómo funciona</a>
              <a href="#quienes-somos" className="text-gray-300 hover:text-white transition-colors">¿Quiénes somos?</a>
              <a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
              <a href="/register" className="bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white px-6 py-2 rounded-lg hover:from-fuchsia-600 hover:to-violet-600 transition-all text-center">
                Únete a la lista
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Rocket Animation Component
const RocketAnimation = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible">
      <motion.div
        className="absolute z-10"
        initial={{ x: 0, rotate: 0 }}
        animate={{ x: [-8, 8, -8] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ left: '35%', top: '-15%', transform: 'translate(-50%, -50%) rotate(30deg) scale(0.85)' }}
      >
        {/* Flame halo */}
        <motion.div 
          className="absolute left-1/2 top-1/2 w-[420px] h-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-orange-400/30 via-orange-600/20 to-transparent blur-3xl" 
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }} 
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          }} 
        />
        {/* Additional flame glow */}
        <motion.div 
          className="absolute left-1/2 top-1/2 w-[380px] h-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-red-500/20 via-orange-500/10 to-transparent blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <svg viewBox="0 0 120 320" width="260" height="700" className="drop-shadow-[0_10px_25px_rgba(138,83,255,0.35)]">
          <defs>
            <radialGradient id="rocketPurple" cx="50%" cy="0%" r="100%">
              <stop offset="0%" stopColor="#7b50ff" />
              <stop offset="100%" stopColor="#322772" />
            </radialGradient>
            <linearGradient id="flameGradNew" x1="60" y1="240" x2="60" y2="320" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff" />
              <stop offset="0.15" stopColor="#ffd977" />
              <stop offset="0.45" stopColor="#ff8a00" />
              <stop offset="1" stopColor="#ff4500" stopOpacity="0" />
            </linearGradient>
            <filter id="flameBlur">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Unified cone + body */}
          <path d="M60 0 C80 10 95 35 95 60 L95 240 C95 260 25 260 25 240 L25 60 C25 35 40 10 60 0 Z" fill="url(#rocketPurple)" />
          {/* Window */}
          <circle cx="60" cy="130" r="18" fill="#884dff" stroke="#1e1a3f" strokeWidth="4" />
          {/* Center pipe */}
          <rect x="57" y="180" width="6" height="70" rx="3" fill="#1e1a3f" />
          {/* Side fins */}
          <path d="M20 190 Q5 240 30 270 L30 230 Q25 205 20 190 Z" fill="#1e1a3f" />
          <path d="M100 190 Q115 240 90 270 L90 230 Q95 205 100 190 Z" fill="#1e1a3f" />
          {/* Nozzle */}
          <rect x="45" y="240" width="30" height="28" rx="6" fill="#1e1a3f" />
          {/* Flame (flickering) */}
          <motion.g filter="url(#flameBlur)">
            <motion.path
              d="M60 268 C75 290 80 310 60 320 C40 310 45 290 60 268 Z"
              fill="url(#flameGradNew)"
              animate={{ 
                scaleY: [1, 1.2, 0.9, 1], 
                scaleX: [1, 1.1, 0.95, 1], 
                opacity: [0.9, 1, 0.8, 0.9], 
                y: [0, -3, 0] 
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            {/* Additional flame layers for more realism */}
            <motion.path
              d="M60 268 C70 285 75 300 60 315 C45 300 50 285 60 268 Z"
              fill="url(#flameGradNew)"
              animate={{ 
                scaleY: [1, 1.15, 0.95, 1], 
                scaleX: [1, 1.05, 0.98, 1], 
                opacity: [0.7, 0.9, 0.6, 0.7], 
                y: [0, -2, 0] 
              }}
              transition={{ duration: 0.7, repeat: Infinity, delay: 0.1 }}
            />
          </motion.g>
          {/* Spark particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.circle
              key={i}
              cx="60"
              cy="300"
              r="1.8"
              fill="#ffb347"
              animate={{
                x: [0, (Math.random() - 0.5) * 26],
                y: [0, (Math.random() - 0.2) * 40],
                opacity: [1, 0]
              }}
              transition={{ duration: 0.8 + Math.random()*0.4, repeat: Infinity, delay: i*0.15 }}
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
};

// Componente para círculos luminosos en forma de infinito
const InfinityGlow = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
    {/* Primer círculo */}
    <motion.div
      className="absolute"
      style={{ width: 420, height: 200, left: '50%', top: '50%', transform: 'translate(-50%, -50%) rotate(20deg)' }}
      animate={{
        opacity: [0.7, 1, 0.7],
        scale: [1, 1.08, 1],
        filter: [
          'blur(60px) brightness(1.2)',
          'blur(80px) brightness(1.5)',
          'blur(60px) brightness(1.2)'
        ]
      }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg width="420" height="200" viewBox="0 0 420 200">
        <ellipse cx="110" cy="100" rx="90" ry="40" fill="none" stroke="#a855f7" strokeWidth="30" opacity="0.25" />
        <ellipse cx="310" cy="100" rx="90" ry="40" fill="none" stroke="#38bdf8" strokeWidth="30" opacity="0.25" />
      </svg>
    </motion.div>
    {/* Segundo círculo */}
    <motion.div
      className="absolute"
      style={{ width: 420, height: 200, left: '50%', top: '50%', transform: 'translate(-50%, -50%) rotate(-20deg)' }}
      animate={{
        opacity: [1, 0.7, 1],
        scale: [1, 1.12, 1],
        filter: [
          'blur(80px) brightness(1.3)',
          'blur(60px) brightness(1.1)',
          'blur(80px) brightness(1.3)'
        ]
      }}
      transition={{ duration: 2.7, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg width="420" height="200" viewBox="0 0 420 200">
        <ellipse cx="110" cy="100" rx="90" ry="40" fill="none" stroke="#f472b6" strokeWidth="24" opacity="0.18" />
        <ellipse cx="310" cy="100" rx="90" ry="40" fill="none" stroke="#818cf8" strokeWidth="24" opacity="0.18" />
      </svg>
    </motion.div>
  </div>
);

// Esferas blureadas titilantes de fondo global
const BlurredSpheresBackground = () => (
  <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
    <motion.div
      className="absolute"
      style={{ left: '10%', top: '30%', width: 420, height: 420 }}
      animate={{
        opacity: [0.7, 1, 0.7],
        scale: [1, 1.08, 1],
        filter: [
          'blur(120px) brightness(1.2)',
          'blur(160px) brightness(1.5)',
          'blur(120px) brightness(1.2)'
        ]
      }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="w-full h-full rounded-full bg-fuchsia-500/40" />
    </motion.div>
    <motion.div
      className="absolute"
      style={{ right: '8%', bottom: '18%', width: 340, height: 340 }}
      animate={{
        opacity: [1, 0.7, 1],
        scale: [1, 1.12, 1],
        filter: [
          'blur(100px) brightness(1.1)',
          'blur(140px) brightness(1.3)',
          'blur(100px) brightness(1.1)'
        ]
      }}
      transition={{ duration: 2.7, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="w-full h-full rounded-full bg-cyan-400/30" />
    </motion.div>
  </div>
);

export default function Home() {
  const features = [
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: "Matching IA",
      description: "IA que empareja habilidades, motivación y cultura."
    },
    {
      icon: <DocumentTextIcon className="w-8 h-8" />,
      title: "Contratos por proyecto",
      description: "Contratos digitales + blockchain para validar experiencia."
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Reputación verificable",
      description: "Certificados verificables para tu CV."
    },
    {
      icon: <ClockIcon className="w-8 h-8" />,
      title: "Resultados rápidos",
      description: "Proyectos de 2 semanas a 2 meses con impacto medible."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Publica tu reto",
      description: "Describe el proyecto que necesitas resolver"
    },
    {
      number: "02", 
      title: "Match inteligente",
      description: "Nuestra IA encuentra el talento perfecto"
    },
    {
      number: "03",
      title: "Ejecuta y valida",
      description: "Trabaja y obtén certificados verificables"
    }
  ];

  const testimonials = [
    {
      name: "María González",
      role: "Estudiante de Ingeniería",
      content: "Project Core me permitió trabajar en proyectos reales y construir mi portafolio profesional.",
      avatar: "👩‍🎓"
    },
    {
      name: "Carlos Ruiz",
      role: "CEO, TechStart",
      content: "Encontramos talento excepcional para nuestro proyecto de desarrollo web en solo 48 horas.",
      avatar: "👨‍💼"
    }
  ];

  const partners = [
    { name: "Tekton Labs", logo: "🏢" },
    { name: "Peruplast", logo: "🏭" },
    { name: "Ecodent", logo: "🦷" }
  ];

  const faqs = [
    {
      question: "¿Qué es Project Core?",
      answer: "Project Core es una plataforma que conecta estudiantes universitarios con empresas mediante proyectos reales, democratizando el acceso a experiencia laboral en LATAM."
    },
    {
      question: "¿Cómo funciona el matching?",
      answer: "Utilizamos inteligencia artificial para analizar perfiles de estudiantes y necesidades de empresas, creando matches basados en habilidades, motivación y cultura organizacional."
    },
    {
      question: "¿Los proyectos son remunerados?",
      answer: "Sí, todos los proyectos son remunerados. El monto varía según la complejidad y duración del proyecto."
    },
    {
      question: "¿Qué tipo de certificados obtengo?",
      answer: "Recibes certificados verificables en blockchain que validan tu experiencia y pueden ser incluidos en tu CV profesional."
    },
    {
      question: "¿Cuánto tiempo duran los proyectos?",
      answer: "Los proyectos típicamente duran entre 2 semanas y 2 meses, dependiendo de la complejidad y alcance."
    },
    {
      question: "¿Puedo participar desde cualquier universidad?",
      answer: "Sí, estamos abiertos a estudiantes de todas las universidades de LATAM que cumplan con los requisitos de los proyectos."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0E0C2C] text-white relative overflow-x-hidden">
      <BlurredSpheresBackground />
      <Navigation />
      <ChambyWidget />
      
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16 pt-24 text-center overflow-hidden pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0E0C2C] via-[#0F1724] to-[#0E0C2C] z-0" />
        {/* Círculos luminosos en infinito */}
        <InfinityGlow />
        {/* Cohete centrado detrás del texto */}
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 w-full flex items-center justify-center pointer-events-none">
          <div className="w-[260px] h-[420px] md:w-[320px] md:h-[600px] flex items-center justify-center opacity-90">
            <RocketAnimation />
          </div>
        </div>
        <div className="relative z-20 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              ROMPEMOS BARRERAS,
              <br />
              <span className="bg-gradient-to-r from-[#0EA5FF] via-[#7C3AED] to-[#0EA5FF] bg-clip-text text-transparent">
                CONECTAMOS PERSONAS
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              La primera plataforma en LATAM que democratiza la experiencia laboral con proyectos reales e inteligencia artificial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/register"
                className="bg-gradient-to-r from-[#0EA5FF] to-[#7C3AED] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-[#0EA5FF]/90 hover:to-[#7C3AED]/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Únete Ahora
              </motion.a>
              <motion.a
                href="#que-hacemos"
                className="border border-[#0EA5FF] text-[#0EA5FF] px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#0EA5FF] hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Descubre Más
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Qué Hacemos Section */}
      <section id="que-hacemos" className="py-24 px-4 sm:px-8 lg:px-16 bg-[#0F1724]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-[#0EA5FF]">¿Qué</span> hacemos?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transformamos la manera en que estudiantes y empresas se conectan, creando un ecosistema donde el talento emergente encuentra oportunidades reales de crecimiento.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-gradient-to-br from-[#0B1226]/80 to-[#0B1226]/60 p-8 rounded-2xl border border-[#0EA5FF]/30 backdrop-blur-sm"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#0EA5FF] to-[#7C3AED] rounded-xl flex items-center justify-center mb-6">
                <UserGroupIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Para Estudiantes</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Accede a proyectos reales de empresas, desarrolla habilidades prácticas y construye tu portafolio profesional desde la universidad.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-[#0EA5FF] mr-2" /><span>Proyectos remunerados</span></li>
                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-[#0EA5FF] mr-2" /><span>Mentorías personalizadas</span></li>
                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-[#0EA5FF] mr-2" /><span>Certificaciones validadas</span></li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-br from-[#0B1226]/80 to-[#0B1226]/60 p-8 rounded-2xl border border-[#7C3AED]/30 backdrop-blur-sm"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#7C3AED] to-[#0EA5FF] rounded-xl flex items-center justify-center mb-6">
                <RocketLaunchIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Para Empresas</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Encuentra talento joven y fresco para tus proyectos. Reduce costos de reclutamiento y acelera la innovación en tu organización.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-[#7C3AED] mr-2" /><span>Matching inteligente con IA</span></li>
                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-[#7C3AED] mr-2" /><span>Gestión simplificada</span></li>
                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-[#7C3AED] mr-2" /><span>ROI medible</span></li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-gradient-to-br from-[#0EA5FF]/20 to-[#7C3AED]/20 p-8 rounded-2xl border border-[#0EA5FF]/50 backdrop-blur-sm flex flex-col justify-center items-center text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#0EA5FF] to-[#7C3AED] rounded-full flex items-center justify-center mb-6">
                <DocumentTextIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Tecnología IA</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Nuestro algoritmo de matching utiliza inteligencia artificial para conectar el talento perfecto con cada proyecto.
              </p>
              <motion.a
                href="#como-funciona"
                className="bg-gradient-to-r from-[#0EA5FF] to-[#7C3AED] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#0EA5FF]/90 hover:to-[#7C3AED]/90 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                Ver Cómo Funciona
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impacto Section */}
      <section id="impacto" className="py-24 px-4 sm:px-8 lg:px-16 bg-[#0E0C2C]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Nuestro <span className="text-[#0EA5FF]">Impacto</span> en Números
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Datos reales que demuestran cómo estamos transformando el panorama laboral en LATAM.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-center bg-gradient-to-br from-[#0EA5FF]/10 to-[#7C3AED]/10 p-8 rounded-2xl border border-[#0EA5FF]/20 hover:border-[#0EA5FF]/40 hover:bg-gradient-to-br hover:from-[#0EA5FF]/20 hover:to-[#7C3AED]/20 transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-4xl sm:text-5xl font-bold text-[#0EA5FF] mb-2">300+</div>
              <div className="text-lg font-semibold text-white mb-2">Usuarios Registrados</div>
              <div className="text-gray-300">Creciendo cada día en nuestra plataforma</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center bg-gradient-to-br from-[#7C3AED]/10 to-[#0EA5FF]/10 p-8 rounded-2xl border border-[#7C3AED]/20 hover:border-[#7C3AED]/40 hover:bg-gradient-to-br hover:from-[#7C3AED]/20 hover:to-[#0EA5FF]/20 transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-4xl sm:text-5xl font-bold text-[#7C3AED] mb-2">3</div>
              <div className="text-lg font-semibold text-white mb-2">Modelos de IA</div>
              <div className="text-gray-300">Algoritmos avanzados de matching</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center bg-gradient-to-br from-[#0EA5FF]/10 to-[#7C3AED]/10 p-8 rounded-2xl border border-[#0EA5FF]/20 hover:border-[#0EA5FF]/40 hover:bg-gradient-to-br hover:from-[#0EA5FF]/20 hover:to-[#7C3AED]/20 transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-4xl sm:text-5xl font-bold text-[#0EA5FF] mb-2">🧠</div>
              <div className="text-lg font-semibold text-white mb-2">Redes Neuronales</div>
              <div className="text-gray-300">Adaptación continua con Chamby</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center bg-gradient-to-br from-[#7C3AED]/10 to-[#0EA5FF]/10 p-8 rounded-2xl border border-[#7C3AED]/20 hover:border-[#7C3AED]/40 hover:bg-gradient-to-br hover:from-[#7C3AED]/20 hover:to-[#0EA5FF]/20 transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-4xl sm:text-5xl font-bold text-[#7C3AED] mb-2">24/7</div>
              <div className="text-lg font-semibold text-white mb-2">Actualización IA</div>
              <div className="text-gray-300">Aprendizaje automático continuo</div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-[#0EA5FF]/20 to-[#7C3AED]/20 p-8 rounded-2xl border border-[#0EA5FF]/30 backdrop-blur-sm hover:border-[#0EA5FF]/50 hover:bg-gradient-to-r hover:from-[#0EA5FF]/30 hover:to-[#7C3AED]/30 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-4">
                🤖 Chamby: Tu asistente IA personalizado
              </h3>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Nuestras redes neuronales se adaptan continuamente con Chamby, aprendiendo de cada interacción para mejorar el matching entre talento y oportunidades.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partner Logos Carousel Section */}
      <section className="py-16 px-4 sm:px-8 lg:px-16 bg-[#0B1226]">
        <div className="max-w-7xl mx-auto">
          <div className="overflow-hidden relative">
            <motion.div
              className="flex items-center"
              animate={{
                x: [0, -600]
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 15,
                  ease: "linear",
                },
              }}
              style={{ width: 'fit-content' }}
            >
              {/* Multiple sets for truly seamless infinite scroll */}
              {[...Array(4)].map((_, setIndex) => (
                <div key={setIndex} className="flex space-x-12 items-center shrink-0 mr-12">
                  <motion.img
                    src="/images/wichay.png"
                    alt="Wichay"
                    className="h-12 w-auto opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                    whileHover={{ scale: 1.1 }}
                  />
                  <motion.img
                    src="/images/UNMSM.png"
                    alt="UNMSM"
                    className="h-12 w-auto opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                    whileHover={{ scale: 1.1 }}
                  />
                  <motion.img
                    src="/images/ONASA.png"
                    alt="ONASA"
                    className="h-12 w-auto opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                    whileHover={{ scale: 1.1 }}
                  />
                  <motion.img
                    src="/images/1551.png"
                    alt="1551"
                    className="h-12 w-auto opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                    whileHover={{ scale: 1.1 }}
                  />
                  <motion.img
                    src="/images/UV.png"
                    alt="UV"
                    className="h-12 w-auto opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                    whileHover={{ scale: 1.1 }}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-8 lg:px-16 bg-[#0F1724]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-[#7C3AED]">¿Por qué</span> funciona?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Nuestra plataforma combina tecnología avanzada con un enfoque humano para crear conexiones que realmente funcionan.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-gradient-to-br from-[#0B1226]/80 to-[#0B1226]/60 p-8 rounded-2xl border border-[#0EA5FF]/20 hover:border-[#0EA5FF]/50 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-[#0EA5FF] to-[#7C3AED] rounded-xl flex items-center justify-center mb-6 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="como-funciona" className="py-24 px-4 sm:px-8 lg:px-16 bg-[#0E0C2C]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-[#0EA5FF]">¿Cómo</span> funciona?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              En solo 3 pasos simples, conectamos talento con oportunidades reales.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#0EA5FF] to-[#7C3AED] rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-white">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-[#0EA5FF] to-[#7C3AED] transform translate-x-4"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ¿Quiénes somos? Section */}
      <section id="quienes-somos" className="py-24 px-4 sm:px-8 lg:px-16 bg-[#0F1724]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              ¿Quiénes <span className="text-[#0EA5FF]">somos?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Somos un equipo apasionado por conectar el talento universitario con oportunidades reales, 
              transformando la forma en que estudiantes y empresas colaboran.
            </p>
          </motion.div>

          {/* Team Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-br from-[#0EA5FF]/10 to-[#7C3AED]/10 p-8 rounded-2xl border border-gray-700/50 hover:border-[#0EA5FF]/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#0EA5FF] to-[#7C3AED] rounded-xl flex items-center justify-center mb-6">
                <RocketLaunchIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Innovación</h3>
              <p className="text-gray-300 leading-relaxed">
                Utilizamos tecnología de vanguardia e inteligencia artificial para crear soluciones 
                que revolucionen el mercado laboral estudiantil.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-[#7C3AED]/10 to-[#0EA5FF]/10 p-8 rounded-2xl border border-gray-700/50 hover:border-[#7C3AED]/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#7C3AED] to-[#0EA5FF] rounded-xl flex items-center justify-center mb-6">
                <UserGroupIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Colaboración</h3>
              <p className="text-gray-300 leading-relaxed">
                Creemos en el poder de la colaboración entre estudiantes y empresas para 
                generar proyectos que impacten positivamente en la sociedad.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-[#0EA5FF]/10 to-[#7C3AED]/10 p-8 rounded-2xl border border-gray-700/50 hover:border-[#0EA5FF]/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#0EA5FF] to-[#7C3AED] rounded-xl flex items-center justify-center mb-6">
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Confianza</h3>
              <p className="text-gray-300 leading-relaxed">
                Construimos relaciones sólidas basadas en la transparencia, seguridad 
                y el compromiso con la excelencia en cada proyecto.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-[#7C3AED]/10 to-[#0EA5FF]/10 p-8 rounded-2xl border border-gray-700/50 hover:border-[#7C3AED]/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#7C3AED] to-[#0EA5FF] rounded-xl flex items-center justify-center mb-6">
                <DocumentTextIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Calidad</h3>
              <p className="text-gray-300 leading-relaxed">
                Nos comprometemos a entregar proyectos de la más alta calidad, 
                asegurando que cada colaboración genere valor real para todas las partes.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-br from-[#0EA5FF]/10 to-[#7C3AED]/10 p-8 rounded-2xl border border-gray-700/50 hover:border-[#0EA5FF]/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#0EA5FF] to-[#7C3AED] rounded-xl flex items-center justify-center mb-6">
                <ClockIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Agilidad</h3>
              <p className="text-gray-300 leading-relaxed">
                Trabajamos con metodologías ágiles para garantizar entregas rápidas 
                y eficientes, adaptándonos a las necesidades cambiantes del mercado.
              </p>
            </motion.div>
          </div>

          {/* Nuestra Mision */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center bg-gradient-to-r from-[#0EA5FF]/10 to-[#7C3AED]/10 p-12 rounded-3xl border border-gray-700/50 mt-16"
          >
            <h3 className="text-3xl font-bold text-white mb-6">Nuestra Misión</h3>
            <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
              Democratizar el acceso a oportunidades laborales de calidad para estudiantes universitarios, 
              mientras ayudamos a las empresas a encontrar el talento joven que necesitan para innovar y crecer. 
              A través de nuestra plataforma impulsada por IA, creamos un ecosistema donde el potencial 
              se encuentra con la oportunidad.
            </p>
          </motion.div>
        </div>
      </section>


      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 sm:px-8 lg:px-16 bg-[#0F1724]">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Preguntas <span className="text-[#0EA5FF]">Frecuentes</span>
            </h2>
            <p className="text-xl text-gray-300">
              Todo lo que necesitas saber sobre Project Core.
            </p>
          </motion.div>
          
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-8 lg:px-16 bg-gradient-to-r from-[#0EA5FF]/20 to-[#7C3AED]/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Únete a la Revolución del Talento
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Sé parte de la comunidad que está redefiniendo el futuro del trabajo en América Latina.
            </p>
            <motion.a
              href="https://chat.whatsapp.com/EmA7S7Xblqf1eaVrAzPiiB"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-white to-gray-200 text-[#0E0C2C] px-10 py-4 rounded-xl text-lg font-bold hover:from-white/90 hover:to-gray-200/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Únete a nuestra Project Core Tribe
            </motion.a>
          </motion.div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-[#0B1226] text-gray-400 py-12 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="/images/logoCircular.png"
                  alt="Project Core Logo"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-xl font-bold text-white">Project Core</span>
              </div>
              <p className="text-gray-300 mb-4 pr-8">
                La primera plataforma en LATAM que democratiza la experiencia laboral con proyectos reales e inteligencia artificial.
              </p>
              <div className="flex space-x-4">
                <a href="https://instagram.com/projectcore.oficial" className="text-gray-400 hover:text-[#0EA5FF] transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://linkedin.com/in/chambea-ya-318819360" className="text-gray-400 hover:text-[#0EA5FF] transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
            
          <div>
              <h3 className="text-lg font-semibold text-white mb-6">Enlaces</h3>
              <ul className="space-y-3">
                <li><a href="#que-hacemos" className="text-gray-300 hover:text-white transition-colors">¿Qué hacemos?</a></li>
                <li><a href="#como-funciona" className="text-gray-300 hover:text-white transition-colors">Cómo funciona</a></li>
                <li><a href="#quienes-somos" className="text-gray-300 hover:text-white transition-colors">¿Quiénes somos?</a></li>
                <li><a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Legal</h3>
              <ul className="space-y-3">
                <li><a href="/politica-privacidad" className="text-gray-300 hover:text-white transition-colors">Privacidad</a></li>
                <li><a href="/terminos-servicio" className="text-gray-300 hover:text-white transition-colors">Términos</a></li>
                <li><a href="/contacto" className="text-gray-300 hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
          </div>


          <div className="border-t border-gray-700/50 pt-8 text-center">
            <p className="text-gray-400">
                &copy; 2025 ProjectCore. Todos los derechos reservados. Hecho con &hearts; en Perú.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}