import { apiService } from './api';

export interface UserRegistrationTemplate {
  id: string;
  type: 'student' | 'company';
  name: string;
  email: string;
  phone?: string;
  university?: string;
  career?: string;
  semester?: number;
  company_name?: string;
  position?: string;
  industry?: string;
  location: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  customization: {
    primaryColor: string;
    secondaryColor: string;
    welcomeMessage: string;
    companyLogo?: string;
  };
  invitedBy?: string;
  invitationToken?: string;
  expiresAt?: string;
}

export interface RegistrationData {
  templateId: string;
  name: string;
  email: string;
  phone?: string;
  university?: string;
  career?: string;
  semester?: number;
  company_name?: string;
  position?: string;
  industry?: string;
  location: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  password: string;
}

class UserRegistrationService {
  private baseUrl = (typeof window !== 'undefined' && (window as any).env?.REACT_APP_API_URL) || 'http://localhost:8000';

  // Generate unique registration URL for a user
  async generateRegistrationLink(userData: Partial<UserRegistrationTemplate>): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/registration/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate registration link');
      }

      const data = await response.json();
      return `${window.location.origin}/register/${data.registrationId}`;
    } catch (error) {
      console.error('Error generating registration link:', error);
      throw error;
    }
  }

  // Get user template by registration ID
  async getUserTemplate(registrationId: string): Promise<UserRegistrationTemplate | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/registration/${registrationId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch user template');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user template:', error);
      throw error;
    }
  }

  // Complete registration with template data
  async completeRegistration(data: RegistrationData): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/registration/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to complete registration');
      }

      return await response.json();
    } catch (error) {
      console.error('Error completing registration:', error);
      throw error;
    }
  }

  // Create multiple registration templates (bulk invite)
  async createBulkRegistrations(users: Partial<UserRegistrationTemplate>[]): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/registration/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ users }),
      });

      if (!response.ok) {
        throw new Error('Failed to create bulk registrations');
      }

      const data = await response.json();
      return data.registrationLinks;
    } catch (error) {
      console.error('Error creating bulk registrations:', error);
      throw error;
    }
  }

  // Get registration analytics
  async getRegistrationAnalytics(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/registration/analytics`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch registration analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching registration analytics:', error);
      throw error;
    }
  }

  // Validate registration token
  async validateRegistrationToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/registration/validate/${token}`);
      return response.ok;
    } catch (error) {
      console.error('Error validating registration token:', error);
      return false;
    }
  }

  // Send registration invitation via email
  async sendRegistrationInvitation(email: string, template: Partial<UserRegistrationTemplate>): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/registration/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, template }),
      });

      if (!response.ok) {
        throw new Error('Failed to send registration invitation');
      }
    } catch (error) {
      console.error('Error sending registration invitation:', error);
      throw error;
    }
  }

  // Pre-defined templates for common scenarios
  getStudentTemplate(overrides: Partial<UserRegistrationTemplate> = {}): Partial<UserRegistrationTemplate> {
    return {
      type: 'student',
      customization: {
        primaryColor: '#FF258D',
        secondaryColor: '#390062',
        welcomeMessage: '¡Completa tu perfil estudiantil para encontrar las mejores oportunidades!',
      },
      skills: [],
      interests: [],
      ...overrides,
    };
  }

  getCompanyTemplate(overrides: Partial<UserRegistrationTemplate> = {}): Partial<UserRegistrationTemplate> {
    return {
      type: 'company',
      customization: {
        primaryColor: '#390062',
        secondaryColor: '#FF258D',
        welcomeMessage: '¡Configura tu perfil empresarial para conectar con talento estudiantil!',
      },
      ...overrides,
    };
  }

  // University-specific templates
  getUniversityTemplate(universityName: string, universityLogo?: string): Partial<UserRegistrationTemplate> {
    const universityColors = {
      'Universidad Nacional Mayor de San Marcos': { primary: '#FFD700', secondary: '#8B0000' },
      'Pontificia Universidad Católica del Perú': { primary: '#003366', secondary: '#FFD700' },
      'Universidad de Lima': { primary: '#0066CC', secondary: '#FF6600' },
      'Universidad Peruana Cayetano Heredia': { primary: '#006633', secondary: '#FFFFFF' },
    };

    const colors = universityColors[universityName] || { primary: '#FF258D', secondary: '#390062' };

    return {
      type: 'student',
      university: universityName,
      customization: {
        primaryColor: colors.primary,
        secondaryColor: colors.secondary,
        welcomeMessage: `¡Bienvenido estudiante de ${universityName}! Completa tu perfil para acceder a oportunidades exclusivas.`,
        companyLogo: universityLogo,
      },
    };
  }

  // Company-specific templates
  getCompanyBrandTemplate(companyName: string, companyLogo?: string, brandColors?: { primary: string; secondary: string }): Partial<UserRegistrationTemplate> {
    return {
      type: 'company',
      company_name: companyName,
      customization: {
        primaryColor: brandColors?.primary || '#390062',
        secondaryColor: brandColors?.secondary || '#FF258D',
        welcomeMessage: `¡Bienvenido a ${companyName}! Configura tu perfil para encontrar el mejor talento estudiantil.`,
        companyLogo: companyLogo,
      },
    };
  }
}

export const userRegistrationService = new UserRegistrationService();
