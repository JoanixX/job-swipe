// Mock data for ProjectCore platform demo

export interface Student {
  id: string
  name: string
  email: string
  university: string
  career: string
  academic_cycle: number
  skills: string[]
  experience_level: string
  location: string
  availability: number
  preferred_modality: string
  gpa: number
  languages: string[]
  portfolio_url?: string
  linkedin_url?: string
  description: string
  match_score?: number
}

export interface Company {
  id: string
  name: string
  industry: string
  size: string
  location: string
  description: string
  logo_url?: string
  website?: string
}

export interface JobOffer {
  id: string
  company_id: string
  company: Company
  title: string
  description: string
  requirements: string[]
  skills_required: string[]
  experience_level: string
  salary_range: string
  location: string
  modality: string
  duration: string
  hours_per_week: number
  benefits: string[]
  application_deadline: string
  created_at: string
  status: 'active' | 'paused' | 'closed'
  applications_count: number
  match_score?: number
}

export interface MatchResult {
  student_id: string
  job_offer_id: string
  compatibility_score: number
  skill_match: number
  experience_match: number
  location_match: number
  availability_match: number
  strengths: string[]
  areas_for_improvement: string[]
  recommendation: string
}

// Mock Students Data
export const mockStudents: Student[] = [
  {
    id: "1",
    name: "Ana García Rodríguez",
    email: "ana.garcia@uni.edu.pe",
    university: "Universidad Nacional Mayor de San Marcos",
    career: "Ingeniería de Sistemas",
    academic_cycle: 8,
    skills: ["React", "Node.js", "Python", "SQL", "Git", "JavaScript", "TypeScript"],
    experience_level: "Intermedio",
    location: "Lima, Perú",
    availability: 25,
    preferred_modality: "Híbrido",
    gpa: 16.8,
    languages: ["Español", "Inglés"],
    portfolio_url: "https://anagarcia.dev",
    linkedin_url: "https://linkedin.com/in/anagarcia",
    description: "Estudiante apasionada por el desarrollo web full-stack con experiencia en proyectos académicos y personales.",
    match_score: 92
  },
  {
    id: "2",
    name: "Carlos Mendoza Silva",
    email: "carlos.mendoza@pucp.edu.pe",
    university: "Pontificia Universidad Católica del Perú",
    career: "Administración de Empresas",
    academic_cycle: 6,
    skills: ["Excel", "PowerBI", "Marketing Digital", "Análisis de Datos", "CRM"],
    experience_level: "Junior",
    location: "Lima, Perú",
    availability: 20,
    preferred_modality: "Presencial",
    gpa: 15.2,
    languages: ["Español", "Inglés", "Portugués"],
    linkedin_url: "https://linkedin.com/in/carlosmendoza",
    description: "Estudiante enfocado en marketing digital y análisis de negocios con certificaciones en Google Analytics.",
    match_score: 88
  },
  {
    id: "3",
    name: "María Fernanda López",
    email: "mf.lopez@ulima.edu.pe",
    university: "Universidad de Lima",
    career: "Diseño Gráfico",
    academic_cycle: 7,
    skills: ["Adobe Creative Suite", "Figma", "UI/UX", "Branding", "Ilustración"],
    experience_level: "Intermedio",
    location: "Lima, Perú",
    availability: 30,
    preferred_modality: "Remoto",
    gpa: 17.5,
    languages: ["Español", "Inglés"],
    portfolio_url: "https://behance.net/marialopez",
    description: "Diseñadora creativa especializada en identidad visual y experiencia de usuario con múltiples proyectos freelance.",
    match_score: 95
  },
  {
    id: "4",
    name: "Diego Ramírez Torres",
    email: "diego.ramirez@upc.edu.pe",
    university: "Universidad Peruana de Ciencias Aplicadas",
    career: "Ingeniería Industrial",
    academic_cycle: 9,
    skills: ["Lean Manufacturing", "Six Sigma", "AutoCAD", "Project Management", "Excel"],
    experience_level: "Avanzado",
    location: "Lima, Perú",
    availability: 35,
    preferred_modality: "Híbrido",
    gpa: 16.3,
    languages: ["Español", "Inglés"],
    description: "Estudiante con experiencia en optimización de procesos y gestión de proyectos industriales.",
    match_score: 90
  },
  {
    id: "5",
    name: "Sofía Vargas Huamán",
    email: "sofia.vargas@unmsm.edu.pe",
    university: "Universidad Nacional Mayor de San Marcos",
    career: "Psicología",
    academic_cycle: 5,
    skills: ["Recursos Humanos", "Evaluación Psicológica", "Coaching", "Comunicación"],
    experience_level: "Junior",
    location: "Lima, Perú",
    availability: 20,
    preferred_modality: "Presencial",
    gpa: 15.8,
    languages: ["Español", "Inglés"],
    description: "Estudiante interesada en psicología organizacional y desarrollo del talento humano.",
    match_score: 85
  }
];

