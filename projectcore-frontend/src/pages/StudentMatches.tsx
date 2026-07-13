import { useLocation } from 'wouter';
import { ChevronLeft, Zap, Briefcase, MapPin } from 'lucide-react';
import StudentAppLayout from '../components/StudentAppLayout';
import { useUser } from '../lib/user-context';
import { useQuery } from '@tanstack/react-query';
import { swipeAPI, jobOfferAPI, companyAPI } from '../services/backend-api';

export default function StudentMatches() {
  const [_, setLocation] = useLocation();
  const { user } = useUser();
  const studentId = user?.profileData?.related_id || user?.id || 0;

  // Matches mutuos con detalles, en una sola query con polling (tiempo real)
  const { data: matches = [], isLoading } = useQuery({
    queryKey: ['matches', studentId],
    queryFn: async () => {
      const rawMatches = await swipeAPI.getStudentMatches(Number(studentId));
      return Promise.all(
        rawMatches.map(async (match: any) => {
          try {
            const jobOffer: any = await jobOfferAPI.getById(match.job_offer.id);
            let companyName = 'Empresa';
            let location = 'Lima';
            if (jobOffer.company_id) {
              const company = await companyAPI.getById(jobOffer.company_id);
              companyName = company.name || 'Empresa';
              location = company.location || jobOffer.location || 'Lima';
            }
            return {
              id: match.match_id,
              role: match.job_offer.title,
              company: companyName,
              location,
              dateMatched: new Date(match.match_date || Date.now()).toLocaleDateString(),
            };
          } catch {
            return {
              id: match.match_id,
              role: match.job_offer?.title || `Oferta #${match.job_offer?.id}`,
              company: 'Empresa',
              location: 'Lima',
              dateMatched: new Date(match.match_date || Date.now()).toLocaleDateString(),
            };
          }
        })
      );
    },
    enabled: !!studentId,
    refetchInterval: 10_000,
  });

  return (
    <StudentAppLayout activePage="matches">

      {/* Header */}
      <div className="py-4 px-6 flex items-center bg-white dark:bg-gray-900 sticky top-0 z-20 border-b border-gray-50 dark:border-gray-800 md:bg-transparent md:dark:bg-transparent md:static md:border-none md:mt-6">
        <button
          onClick={() => setLocation('/matching')}
          className="mr-4 text-gray-500 hover:text-gray-900 dark:hover:text-white md:hidden"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Mis Matches</h1>
      </div>

      <div className="p-6">

        {/* Banner Interés Mutuo */}
        <div className="rounded-2xl p-5 mb-8 flex gap-4 text-white" style={{ background: 'linear-gradient(90deg, #1E3A8A 0%, #4150BC 60%, #6366F1 100%)' }}>
          <div className="mt-1">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold mb-1">¡Interés Mutuo!</h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Estas empresas también están interesadas en ti. Pueden contactarte directamente.
            </p>
          </div>
        </div>

        {/* Matches List */}
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          {isLoading ? (
            <div className="flex justify-center p-8 md:col-span-2">
              <div className="w-8 h-8 border-4 border-[#1E3A8A]/20 border-t-[#1E3A8A] dark:border-indigo-400/20 dark:border-t-indigo-400 rounded-full animate-spin"></div>
            </div>
          ) : matches.length > 0 ? (
            matches.map((match: any) => (
              <div key={match.id} className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-50 dark:border-gray-800 relative overflow-hidden">

                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0">
                    <Briefcase className="w-6 h-6 text-[#6366F1]" />
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-[15px] leading-tight mb-1">{match.role}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{match.company}</p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {match.location}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-400 dark:text-gray-500">Match {match.dateMatched}</span>
                  <span className="bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                    Contacto habilitado
                  </span>
                </div>
              </div>
            ))
          ) : (
             <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 md:col-span-2">
                <p className="text-gray-500 dark:text-gray-400 mb-4">Aún no tienes matches. ¡Sigue explorando ofertas!</p>
                <button
                  onClick={() => setLocation('/matching')}
                  className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#27479E] text-white rounded-lg text-sm font-semibold"
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
