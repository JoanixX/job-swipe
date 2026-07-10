import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import SwipeCard from "@/components/SwipeCard";
import MatchModal from "@/components/MatchModal";
import SearchFilters from "@/components/SearchFilters";
import { aiMatchingAPI, swipeAPI } from "@/services/backend-api";
import { useUser } from "@/lib/user-context";
import StudentAppLayout from "@/components/StudentAppLayout";

interface Match {
  id: number;
  name: string;
  email: string;
}

export default function MatchingPage() {
  const { user } = useUser();
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentMatchedUser, setCurrentMatchedUser] = useState<Match | null>(null);
  
  const studentId = user?.profileData?.related_id || user?.id || 0;
  
  const { data: potentialMatches = [], isLoading, refetch } = useQuery<any[]>({
    queryKey: ['/api/aimodel/student/best_job_offers', studentId],
    queryFn: () => aiMatchingAPI.getBestJobsForStudent(studentId),
    enabled: !!studentId,
  });
  
  const swipeMutation = useMutation({
    mutationFn: async ({ swiperId, swipedId, direction }: { swiperId: number, swipedId: number, direction: 'left' | 'right' }) => {
      const liked = direction === 'right';
      return await swipeAPI.studentSwipe(swiperId, swipedId, liked);
    },
    onSuccess: (data) => {
      if (data.mutual_match) {
        const matchedJob = potentialMatches.find((match: any) => match.job_offer_id === swipeMutation.variables?.swipedId);
        if (matchedJob) {
          setCurrentMatchedUser(matchedJob);
          setShowMatchModal(true);
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/users', studentId, 'matches'] });
    },
  });
  
  const handleSwipe = (direction: 'left' | 'right', swipedId: number) => {
    if (!studentId) return;
    
    swipeMutation.mutate({
      swiperId: studentId,
      swipedId,
      direction: direction === 'right' ? 'right' : 'left',
    });
  };
  
  return (
    <StudentAppLayout activePage="inicio">
      
      {/* Top Header */}
      <div className="py-4 px-6 flex items-center justify-between bg-white sticky top-0 z-20">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-[#2e3192]">JobSwipe</h1>
        </div>
        <button 
          onClick={() => setShowFilters(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line>
            <line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
          </svg>
        </button>
      </div>
      
      {/* Main Swipe Area */}
      <div className="flex-1 flex flex-col items-center justify-start pt-4 px-6 relative min-h-[700px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 mt-20">
            <div className="w-12 h-12 border-4 border-[#2e3192]/20 border-t-[#2e3192] rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Buscando oportunidades...</p>
          </div>
        ) : potentialMatches.length > 0 ? (
          <div className="w-full relative h-[600px] mb-24">
            {potentialMatches
              .map((match: any, index: number) => (
              <SwipeCard 
                key={match.id || match.job_offer_id}
                user={match}
                isTop={index === 0}
                onSwipe={(direction) => handleSwipe(direction, match.job_offer_id || match.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-8 mt-12 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-sm w-full mx-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">No hay más ofertas</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">Hemos buscado en toda nuestra base de datos, pero en este momento no hay más ofertas para tu perfil.</p>
            <button 
              onClick={() => refetch()}
              className="w-full py-4 bg-[#2e3192] hover:bg-[#1a1c5b] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all duration-300"
            >
              Volver a buscar
            </button>
          </div>
        )}
      </div>
      
      {/* Match Modal */}
      {showMatchModal && currentMatchedUser && (
        <MatchModal 
          matchedUser={currentMatchedUser} 
          onClose={() => setShowMatchModal(false)} 
        />
      )}

      {/* Filters Modal */}
      {showFilters && (
        <SearchFilters 
          onClose={() => setShowFilters(false)}
          onApply={(filters) => {
            console.log("Filtros aplicados:", filters);
            setShowFilters(false);
            // Here you would trigger a refetch with the new filters
            // refetch();
          }}
        />
      )}
      
    </StudentAppLayout>
  );
}
