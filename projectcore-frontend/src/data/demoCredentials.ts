// Credenciales de usuario para demo de ProjectCore

export const demoCredentials = {
  // Usuario Empresa
  company: {
    email: 'demo@techcorp.com',
    password: 'demo123',
    userType: 'company',
    profile: {
      name: 'TechCorp Solutions',
      description: 'Empresa líder en desarrollo de software y soluciones tecnológicas',
      location: 'Lima, Perú',
      website: 'https://techcorp.com',
      industry: 'Tecnología'
    }
  },

  // Usuario Estudiante
  student: {
    email: 'maria.garcia@uni.edu.pe',
    password: 'demo123',
    userType: 'student',
    profile: {
      name: 'María García López',
      dni: '12345678',
      career: 'Ingeniería de Sistemas',
      university: 'Universidad Nacional Mayor de San Marcos',
      academicCycle: '8vo ciclo',
      location: 'Lima, Perú',
      skills: ['JavaScript', 'React', 'Python', 'SQL'],
      experience: 'Junior',
      availability: 'Part-time'
    }
  }
}

// Instrucciones para usar el demo
export const demoInstructions = {
  company: `
    🏢 DEMO - EMPRESA TECHCORP SOLUTIONS
    
    📧 Email: demo@techcorp.com
    🔑 Password: demo123
    
    ✨ Funcionalidades disponibles:
    • Dashboard con analytics de IA
    • Gestión de ofertas laborales
    • Candidatos recomendados por IA
    • Sistema de matching inteligente
    • Analytics en tiempo real
    
    🎯 Datos de prueba incluidos:
    • 5 ofertas laborales activas
    • 15+ candidatos con matching IA
    • Analytics completos
    • Simulación de contrataciones exitosas
  `,
  
  student: `
    🎓 DEMO - ESTUDIANTE MARÍA GARCÍA
    
    📧 Email: maria.garcia@uni.edu.pe
    🔑 Password: demo123
    
    ✨ Funcionalidades disponibles:
    • Dashboard personalizado
    • Recomendaciones de trabajos por IA
    • Sistema de matching inteligente
    • Perfil optimizado para empleadores
    • Seguimiento de aplicaciones
    
    🎯 Datos de prueba incluidos:
    • 10+ trabajos recomendados
    • Matches con 95% de compatibilidad
    • Perfil completo y optimizado
    • Historial de aplicaciones
  `
}

// Función para obtener credenciales según tipo de usuario
export const getDemoCredentials = (userType: 'company' | 'student') => {
  return demoCredentials[userType]
}

// Función para mostrar instrucciones
export const showDemoInstructions = (userType: 'company' | 'student') => {
  console.log(demoInstructions[userType])
  return demoInstructions[userType]
}
