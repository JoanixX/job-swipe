import { useLocation } from 'wouter';
import { ChevronLeft, Eye, Clock, CheckCircle2, XCircle } from 'lucide-react';
import StudentAppLayout from '../components/StudentAppLayout';
import { useUser } from '../lib/user-context';
import { useQuery } from '@tanstack/react-query';
import { swipeAPI } from '../services/backend-api';

const STATUS_LABEL: Record<string, string> = {
  pendiente: 'Pendiente',
  aceptado: 'Aceptado',
  rechazado: 'No Seleccionado',
};

export default function StudentApplications() {
  const [_, setLocation] = useLocation();
  const { user } = useUser();
  const studentId = user?.profileData?.related_id || user?.id || 0;

  // Una sola llamada con estado real; polling para mantenerlo al día
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['student-applications', studentId],
    queryFn: () => swipeAPI.getStudentApplications(Number(studentId)),
    enabled: !!studentId,
    refetchInterval: 10_000,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendiente': return <Clock className="w-4 h-4 mr-1" />;
      case 'aceptado': return <CheckCircle2 className="w-4 h-4 mr-1" />;
      case 'rechazado': return <XCircle className="w-4 h-4 mr-1" />;
      default: return <Eye className="w-4 h-4 mr-1" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente': return 'text-amber-500 bg-amber-50 dark:bg-amber-950 border border-amber-100 dark:border-amber-900';
      case 'aceptado': return 'text-green-500 bg-green-50 dark:bg-green-950 border border-green-100 dark:border-green-900';
      case 'rechazado': return 'text-red-500 bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700';
    }
  };

  const total = applications.length;
  const pendientes = applications.filter((a: any) => a.status === 'pendiente').length;
  const aceptados = applications.filter((a: any) => a.status === 'aceptado').length;
  const rechazados = applications.filter((a: any) => a.status === 'rechazado').length;

  const stats = [
    { label: 'Total', value: total, color: 'text-[#1E3A8A] dark:text-indigo-300' },
    { label: 'Pendientes', value: pendientes, color: 'text-amber-500' },
    { label: 'Aceptados', value: aceptados, color: 'text-green-500' },
    { label: 'No seleccionados', value: rechazados, color: 'text-red-400' },
  ];

  return (
    <StudentAppLayout activePage="movimientos">

      {/* Header */}
      <div className="py-4 px-6 flex items-center bg-white dark:bg-gray-900 sticky top-0 z-20 border-b border-gray-50 dark:border-gray-800 md:bg-transparent md:dark:bg-transparent md:static md:border-none md:mt-6">
        <button
          onClick={() => setLocation('/matching')}
          className="mr-4 text-gray-500 hover:text-gray-900 dark:hover:text-white md:hidden"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Mis Movimientos</h1>
      </div>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, color }) => (
            <div key={label} className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-50 dark:border-gray-800 flex flex-col items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400 text-sm mb-1">{label}</span>
              <span className={`text-3xl font-bold ${color}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* Applications List */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Todas mis Postulaciones</h2>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-[#1E3A8A]/20 border-t-[#1E3A8A] dark:border-indigo-400/20 dark:border-t-indigo-400 rounded-full animate-spin"></div>
            </div>
          ) : applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((app: any) => (
                <div key={app.match_id} className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-50 dark:border-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <div className="pr-4">
                      <h3 className="font-bold text-gray-900 dark:text-white text-[15px] leading-tight mb-1">{app.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{app.company_name}</p>
                    </div>
                    <div className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                      {STATUS_LABEL[app.status] || app.status}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 text-xs text-gray-400 dark:text-gray-500">
                    <span>{app.location || 'Lima'}</span>
                    <span>Postulado: {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : '—'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No tienes postulaciones actualmente.</p>
                <button
                  onClick={() => setLocation('/matching')}
                  className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#27479E] text-white rounded-lg text-sm font-semibold"
                >
                  Buscar Ofertas
                </button>
             </div>
          )}
        </div>
      </div>

    </StudentAppLayout>
  );
}