// Mock Companies Data
export const mockCompanies: Company[] = [
  {
    id: "1",
    name: "TechPeru Solutions",
    industry: "Tecnología",
    size: "51-200 empleados",
    location: "San Isidro, Lima",
    description: "Empresa líder en desarrollo de software y soluciones tecnológicas para el mercado peruano.",
    logo_url: "/images/companies/techperu.png",
    website: "https://techperu.com"
  },
  {
    id: "2",
    name: "Innovación Digital SAC",
    industry: "Marketing Digital",
    size: "11-50 empleados",
    location: "Miraflores, Lima",
    description: "Agencia especializada en marketing digital y transformación digital para empresas.",
    logo_url: "/images/companies/innovacion.png",
    website: "https://innovaciondigital.pe"
  },
  {
    id: "3",
    name: "CreativeStudio Peru",
    industry: "Diseño y Publicidad",
    size: "11-50 empleados",
    location: "Barranco, Lima",
    description: "Estudio creativo especializado en branding, diseño gráfico y campañas publicitarias.",
    logo_url: "/images/companies/creative.png",
    website: "https://creativestudio.pe"
  },
  {
    id: "4",
    name: "IndustrialPro Consulting",
    industry: "Consultoría Industrial",
    size: "201-500 empleados",
    location: "San Borja, Lima",
    description: "Consultora líder en optimización de procesos industriales y gestión de operaciones.",
    logo_url: "/images/companies/industrial.png",
    website: "https://industrialpro.pe"
  },
  {
    id: "5",
    name: "TalentHub Peru",
    industry: "Recursos Humanos",
    size: "51-200 empleados",
    location: "Surco, Lima",
    description: "Empresa especializada en gestión del talento humano y desarrollo organizacional.",
    logo_url: "/images/companies/talent.png",
    website: "https://talenthub.pe"
  }
];

