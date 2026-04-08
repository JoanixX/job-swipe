import { useState, useEffect } from 'react';
import { apiService, JobOfferCreate, JobOfferResponse, MatchJobStudentResponse } from '@/services/api';

export const useJobOffers = (companyId?: number) => {
  const [jobOffers, setJobOffers] = useState<JobOfferResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobOffers = async () => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const offers = await apiService.getCompanyJobOffers(companyId);
      setJobOffers(offers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching job offers');
      console.error('Error fetching job offers:', err);
    } finally {
      setLoading(false);
    }
  };

  const createJobOffer = async (jobOfferData: JobOfferCreate) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiService.createJobOffer(jobOfferData);
      await fetchJobOffers(); // Refresh the list
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating job offer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateJobOffer = async (id: number, jobOfferData: JobOfferCreate) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiService.updateJobOffer(id, jobOfferData);
      await fetchJobOffers(); // Refresh the list
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating job offer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteJobOffer = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      await apiService.deleteJobOffer(id);
      await fetchJobOffers(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting job offer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAIMatches = async (jobOfferId: number): Promise<MatchJobStudentResponse[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const matches = await apiService.getBestStudentsForJob(jobOfferId);
      return matches;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error getting AI matches');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchJobOffers();
    }
  }, [companyId]);

  return {
    jobOffers,
    loading,
    error,
    createJobOffer,
    updateJobOffer,
    deleteJobOffer,
    getAIMatches,
    refetch: fetchJobOffers
  };
};
