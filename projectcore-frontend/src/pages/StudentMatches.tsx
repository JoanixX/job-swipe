import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, Zap, MessageSquare } from 'lucide-react';
import StudentAppLayout from '../components/StudentAppLayout';
import { useUser } from '../lib/user-context';
import { useQuery } from '@tanstack/react-query';
import { swipeAPI, jobOfferAPI, companyAPI } from '../services/backend-api';

export default function StudentMatches() {
  const [_, setLocation] = useLocation();
  const { user } = useUser();
  const studentId = user?.profileData?.related_id || user?.id || 0;

  // 1. Fetch Matches
  const { data: rawMatches = [], isLoading: isLoadingMatches } = useQuery({
    queryKey: ['matches', studentId],
    queryFn: () => swipeAPI.getStudentMatches(studentId),
    enabled: !!studentId
  });

  // 2. Fetch Details (Jobs, Companies)
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!rawMatches || rawMatches.length === 0) {
        setMatches([]);
        return;
      }
      
      setIsLoadingDetails(true);
      try {
        const matchesWithDetails = await Promise.all(
          rawMatches.map(async (match) => {
            try {
              const jobOffer = await jobOfferAPI.getById(match.job_offer_id);
              let companyName = 'Empresa Desconocida';
              let location = 'Remoto';
              
              if (jobOffer.company_id) {
                const company = await companyAPI.getById(jobOffer.company_id);
                companyName = company.name || company.company_name || 'Empresa';
                location = company.location || 'Lima';
              }
              
              return {
                id: match.id || match.job_offer_id,
                role: jobOffer.title,
                company: companyName,
                location: location,
                dateMatched: new Date(match.match_date || Date.now()).toLocaleDateString(),
                hasMessage: false, // Could be extended to check messages table
                messagePreview: ''
              };
            } catch (err) {
              console.error("Error fetching match details", err);
              return {
                id: match.id || match.job_offer_id,
                role: `Oferta #${match.job_offer_id}`,
                company: 'Empresa',
                location: 'Desconocido',
                dateMatched: 'Desconocido',
                hasMessage: false
              };
            }
          })
        );
        setMatches(matchesWithDetails);
      } catch (err) {
        console.error("Error building matches array", err);
      } finally {
        setIsLoadingDetails(false);
      }
    };
    
    fetchDetails();
  }, [rawMatches]);

  return (
    <StudentAppLayout activePage="matches">
      
      {/* Header */}
      <div className="py-4 px-6 flex items-center bg-white sticky top-0 z-20 border-b border-gray-50">
        <button 
          onClick={() => setLocation('/matching')}
          className="mr-4 text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Mis Matches</h1>
      </div>
      
      <div className="p-6">
        
        {/* Banner Interés Mutuo */}
        <div className="bg-[#fff0f7] border border-[#ffd6e8] rounded-2xl p-5 mb-8 flex gap-4">
          <div className="mt-1">
            <Zap className="w-6 h-6 text-[#FD297B] fill-[#FD297B]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#FD297B] mb-1">¡Interés Mutuo!</h2>
            <p className="text-[#d81e6b] text-sm leading-relaxed">
              Estas empresas también están interesadas en ti. Pueden contactarte directamente.
            </p>
          </div>
        </div>

        {/* Matches List */}
        <div className="space-y-4">
          {(isLoadingMatches || isLoadingDetails) ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-[#FD297B]/20 border-t-[#FD297B] rounded-full animate-spin"></div>
            </div>
          ) : matches.length > 0 ? (
            matches.map((match) => (
              <div key={match.id} className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-50 relative overflow-hidden">
                
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                    <BriefcaseIcon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-bold text-gray-900 text-[15px] leading-tight mb-1">{match.role}</h3>
                    <p className="text-gray-500 text-sm">{match.company}</p>
                    <p className="text-gray-400 text-xs mt-1">{match.location}</p>
                  </div>
                </div>
                
                {match.hasMessage && (
                  <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 mb-4 flex gap-3">
                    <MessageSquare className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-blue-800 text-xs leading-relaxed italic">
                      "{match.messagePreview}"
                    </p>
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-400">Match {match.dateMatched}</span>
                  <button className="bg-[#2e3192] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#1a1c5b] transition-colors">
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))
          ) : (
             <div className="text-center p-8 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500 mb-4">Aún no tienes matches. ¡Sigue explorando ofertas!</p>
                <button 
                  onClick={() => setLocation('/matching')}
                  className="px-4 py-2 bg-[#2e3192] text-white rounded-lg text-sm font-semibold"
                >
                  Seguir buscando
                </button>
             </div>
          )}
        </div>
      </div>
      
    </StudentAppLayout>
  );
}

function BriefcaseIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