// Mock Job Offers Data
export const mockJobOffers: JobOffer[] = [
  {
    id: "1",
    company_id: "1",
    company: mockCompanies[0],
    title: "Desarrollador Frontend React - Práctica Profesional",
    description: "Únete a nuestro equipo de desarrollo como practicante y contribuye en proyectos reales usando las últimas tecnologías web. Trabajarás en aplicaciones modernas con React, TypeScript y herramientas de vanguardia.",
    requirements: [
      "Estudiante de Ingeniería de Sistemas, Computación o afines",
      "Conocimientos en React y JavaScript",
      "Experiencia con Git y control de versiones",
      "Inglés intermedio"
    ],
    skills_required: ["React", "JavaScript", "TypeScript", "Git", "HTML", "CSS"],
    experience_level: "Junior",
    salary_range: "S/. 1,200 - S/. 1,800",
    location: "San Isidro, Lima",
    modality: "Híbrido",
    duration: "6 meses",
    hours_per_week: 30,
    benefits: ["Capacitación continua", "Mentoring técnico", "Certificaciones", "Ambiente flexible"],
    application_deadline: "2024-10-15",
    created_at: "2024-08-25",
    status: "active",
    applications_count: 24,
    match_score: 92
  },
  {
    id: "2",
    company_id: "2",
    title: "Asistente de Marketing Digital",
    description: "Buscamos un estudiante proactivo para apoyar en nuestras campañas de marketing digital. Aprenderás sobre SEO, SEM, redes sociales y análisis de métricas mientras contribuyes a proyectos reales de clientes.",
    requirements: [
      "Estudiante de Marketing, Comunicaciones o Administración",
      "Conocimientos básicos de marketing digital",
      "Manejo de redes sociales",
      "Creatividad y proactividad"
    ],
    skills_required: ["Marketing Digital", "Google Analytics", "Redes Sociales", "SEO", "Excel"],
    experience_level: "Junior",
    salary_range: "S/. 1,000 - S/. 1,400",
    location: "Miraflores, Lima",
    modality: "Presencial",
    duration: "4 meses",
    hours_per_week: 25,
    benefits: ["Certificaciones Google", "Capacitación en herramientas", "Networking", "Proyecto final"],
    application_deadline: "2024-09-30",
    created_at: "2024-08-20",
    status: "active",
    applications_count: 18,
    match_score: 88
  },
  {
    id: "3",
    company_id: "3",
    title: "Diseñador Gráfico Junior - Prácticas",
    description: "Oportunidad única para diseñadores creativos que quieren desarrollar su portafolio trabajando en proyectos de branding, diseño editorial y campañas visuales para marcas reconocidas.",
    requirements: [
      "Estudiante de Diseño Gráfico o carreras afines",
      "Dominio de Adobe Creative Suite",
      "Portafolio actualizado",
      "Conocimientos de UI/UX valorados"
    ],
    skills_required: ["Adobe Photoshop", "Adobe Illustrator", "Figma", "Branding", "UI/UX"],
    experience_level: "Intermedio",
    salary_range: "S/. 1,300 - S/. 1,700",
    location: "Barranco, Lima",
    modality: "Remoto",
    duration: "5 meses",
    hours_per_week: 32,
    benefits: ["Mentoring creativo", "Acceso a recursos premium", "Portafolio profesional", "Flexibilidad horaria"],
    application_deadline: "2024-10-01",
    created_at: "2024-08-22",
    status: "active",
    applications_count: 31,
    match_score: 95
  },
  {
    id: "4",
    company_id: "4",
    title: "Analista de Procesos Industriales",
    description: "Únete a nuestro equipo de consultoría para aprender sobre optimización de procesos, lean manufacturing y gestión de operaciones en empresas industriales líderes del país.",
    requirements: [
      "Estudiante de Ingeniería Industrial o afines",
      "Conocimientos en Lean Manufacturing",
      "Manejo de Excel avanzado",
      "Capacidad analítica"
    ],
    skills_required: ["Lean Manufacturing", "Six Sigma", "Excel", "AutoCAD", "Project Management"],
    experience_level: "Avanzado",
    salary_range: "S/. 1,500 - S/. 2,000",
    location: "San Borja, Lima",
    modality: "Híbrido",
    duration: "6 meses",
    hours_per_week: 35,
    benefits: ["Certificación Lean", "Visitas a plantas", "Mentoring especializado", "Posibilidad de contrato"],
    application_deadline: "2024-09-25",
    created_at: "2024-08-18",
    status: "active",
    applications_count: 12,
    match_score: 90
  },
  {
    id: "5",
    company_id: "5",
    title: "Asistente de Recursos Humanos",
    description: "Oportunidad para estudiantes de Psicología interesados en el área organizacional. Participarás en procesos de selección, evaluaciones psicológicas y programas de desarrollo del talento.",
    requirements: [
      "Estudiante de Psicología (últimos ciclos)",
      "Conocimientos en psicología organizacional",
      "Habilidades de comunicación",
      "Interés en desarrollo del talento"
    ],
    skills_required: ["Recursos Humanos", "Evaluación Psicológica", "Comunicación", "Excel"],
    experience_level: "Junior",
    salary_range: "S/. 1,100 - S/. 1,500",
    location: "Surco, Lima",
    modality: "Presencial",
    duration: "4 meses",
    hours_per_week: 28,
    benefits: ["Capacitación en RRHH", "Certificaciones", "Networking profesional", "Experiencia real"],
    application_deadline: "2024-10-10",
    created_at: "2024-08-28",
    status: "active",
    applications_count: 22,
    match_score: 85
  },
  {
    id: "6",
    company_id: "1",
    title: "Desarrollador Backend Python - Trainee",
    description: "Posición para desarrolladores backend que quieren especializarse en Python, Django y arquitecturas de microservicios. Trabajarás en APIs robustas y sistemas escalables.",
    requirements: [
      "Estudiante de Ingeniería de Sistemas o afines",
      "Conocimientos sólidos en Python",
      "Experiencia con bases de datos",
      "Conocimientos de APIs REST"
    ],
    skills_required: ["Python", "Django", "PostgreSQL", "REST APIs", "Git", "Docker"],
    experience_level: "Intermedio",
    salary_range: "S/. 1,400 - S/. 1,900",
    location: "San Isidro, Lima",
    modality: "Híbrido",
    duration: "6 meses",
    hours_per_week: 32,
    benefits: ["Capacitación en cloud", "Mentoring senior", "Certificaciones AWS", "Proyecto final"],
    application_deadline: "2024-10-20",
    created_at: "2024-08-30",
    status: "active",
    applications_count: 19,
    match_score: 87
  },
  {
    id: "7",
    company_id: "2",
    title: "Community Manager & Content Creator",
    description: "Buscamos un creativo digital para manejar redes sociales de nuestros clientes, crear contenido engaging y desarrollar estrategias de community management efectivas.",
    requirements: [
      "Estudiante de Comunicaciones, Marketing o afines",
      "Experiencia en manejo de redes sociales",
      "Creatividad para contenido visual",
      "Conocimientos de herramientas de diseño"
    ],
    skills_required: ["Redes Sociales", "Content Marketing", "Canva", "Copywriting", "Analytics"],
    experience_level: "Junior",
    salary_range: "S/. 1,200 - S/. 1,600",
    location: "Miraflores, Lima",
    modality: "Remoto",
    duration: "5 meses",
    hours_per_week: 30,
    benefits: ["Capacitación en trends", "Herramientas premium", "Portfolio digital", "Networking"],
    application_deadline: "2024-09-28",
    created_at: "2024-08-26",
    status: "active",
    applications_count: 35,
    match_score: 82
  },
  {
    id: "8",
    company_id: "3",
    title: "Motion Graphics Designer",
    description: "Oportunidad para diseñadores que quieren especializarse en motion graphics y animación digital. Crearás contenido audiovisual para campañas publicitarias y redes sociales.",
    requirements: [
      "Estudiante de Diseño Gráfico, Comunicación Audiovisual",
      "Conocimientos en After Effects",
      "Portfolio con trabajos de animación",
      "Creatividad y atención al detalle"
    ],
    skills_required: ["After Effects", "Premiere Pro", "Cinema 4D", "Illustrator", "Motion Graphics"],
    experience_level: "Intermedio",
    salary_range: "S/. 1,500 - S/. 2,100",
    location: "Barranco, Lima",
    modality: "Híbrido",
    duration: "6 meses",
    hours_per_week: 35,
    benefits: ["Software premium", "Capacitación 3D", "Reel profesional", "Mentoring creativo"],
    application_deadline: "2024-10-05",
    created_at: "2024-08-24",
    status: "active",
    applications_count: 16,
    match_score: 91
  }
];

