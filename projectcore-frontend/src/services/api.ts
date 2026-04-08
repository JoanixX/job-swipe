// API service for connecting to the ProjectCore backend
const API_BASE_URL = 'http://localhost:8001/api'; // ProjectCore_code-s5 backend URL

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
  modality: number; // 1: Presencial, 2: Remoto, 3: Híbrido
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

export interface CompanyCreate {
  email: string;
  password: string;
  name: string;
  description: string;
  industry: string;
  location: string;
  website?: string;
}

export interface CompanyResponse {
  id: number;
  email: string;
  name: string;
  description: string;
  industry: string;
  location: string;
  website?: string;
}

export interface MatchJobStudentResponse {
  id?: number;
  student_id: number;
  job_offer_id: number;
  match_score: number;
  student_name: string;
  student_career: string;
  student_skills: string[];
  student_experience: string;
  student_location: string;
  ai_reason: string;
  embedding_similarity: number;
  // Additional properties for UI compatibility
  name?: string;
  career?: string;
  matchScore?: number;
  skills?: string[];
  experience?: string;
  location?: string;
  availability?: string;
  aiReason?: string;
  profileStrength?: number;
  isNew?: boolean;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Job Offer methods
  async createJobOffer(jobOffer: JobOfferCreate): Promise<any> {
    return this.request('/register/job_offer', {
      method: 'POST',
      body: JSON.stringify(jobOffer),
    });
  }

  async getAllJobOffers(): Promise<JobOfferResponse[]> {
    return this.request('/job_offer/all');
  }

  async getJobOffer(id: number): Promise<JobOfferResponse> {
    return this.request(`/job_offer/${id}`);
  }

  async getCompanyJobOffers(companyId: number): Promise<JobOfferResponse[]> {
    return this.request(`/company/${companyId}/job_offers`);
  }

  async updateJobOffer(id: number, jobOffer: JobOfferCreate): Promise<JobOfferResponse> {
    return this.request(`/job_offer/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobOffer),
    });
  }

  async deleteJobOffer(id: number): Promise<any> {
    return this.request(`/job_offer/${id}`, {
      method: 'DELETE',
    });
  }

  // Company methods
  async createCompany(company: CompanyCreate): Promise<any> {
    return this.request('/register/company', {
      method: 'POST',
      body: JSON.stringify(company),
    });
  }

  async getAllCompanies(): Promise<CompanyResponse[]> {
    return this.request('/company/all');
  }

  async getCompany(id: number): Promise<CompanyResponse> {
    return this.request(`/company/${id}`);
  }

  async updateCompany(id: number, company: CompanyCreate): Promise<CompanyResponse> {
    return this.request(`/company/${id}`, {
      method: 'PUT',
      body: JSON.stringify(company),
    });
  }

  async deleteCompany(id: number): Promise<any> {
    return this.request(`/company/${id}`, {
      method: 'DELETE',
    });
  }

  // AI Matching methods
  async getBestStudentsForJob(jobOfferId: number): Promise<MatchJobStudentResponse[]> {
    return this.request(`/aimodel/job_offer/best_students/${jobOfferId}`, {
      method: 'POST',
    });
  }

  // Areas and Experience methods (for dropdowns)
  async getAllAreas(): Promise<any[]> {
    return this.request('/area/all');
  }

  async getAllExperienceDetails(): Promise<any[]> {
    return this.request('/experience_detail/all');
  }

  async getAllSkills(): Promise<any[]> {
    return this.request('/skill/all');
  }
}

export const apiService = new ApiService();
