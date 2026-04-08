// Backend API service for ProjectCore platform
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://cy-backend-ch-b8f4h8bqh9epepcr.chilecentral-01.azurewebsites.net/api'
  : '/api';

// User registration and authentication types
export interface UserRegistration {
  email: string;
  password: string;
  dni: string;
  name: string;
  location: string;
  role: 'student' | 'company';
  related_id: number;
  cv_url?: string;
  date_of_birth?: string;
  main_motivation?: string;
  description?: string;
  ruc?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Types based on backend schemas
export interface JobOfferCreate {
  company_id: number;
  title: string;
  description: string;
  required_hours: number;
  approximated_salary: number;
  duration: number;
  start_date: string;
  area_id: number;
  experience_id: number;
  modality: number;
}

export interface JobOfferResponse {
  id: number;
  company_id: number;
  title: string;
  description: string;
  required_hours: number;
  approximated_salary: number;
  duration: number;
  start_date: string;
  area_id: number;
  experience_id: number;
  modality: number;
  embedding?: any;
}

export interface MatchJobStudentResponse {
  id?: number;
  student_id: number;
  job_offer_id: number;
  score: number;
  match_date: string;
  rank: number;
}

// API helper function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    },
    mode: 'cors',
    credentials: 'omit'
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
};

// Job Offer API functions
export const jobOfferAPI = {
  // Create a new job offer
  create: async (jobOffer: JobOfferCreate): Promise<any> => {
    return apiRequest('/register/job_offer', {
      method: 'POST',
      body: JSON.stringify(jobOffer)
    });
  },

  // Get all job offers
  getAll: async (): Promise<JobOfferResponse[]> => {
    return apiRequest('/job_offer/all');
  },

  // Get job offer by ID
  getById: async (jobOfferId: number): Promise<JobOfferResponse> => {
    return apiRequest(`/job_offer/${jobOfferId}`);
  },

  // Get job offers by company
  getByCompany: async (companyId: number): Promise<JobOfferResponse[]> => {
    return apiRequest(`/company/${companyId}/job_offers`);
  },

  // Update job offer
  update: async (jobOfferId: number, jobOffer: JobOfferCreate): Promise<JobOfferResponse> => {
    return apiRequest(`/job_offer/${jobOfferId}`, {
      method: 'PUT',
      body: JSON.stringify(jobOffer)
    });
  },

  // Delete job offer
  delete: async (jobOfferId: number): Promise<any> => {
    return apiRequest(`/job_offer/${jobOfferId}`, {
      method: 'DELETE'
    });
  }
};

// AI Matching API functions
export const aiMatchingAPI = {
  // Get best students for a job offer (for companies)
  getBestStudentsForJob: async (jobOfferId: number): Promise<MatchJobStudentResponse[]> => {
    return apiRequest(`/aimodel/job_offer/best_students/${jobOfferId}`, {
      method: 'POST'
    });
  },

  // Get best job offers for a student (for students)
  getBestJobsForStudent: async (studentId: number): Promise<MatchJobStudentResponse[]> => {
    return apiRequest(`/aimodel/student/best_job_offers/${studentId}`, {
      method: 'POST'
    });
  }
};

// Student API functions
export const studentAPI = {
  // Get student by ID
  getById: async (studentId: number): Promise<any> => {
    return apiRequest(`/student/${studentId}`);
  },

  // Get all students
  getAll: async (): Promise<any[]> => {
    return apiRequest('/student/all');
  }
};

// Company API functions
export const companyAPI = {
  // Get company by ID
  getById: async (companyId: number): Promise<any> => {
    return apiRequest(`/company/${companyId}`);
  },

  // Get all companies
  getAll: async (): Promise<any[]> => {
    return apiRequest('/company/all');
  }
};

// Agreement types based on Azure backend
export interface AgreementCreate {
  job_offer_id: number;
  student_id: number;
  start_date: string;
  end_date: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
}