// Mock Match Results
export const mockMatchResults: MatchResult[] = [
  {
    student_id: "1",
    job_offer_id: "1",
    compatibility_score: 92,
    skill_match: 95,
    experience_match: 88,
    location_match: 100,
    availability_match: 90,
    strengths: ["Excelente match técnico", "Experiencia en React", "Disponibilidad adecuada"],
    areas_for_improvement: ["Fortalecer conocimientos en TypeScript", "Mejorar inglés técnico"],
    recommendation: "Candidata altamente recomendada. Sus habilidades técnicas se alinean perfectamente con los requisitos del puesto."
  },
  {
    student_id: "3",
    job_offer_id: "3",
    compatibility_score: 95,
    skill_match: 98,
    experience_match: 92,
    location_match: 85,
    availability_match: 95,
    strengths: ["Portfolio excepcional", "Dominio completo de herramientas", "Experiencia freelance"],
    areas_for_improvement: ["Experiencia en proyectos corporativos"],
    recommendation: "Candidata ideal para el puesto. Su experiencia y creatividad son exactamente lo que buscan."
  },
  {
    student_id: "4",
    job_offer_id: "4",
    compatibility_score: 90,
    skill_match: 92,
    experience_match: 95,
    location_match: 100,
    availability_match: 88,
    strengths: ["Experiencia avanzada", "Conocimientos especializados", "Alta disponibilidad"],
    areas_for_improvement: ["Certificación Six Sigma"],
    recommendation: "Excelente candidato con sólida formación técnica y experiencia práctica relevante."
  }
];

// Helper functions
export const getStudentById = (id: string): Student | undefined => {
  return mockStudents.find(student => student.id === id);
};

export const getJobOfferById = (id: string): JobOffer | undefined => {
  return mockJobOffers.find(job => job.id === id);
};

export const getJobOffersByCompany = (companyId: string): JobOffer[] => {
  return mockJobOffers.filter(job => job.company_id === companyId);
};

export const getMatchResultsForStudent = (studentId: string): MatchResult[] => {
  return mockMatchResults.filter(match => match.student_id === studentId);
};

export const getMatchResultsForJob = (jobId: string): MatchResult[] => {
  return mockMatchResults.filter(match => match.job_offer_id === jobId);
};

export const getTopMatchesForStudent = (studentId: string, limit: number = 5): JobOffer[] => {
  const matches = getMatchResultsForStudent(studentId);
  const sortedMatches = matches.sort((a, b) => b.compatibility_score - a.compatibility_score);
  
  return sortedMatches.slice(0, limit).map(match => {
    const job = getJobOfferById(match.job_offer_id);
    if (job) {
      return { ...job, match_score: match.compatibility_score };
    }
    return null;
  }).filter(Boolean) as JobOffer[];
};

