import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { MapPin, Banknote, SlidersHorizontal, LayoutGrid, Layers, Heart, X, Sparkles } from "lucide-react";
import SwipeCard from "@/components/SwipeCard";
import CompatibilityBadge from "@/components/CompatibilityBadge";
import MatchModal from "@/components/MatchModal";
import SearchFilters from "@/components/SearchFilters";
import JobDetailsModal from "@/components/JobDetailsModal";
import ThemeToggle from "@/components/ThemeToggle";
import { aiMatchingAPI, jobOfferAPI, companyAPI, swipeAPI } from "@/services/backend-api";
import { useUser } from "@/lib/user-context";
import StudentAppLayout from "@/components/StudentAppLayout";

interface Match {
  id: number;
  name: string;
  email: string;
}

type ViewMode = 'normal' | 'swipe';

const getModalityText = (modality: any) => {
  if (modality === 1 || modality === '1') return 'Presencial';
  if (modality === 2 || modality === '2') return 'Remoto';
  if (modality === 3 || modality === '3') return 'Híbrido';
  return 'No especificada';
};

export default function MatchingPage() {
  const { user } = useUser();
  const [viewMode, setViewMode] = useState<ViewMode>('swipe');
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentMatchedUser, setCurrentMatchedUser] = useState<Match | null>(null);
  const [selectedJobDetails, setSelectedJobDetails] = useState<any>(null);
  // Dirección forzada por los botones del modo swipe; la tarjeta superior la consume
  const [forcedExit, setForcedExit] = useState<'left' | 'right' | null>(null);

  const studentId = user?.profileData?.related_id || user?.id || 0;

  // Matching IA primero; si falla o viene vacío, se cae a la lista completa de ofertas
  const { data: potentialMatches = [], isLoading, refetch } = useQuery<any[]>({
    queryKey: ['/api/aimodel/student/best_job_offers', studentId],
    queryFn: async () => {
      try {
        const aiMatches = await aiMatchingAPI.getBestJobsForStudent(Number(studentId));
        if (aiMatches && aiMatches.length > 0) return aiMatches;
      } catch (e) {
        console.error('Matching IA no disponible, usando lista de ofertas', e);
      }
      // Fallback: todas las ofertas + nombre de empresa
      const [offers, companies] = await Promise.all([
        jobOfferAPI.getAll(),
        companyAPI.getAll().catch(() => [] as any[]),
      ]);
      const companyName = new Map(companies.map((c: any) => [c.id, c.name]));
      return offers.map((offer: any) => ({
        ...offer,
        job_offer_id: offer.id,
        company_name: companyName.get(offer.company_id) || 'Empresa',
      }));
    },
    enabled: !!studentId,
  });

  const swipeMutation = useMutation({
    mutationFn: async ({ swiperId, swipedId, direction }: { swiperId: number, swipedId: number, direction: 'left' | 'right' }) => {
      const liked = direction === 'right';
      return await swipeAPI.studentSwipe(swiperId, swipedId, liked);
    },
    // La tarjeta se quita ANTES de esperar al servidor: la siguiente aparece al instante
    onMutate: async (variables) => {
      const matchedJob = potentialMatches.find((match: any) => match.job_offer_id === variables.swipedId);
      queryClient.setQueryData(['/api/aimodel/student/best_job_offers', studentId], (oldData: any) => {
        if (!oldData) return [];
        return oldData.filter((match: any) => match.job_offer_id !== variables.swipedId);
      });
      return { matchedJob };
    },
    onSuccess: (data, _variables, context) => {
      if (data.mutual_match && context?.matchedJob) {
        setCurrentMatchedUser(context.matchedJob);
        setShowMatchModal(true);
      }
      // Refresca matches, postulaciones y estadísticas en las demás páginas
      queryClient.invalidateQueries({ queryKey: ['student-matches'] });
      queryClient.invalidateQueries({ queryKey: ['student-applications'] });
    },
  });

  const handleSwipe = (direction: 'left' | 'right', swipedId: number) => {
    if (!studentId) return;
    setForcedExit(null);

    swipeMutation.mutate({
      swiperId: Number(studentId),
      swipedId,
      direction: direction === 'right' ? 'right' : 'left',
    });
  };

  const renderEmptyState = () => (
    <div className="text-center p-8 mt-12 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm max-w-sm w-full mx-auto">
      <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <Sparkles className="h-10 w-10 text-gray-300 dark:text-gray-600" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">No hay más ofertas</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">Hemos buscado en toda nuestra base de datos, pero en este momento no hay más ofertas para tu perfil.</p>
      <button
        onClick={() => refetch()}
        className="w-full py-4 bg-[#1E3A8A] hover:bg-[#27479E] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all duration-300"
      >
        Volver a buscar
      </button>
    </div>
  );

  const renderNormalMode = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-4 md:px-8 pb-10">
      {potentialMatches.map((offer: any) => (
        <div
          key={offer.job_offer_id || offer.id}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">{offer.title || 'Vacante'}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{offer.company_name || 'Empresa'}</p>
            </div>
            <div className="shrink-0 ml-3">
              <CompatibilityBadge score={offer.match_score} />
            </div>
          </div>

          <div className="space-y-1.5 mb-4">
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
              <MapPin className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
              <span>{offer.location || 'Lima'} · <span className="text-[#6366F1] font-medium">{getModalityText(offer.modality)}</span></span>
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
              <Banknote className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
              <span>{offer.approximated_salary ? `S/ ${offer.approximated_salary}` : 'A tratar'}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5 line-clamp-2 flex-1">
            {offer.description || 'Sin descripción disponible.'}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSwipe('left', offer.job_offer_id || offer.id)}
              className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 font-semibold text-sm transition-colors"
            >
              <X className="w-4 h-4" />
              Descartar
            </button>
            <button
              onClick={() => handleSwipe('right', offer.job_offer_id || offer.id)}
              className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#27479E] text-white font-semibold text-sm transition-colors"
            >
              <Heart className="w-4 h-4" />
              Postular
            </button>
          </div>

          <button
            onClick={() => setSelectedJobDetails(offer)}
            className="mt-3 text-sm text-[#6366F1] hover:underline font-medium"
          >
            Ver detalles completos
          </button>
        </div>
      ))}
    </div>
  );

  const topCard = potentialMatches[0];

  const renderSwipeMode = () => (
    <div className="flex flex-col items-center px-6">
      {/* Baraja: solo las 3 primeras tarjetas, la superior es arrastrable */}
      <div className="w-full max-w-sm relative h-[520px] mx-auto">
        {potentialMatches.slice(0, 3).map((match: any, index: number) => (
          <SwipeCard
            key={match.job_offer_id || match.id}
            user={match}
            index={index}
            forcedExit={index === 0 ? forcedExit : null}
            onSwipe={(direction) => handleSwipe(direction, match.job_offer_id || match.id)}
            onViewDetails={(job) => setSelectedJobDetails(job)}
          />
        ))}
      </div>

      {/* Botones de acción, fuera de la baraja */}
      <div className="flex items-center justify-center gap-8 mt-6 mb-3">
        <button
          onClick={() => topCard && setForcedExit('left')}
          aria-label="Pasar oferta"
          className="w-16 h-16 rounded-full bg-white dark:bg-gray-900 shadow-lg flex items-center justify-center border-2 border-red-100 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 hover:scale-110 transition-all duration-200"
        >
          <X className="h-7 w-7" />
        </button>
        <button
          onClick={() => topCard && setForcedExit('right')}
          aria-label="Postular a la oferta"
          className="w-20 h-20 rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 transition-all duration-200"
          style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #6366F1 100%)' }}
        >
          <Heart className="h-8 w-8 fill-current" />
        </button>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mb-8">
        Desliza la tarjeta a la derecha para postular, a la izquierda para pasar
      </p>
    </div>
  );

  return (
    <StudentAppLayout activePage="inicio">

      {/* Header con toggle de modo */}
      <div className="py-4 px-4 md:px-8 flex items-center justify-between bg-white dark:bg-gray-900 md:bg-transparent md:dark:bg-transparent sticky top-0 z-20 md:static border-b border-gray-100 dark:border-gray-800 md:border-none mb-4 md:mt-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#1E3A8A] dark:text-white">Ofertas para ti</h1>
          <p className="hidden md:block text-sm text-gray-500 dark:text-gray-400 mt-0.5">Desliza las tarjetas o explora en modo normal</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle Swipe / Normal */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('swipe')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                viewMode === 'swipe' ? 'bg-white dark:bg-gray-700 text-[#1E3A8A] dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Swipe</span>
            </button>
            <button
              onClick={() => setViewMode('normal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                viewMode === 'normal' ? 'bg-white dark:bg-gray-700 text-[#1E3A8A] dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Normal</span>
            </button>
          </div>

          <ThemeToggle compact />

          <button
            onClick={() => setShowFilters(true)}
            aria-label="Filtros de búsqueda"
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <SlidersHorizontal className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Contenido según modo */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 mt-20">
          <div className="w-12 h-12 border-4 border-[#1E3A8A]/20 border-t-[#1E3A8A] dark:border-indigo-400/20 dark:border-t-indigo-400 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Buscando oportunidades...</p>
        </div>
      ) : potentialMatches.length === 0 ? (
        renderEmptyState()
      ) : viewMode === 'swipe' ? (
        renderSwipeMode()
      ) : (
        renderNormalMode()
      )}

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
            setShowFilters(false);
          }}
        />
      )}

      {/* Job Details Modal */}
      {selectedJobDetails && (
        <JobDetailsModal
          job={selectedJobDetails}
          onClose={() => setSelectedJobDetails(null)}
        />
      )}

    </StudentAppLayout>
  );
}
