// User context service for personalized dashboards

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'company';
  university?: string;
  career?: string;
  semester?: number;
  position?: string;
  industry?: string;
  location: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  avatar?: string;
  projects?: any[];
  applications?: any[];
  matches?: any[];
  gpa?: number;
  languages?: string[];
  size?: string;
  website?: string;
  contactEmail?: string;
  description?: string;
  founded?: number;
  specialties?: string[];
}

class UserContextService {
  private currentUser: UserProfile | null = null;

  // Mock user data for personalized dashboards
  private mockUsers: { [key: string]: UserProfile } = {
    'pablo@example.com': {
      id: 'pablo-123',
      name: 'Pablo García',
      email: 'pablo@example.com',
      role: 'student',
      university: 'Universidad Nacional de Colombia',
      career: 'Ingeniería de Sistemas',
      semester: 8,
      avatar: '/images/pablo-avatar.jpg',
      skills: ['JavaScript', 'React', 'Python', 'Node.js'],
      location: 'Bogotá, Colombia',
      bio: 'Estudiante apasionado por el desarrollo web y la inteligencia artificial.',
      gpa: 4.2,
      languages: ['Español (Nativo)', 'Inglés (Intermedio)']
    },
    'pedro@example.com': {
      id: 'pedro-456',
      name: 'Pedro Rodríguez',
      email: 'pedro@example.com',
      role: 'student',
      university: 'Universidad de los Andes',
      career: 'Ingeniería Industrial',
      semester: 6,
      avatar: '/images/pedro-avatar.jpg',
      skills: ['Data Analysis', 'Excel', 'SQL', 'Power BI'],
      location: 'Medellín, Colombia',
      bio: 'Enfocado en análisis de datos y optimización de procesos.',
      gpa: 3.8,
      languages: ['Español (Nativo)', 'Inglés (Avanzado)', 'Francés (Básico)']
    },
    'jorge@example.com': {
      id: 'jorge-789',
      name: 'Jorge Martínez',
      email: 'jorge@example.com',
      role: 'student',
      university: 'Pontificia Universidad Javeriana',
      career: 'Diseño Gráfico',
      semester: 4,
      avatar: '/images/jorge-avatar.jpg',
      skills: ['Adobe Creative Suite', 'UI/UX Design', 'Figma', 'Branding'],
      location: 'Cali, Colombia',
      bio: 'Diseñador creativo con pasión por la experiencia de usuario.',
      gpa: 4.0,
      languages: ['Español (Nativo)', 'Inglés (Intermedio)']
    },
    'empresa1@techcorp.com': {
      id: 'techcorp-001',
      name: 'TechCorp Solutions',
      email: 'empresa1@techcorp.com',
      role: 'company',
      industry: 'Tecnología',
      location: 'Bogotá, Colombia',
      size: '50-200 empleados',
      website: 'https://techcorp.com',
      contactEmail: 'rrhh@techcorp.com',
      avatar: '/images/techcorp-logo.jpg',
      description: 'Empresa líder en desarrollo de software y soluciones tecnológicas.',
      founded: 2015,
      specialties: ['Desarrollo Web', 'Mobile Apps', 'Cloud Solutions', 'AI/ML']
    },
    'empresa2@innovatech.com': {
      id: 'innovatech-002',
      name: 'InnovaTech Labs',
      email: 'empresa2@innovatech.com',
      role: 'company',
      industry: 'Investigación y Desarrollo',
      location: 'Medellín, Colombia',
      size: '10-50 empleados',
      website: 'https://innovatech.com',
      contactEmail: 'talent@innovatech.com',
      avatar: '/images/innovatech-logo.jpg',
      description: 'Startup enfocada en innovación tecnológica y productos disruptivos.',
      founded: 2020,
      specialties: ['IoT', 'Blockchain', 'Machine Learning', 'Data Science']
    }
  };

