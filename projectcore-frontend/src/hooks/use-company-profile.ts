import { useState, useEffect } from 'react';
import { CompanyResponse, CompanyCreate, apiService } from '@/services/api';

export interface CompanyProfileState {
  profile: CompanyResponse | null;
  loading: boolean;
  error: string | null;
}

export const useCompanyProfile = (companyId?: number) => {
  const [state, setState] = useState<CompanyProfileState>({
    profile: null,
    loading: false,
    error: null
  });

  // Load company profile
  const loadProfile = async (id: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const profile = await apiService.getCompany(id);
      setState(prev => ({ ...prev, profile, loading: false }));
      return profile;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar el perfil';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  };

  // Update company profile
  const updateProfile = async (id: number, data: CompanyCreate) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const updatedProfile = await apiService.updateCompany(id, data);
      setState(prev => ({ ...prev, profile: updatedProfile, loading: false }));
      return updatedProfile;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el perfil';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  };

  // Create company profile
  const createProfile = async (data: CompanyCreate) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const newProfile = await apiService.createCompany(data);
      setState(prev => ({ ...prev, profile: newProfile, loading: false }));
      return newProfile;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear el perfil';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  };

  // Load profile on mount if companyId is provided
  useEffect(() => {
    if (companyId) {
      loadProfile(companyId);
    }
  }, [companyId]);

  return {
    ...state,
    loadProfile,
    updateProfile,
    createProfile,
    refreshProfile: () => companyId && loadProfile(companyId)
  };
};