export const getTopMatchesForJob = (jobId: string, limit: number = 5): Student[] => {
  const matches = getMatchResultsForJob(jobId);
  const sortedMatches = matches.sort((a, b) => b.compatibility_score - a.compatibility_score);
  
  return sortedMatches.slice(0, limit).map(match => {
    const student = getStudentById(match.student_id);
    if (student) {
      return { 
        ...student, 
        match_score: match.compatibility_score,
        matchScore: match.compatibility_score,
        aiReason: match.recommendation,
        availability: `${student.availability}h/semana`,
        experience: student.experience_level,
        isNew: Math.random() > 0.7
      };
    }
    return null;
  }).filter(Boolean) as Student[];
};

// AI Matching Algorithm Simulation
export const simulateAIMatching = (jobOffer: JobOffer): Student[] => {
  const candidates = mockStudents.map(student => {
    // Calculate skill match
    const jobSkills = jobOffer.skills_required || []
    const studentSkills = student.skills
    const skillMatches = jobSkills.filter(skill => 
      studentSkills.some(studentSkill => 
        studentSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(studentSkill.toLowerCase())
      )
    )
    const skillMatchPercentage = jobSkills.length > 0 ? (skillMatches.length / jobSkills.length) * 100 : 0

    // Calculate experience match
    const experienceScore = jobOffer.experience_level === student.experience_level ? 100 : 
                           (jobOffer.experience_level === 'Junior' && student.experience_level === 'Intermedio') ? 90 :
                           (jobOffer.experience_level === 'Intermedio' && student.experience_level === 'Avanzado') ? 85 : 60

    // Calculate location match
    const locationScore = jobOffer.location.includes('Lima') && student.location.includes('Lima') ? 100 : 70

    // Calculate modality match
    const modalityScore = jobOffer.modality === student.preferred_modality ? 100 :
                         (jobOffer.modality === 'Híbrido' || student.preferred_modality === 'Híbrido') ? 90 : 80

    // Calculate overall match score
    const overallMatch = Math.round(
      (skillMatchPercentage * 0.4) + 
      (experienceScore * 0.25) + 
      (locationScore * 0.2) + 
      (modalityScore * 0.15)
    )

    // Generate AI reasoning
    const reasons = []
    if (skillMatchPercentage > 70) reasons.push(`Excelente compatibilidad técnica (${skillMatches.join(', ')})`)
    if (experienceScore > 85) reasons.push(`Nivel de experiencia ideal para el puesto`)
    if (locationScore === 100) reasons.push(`Ubicación perfecta para modalidad ${jobOffer.modality}`)
    if (student.gpa > 16) reasons.push(`Rendimiento académico sobresaliente (${student.gpa})`)

    const aiReason = reasons.length > 0 ? reasons.join('. ') + '.' : 
                    'Candidato con potencial que puede adaptarse a los requerimientos del puesto.'

    return {
      ...student,
      matchScore: Math.max(overallMatch, 75),
      match_score: Math.max(overallMatch, 75),
      skillMatchPercentage,
      experienceScore,
      locationScore,
      modalityScore,
      aiReason,
      matchedSkills: skillMatches,
      availability: `${student.availability}h/semana`,
      experience: student.experience_level,
      isNew: Math.random() > 0.7
    }
  })

  return candidates
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5)
}

// Function to create new job offer and get AI matches
export const createJobOfferWithAIMatching = (jobData: Partial<JobOffer>): { jobOffer: JobOffer, matches: Student[] } => {
  const newJobOffer: JobOffer = {
    id: Date.now().toString(),
    company_id: jobData.company_id || '1',
    company: mockCompanies.find(c => c.id === (jobData.company_id || '1')) || mockCompanies[0],
    title: jobData.title || '',
    description: jobData.description || '',
    requirements: jobData.requirements || [],
    skills_required: jobData.skills_required || [],
    experience_level: jobData.experience_level || 'Junior',
    salary_range: jobData.salary_range || '',
    location: jobData.location || 'Lima, Perú',
    modality: jobData.modality || 'Híbrido',
    duration: jobData.duration || '6 meses',
    hours_per_week: jobData.hours_per_week || 30,
    benefits: jobData.benefits || [],
    application_deadline: jobData.application_deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    created_at: new Date().toISOString().split('T')[0],
    status: 'active',
    applications_count: 0
  }

  mockJobOffers.push(newJobOffer)
  const matches = simulateAIMatching(newJobOffer)

  return { jobOffer: newJobOffer, matches }
}