  // Mock dashboard data for different users
  private mockDashboardData: { [key: string]: any } = {
    'pablo@example.com': {
      stats: {
        applications: 12,
        interviews: 3,
        offers: 1,
        completedProjects: 8,
        skillsProgress: 75
      },
      recentApplications: [
        {
          id: '1',
          company: 'TechCorp Solutions',
          position: 'Frontend Developer Intern',
          status: 'pending',
          applied_date: '2024-01-15'
        }
      ],
      recommendedJobs: [
        {
          id: '1',
          title: 'Junior React Developer',
          company: 'TechCorp Solutions',
          location: 'Bogotá',
          match: 95,
          salary: '$2,500,000 - $3,500,000'
        }
      ],
      projects: [
        {
          id: '1',
          name: 'E-commerce Platform',
          description: 'Full-stack web application using React and Node.js',
          status: 'completed',
          technologies: ['React', 'Node.js', 'MongoDB']
        }
      ],
      upcomingEvents: []
    },
    'pedro@example.com': {
      stats: {
        applications: 8,
        interviews: 2,
        offers: 1,
        completedProjects: 5,
        skillsProgress: 65
      },
      recentApplications: [
        {
          id: '1',
          company: 'Banco Nacional',
          position: 'Practicante de Finanzas',
          status: 'accepted',
          applied_date: '2024-01-10'
        }
      ],
      recommendedJobs: [
        {
          id: '1',
          title: 'Data Analyst Intern',
          company: 'Banco Nacional',
          location: 'Medellín',
          match: 88,
          salary: '$2,000,000 - $2,800,000'
        }
      ],
      projects: [
        {
          id: '1',
          name: 'Financial Dashboard',
          description: 'Business intelligence dashboard for financial analysis',
          status: 'in_progress',
          technologies: ['Power BI', 'SQL', 'Excel']
        }
      ],
      upcomingEvents: []
    },
    'jorge@example.com': {
      stats: {
        applications: 6,
        interviews: 1,
        offers: 0,
        completedProjects: 12,
        skillsProgress: 80
      },
      recentApplications: [],
      recommendedJobs: [
        {
          id: '1',
          title: 'UI/UX Designer',
          company: 'Creative Agency',
          location: 'Cali',
          match: 92,
          salary: '$2,200,000 - $3,000,000'
        }
      ],
      projects: [
        {
          id: '1',
          name: 'Mobile App Design',
          description: 'Complete UI/UX design for a food delivery app',
          status: 'completed',
          technologies: ['Figma', 'Adobe XD', 'Prototyping']
        }
      ],
      upcomingEvents: []
    },
    'empresa1@techcorp.com': {
      stats: {
        activeJobs: 8,
        totalApplications: 156,
        newApplicationsThisWeek: 23,
        qualifiedCandidates: 45,
        qualificationRate: 29,
        hires: 12,
        hireRate: 8,
        newJobsThisWeek: 2
      },
      recentJobs: [
        {
          title: 'Senior Full Stack Developer',
          department: 'Engineering',
          location: 'Bogotá',
          applications: 34,
          status: 'active'
        },
        {
          title: 'Product Manager',
          department: 'Product',
          location: 'Remote',
          applications: 28,
          status: 'active'
        }
      ],
      topCandidates: [],
      upcomingInterviews: []
    },
    'empresa2@innovatech.com': {
      stats: {
        activeJobs: 3,
        totalApplications: 67,
        newApplicationsThisWeek: 12,
        qualifiedCandidates: 18,
        qualificationRate: 27,
        hires: 5,
        hireRate: 7,
        newJobsThisWeek: 1
      },
      recentJobs: [
        {
          title: 'Machine Learning Engineer',
          department: 'R&D',
          location: 'Medellín',
          applications: 15,
          status: 'active'
        }
      ],
      topCandidates: [],
      upcomingInterviews: []
    }
  };

  setCurrentUser(email: string): any {
    const userData = this.mockUsers[email];
    if (userData) {
      this.currentUser = userData;
    }
    return userData;
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  getUserByEmail(email: string): UserProfile | null {
    return this.mockUsers[email] || null;
  }

  updateUserProfile(updates: Partial<UserProfile>): void {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...updates };
    }
  }

  getUserDashboardData(email: string): any {
    return this.mockDashboardData[email] || null;
  }

  clearUser(): void {
    this.currentUser = null;
  }
}

// Create singleton instance
const userContextService = new UserContextService();

// Export functions for easy use
export const getUserContext = (email: string) => userContextService.getUserByEmail(email);
export const setUserContext = (email: string) => userContextService.setCurrentUser(email);
export const getCurrentUser = () => userContextService.getCurrentUser();
export const getUserDashboardData = (email: string) => userContextService.getUserDashboardData(email);
export const updateUserProfile = (updates: any) => userContextService.updateUserProfile(updates);
export const clearUserContext = () => userContextService.clearUser();