export interface AgreementResponse {
  id: number;
  job_offer_id: number;
  student_id: number;
  start_date: string;
  end_date: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

// Agreement API functions
export const agreementAPI = {
  // Create new agreement
  create: async (agreement: AgreementCreate): Promise<any> => {
    return apiRequest('/register/agreement', {
      method: 'POST',
      body: JSON.stringify(agreement)
    });
  },

  // Get all agreements
  getAll: async (): Promise<AgreementResponse[]> => {
    return apiRequest('/agreement/all');
  },

  // Get agreement by ID
  getById: async (agreementId: number): Promise<AgreementResponse> => {
    return apiRequest(`/agreement/${agreementId}`);
  },

  // Update agreement
  update: async (agreementId: number, agreement: Partial<AgreementCreate>): Promise<AgreementResponse> => {
    return apiRequest(`/agreement/${agreementId}`, {
      method: 'PUT',
      body: JSON.stringify(agreement)
    });
  },

  // Delete agreement
  delete: async (agreementId: number): Promise<any> => {
    return apiRequest(`/agreement/${agreementId}`, {
      method: 'DELETE'
    });
  },

  // Get agreements by student
  getByStudent: async (studentId: number): Promise<AgreementResponse[]> => {
    return apiRequest(`/student/${studentId}/agreements`);
  },

  // Get agreements by job offer
  getByJobOffer: async (jobOfferId: number): Promise<AgreementResponse[]> => {
    return apiRequest(`/job_offer/${jobOfferId}/agreements`);
  }
};

// Area types based on Azure backend
export interface AreaCreate {
  name: string;
}

export interface AreaResponse {
  id: number;
  name: string;
}

// Experience Detail types
export interface ExperienceDetailCreate {
  student_id: number;
  job_offer_id: number;
  name: string;
  description: string;
  duration_in_months: number;
}

export interface ExperienceDetailResponse {
  id: number;
  student_id: number;
  job_offer_id: number;
  name: string;
  description: string;
  duration_in_months: number;
}

// Skill types
export interface SkillResponse {
  id: number;
  name: string;
}

// Interest types
export interface InterestResponse {
  id: number;
  name: string;
}

// Areas and Experience API functions
export const catalogAPI = {
  // Areas
  createArea: async (area: AreaCreate): Promise<AreaResponse> => {
    return apiRequest('/register/area', {
      method: 'POST',
      body: JSON.stringify(area)
    });
  },

  getAreas: async (): Promise<AreaResponse[]> => {
    return apiRequest('/area/all');
  },

  getAreaById: async (areaId: number): Promise<AreaResponse> => {
    return apiRequest(`/area/${areaId}`);
  },

  deleteArea: async (areaId: number): Promise<any> => {
    return apiRequest(`/area/${areaId}`, {
      method: 'DELETE'
    });
  },

  // Experience Details
  createExperienceDetail: async (experience: ExperienceDetailCreate): Promise<any> => {
    return apiRequest('/register/experience_detail', {
      method: 'POST',
      body: JSON.stringify(experience)
    });
  },

  getAllExperienceDetails: async (): Promise<ExperienceDetailResponse[]> => {
    return apiRequest('/experience_detail/all', {
      method: 'POST'
    });
  },

  getExperienceDetailById: async (experienceId: number): Promise<ExperienceDetailResponse> => {
    return apiRequest(`/experience_detail/${experienceId}`);
  },

  updateExperienceDetail: async (experienceId: number, experience: Partial<ExperienceDetailCreate>): Promise<ExperienceDetailResponse> => {
    return apiRequest(`/experience_detail/${experienceId}`, {
      method: 'PUT',
      body: JSON.stringify(experience)
    });
  },

  deleteExperienceDetail: async (experienceId: number): Promise<any> => {
    return apiRequest(`/experience_detail/${experienceId}`, {
      method: 'DELETE'
    });
  },

  getStudentExperienceDetails: async (studentId: number): Promise<ExperienceDetailResponse[]> => {
    return apiRequest(`/student/${studentId}/experience_details`);
  },

  getJobOfferExperienceDetails: async (jobOfferId: number): Promise<ExperienceDetailResponse[]> => {
    return apiRequest(`/job_offer/${jobOfferId}/experience_details`);
  },

  // Skills
  getSkills: async (): Promise<SkillResponse[]> => {
    return apiRequest('/skill/all');
  },

  // Student Skills
  addStudentSkill: async (studentId: number, skillId: number): Promise<any> => {
    return apiRequest('/student/student_skill', {
      method: 'POST',
      body: JSON.stringify({ student_id: studentId, skill_id: skillId })
    });
  },

  getStudentSkills: async (studentId: number): Promise<SkillResponse[]> => {
    return apiRequest(`/student/${studentId}/skills`);
  },

  deleteStudentSkill: async (studentId: number, skillId: number): Promise<any> => {
    return apiRequest(`/student/${studentId}/skill/${skillId}`, {
      method: 'DELETE'
    });
  },

  // Interests
  getInterests: async (): Promise<InterestResponse[]> => {
    return apiRequest('/interest/all');
  },

  // Student Interests
  addStudentInterest: async (studentId: number, interestId: number): Promise<any> => {
    return apiRequest('/student/student_interest', {
      method: 'POST',
      body: JSON.stringify({ student_id: studentId, interest_id: interestId })
    });
  },

  getStudentInterests: async (studentId: number): Promise<InterestResponse[]> => {
    return apiRequest(`/student/${studentId}/interests`);
  },

  deleteStudentInterest: async (studentId: number, interestId: number): Promise<any> => {
    return apiRequest(`/student/${studentId}/interest/${interestId}`, {
      method: 'DELETE'
    });
  }
};

// Authentication API functions
export const authAPI = {
  // User registration
  register: async (userData: UserRegistration): Promise<any> => {
    return apiRequest('/register/user', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // User login
  login: async (credentials: LoginCredentials): Promise<any> => {
    return apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  // Get user by email
  getUserByEmail: async (email: string): Promise<any> => {
    return apiRequest(`/user/${email}`);
  }
};

export default {
  authAPI,
  jobOfferAPI,
  aiMatchingAPI,
  studentAPI,
  companyAPI,
  agreementAPI,
  catalogAPI
};
